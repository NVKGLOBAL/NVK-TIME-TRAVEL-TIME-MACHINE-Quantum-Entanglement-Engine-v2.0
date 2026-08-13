import { AIModelConfig, AICompletionRequest, AICompletionResponse, DEFAULT_AI_PRESETS } from './types';

const STORAGE_KEY = 'nvk_chrono_ai_config_v1';

// Default initial config based on env vars or sensible default
export const getDefaultAIConfig = (): AIModelConfig => {
  const envKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  const envProvider = (process.env.VITE_AI_PROVIDER || 'gemini') as any;

  return {
    provider: envProvider,
    modelName: process.env.VITE_AI_MODEL || 'gemini-2.5-flash',
    apiKey: envKey,
    baseUrl: process.env.VITE_AI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta',
    temperature: 0.7,
    maxTokens: 1024,
    systemInstruction: 'You are the Quantum Temporal AI Core onboard the NVK Time Machine. Respond concisely, scientifically, and with subtle sci-fi authority.',
  };
};

export class AIService {
  private config: AIModelConfig;

  constructor() {
    this.config = this.loadStoredConfig();
  }

  private loadStoredConfig(): AIModelConfig {
    const defaultConfig = getDefaultAIConfig();
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultConfig, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load stored AI config:', e);
    }
    return defaultConfig;
  }

  public getConfig(): AIModelConfig {
    return { ...this.config };
  }

  public saveConfig(newConfig: AIModelConfig): void {
    this.config = { ...newConfig };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
    } catch (e) {
      console.error('Failed to persist AI config to localStorage:', e);
    }
  }

  public resetConfig(): AIModelConfig {
    const defaultConfig = getDefaultAIConfig();
    this.saveConfig(defaultConfig);
    return defaultConfig;
  }

  /**
   * Main completion entrypoint. Dispatches to provider-specific handler.
   */
  public async generateCompletion(request: AICompletionRequest): Promise<AICompletionResponse> {
    const { provider, apiKey, modelName, baseUrl, temperature, maxTokens, systemInstruction: defaultSysInst } = this.config;
    const sysInstruction = request.systemInstruction || defaultSysInst;
    const temp = request.temperature ?? temperature;
    const tokens = request.maxTokens ?? maxTokens;

    // Check if key is required and missing
    if (provider !== 'ollama' && !apiKey && !baseUrl.includes('localhost')) {
      return this.generateFallbackResponse(
        request.prompt,
        provider,
        modelName,
        'API Key is missing. Please configure your API key in AI Engine Settings or .env file.'
      );
    }

    try {
      switch (provider) {
        case 'gemini':
          return await this.callGeminiAPI(request.prompt, sysInstruction, temp, tokens);
        case 'anthropic':
          return await this.callAnthropicAPI(request.prompt, sysInstruction, temp, tokens);
        case 'openai':
        case 'deepseek':
        case 'groq':
        case 'ollama':
        case 'custom':
        default:
          return await this.callOpenAICompatibleAPI(request.prompt, sysInstruction, temp, tokens);
      }
    } catch (err: any) {
      console.error(`AI Generation error (${provider}/${modelName}):`, err);
      return this.generateFallbackResponse(
        request.prompt,
        provider,
        modelName,
        err.message || 'Network error or invalid API response'
      );
    }
  }

  /**
   * Google Gemini REST API / SDK handler
   */
  private async callGeminiAPI(
    prompt: string,
    systemInstruction?: string,
    temperature?: number,
    maxOutputTokens?: number
  ): Promise<AICompletionResponse> {
    const { apiKey, modelName, baseUrl } = this.config;
    const cleanBaseUrl = (baseUrl || 'https://generativelanguage.googleapis.com/v1beta').replace(/\/$/, '');
    const url = `${cleanBaseUrl}/models/${modelName}:generateContent?key=${apiKey}`;

    const contents: any[] = [];
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    const body: any = {
      contents,
      generationConfig: {
        temperature: temperature ?? 0.7,
        maxOutputTokens: maxOutputTokens ?? 1024,
      }
    };

    if (systemInstruction) {
      body.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Gemini HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.map((p: any) => p.text).join('') || '';

    if (!text) {
      throw new Error('Received empty response from Gemini API.');
    }

    return {
      text,
      providerUsed: 'gemini',
      modelUsed: modelName,
    };
  }

  /**
   * OpenAI & OpenAI-compatible endpoints (DeepSeek, Groq, Ollama, OpenRouter, Custom)
   */
  private async callOpenAICompatibleAPI(
    prompt: string,
    systemInstruction?: string,
    temperature?: number,
    maxTokens?: number
  ): Promise<AICompletionResponse> {
    const { apiKey, modelName, baseUrl, provider } = this.config;
    
    let endpoint = baseUrl || 'https://api.openai.com/v1';
    endpoint = endpoint.replace(/\/$/, '');
    if (!endpoint.endsWith('/chat/completions')) {
      endpoint = `${endpoint}/chat/completions`;
    }

    const messages: { role: string; content: string }[] = [];
    if (systemInstruction) {
      messages.push({ role: 'system', content: systemInstruction });
    }
    messages.push({ role: 'user', content: prompt });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const body: any = {
      model: modelName,
      messages,
      temperature: temperature ?? 0.7,
      max_tokens: maxTokens ?? 1024,
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `${provider.toUpperCase()} API HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || '';

    if (!text) {
      throw new Error('Received empty response from endpoint.');
    }

    return {
      text,
      providerUsed: provider,
      modelUsed: modelName,
    };
  }

  /**
   * Anthropic Claude API
   */
  private async callAnthropicAPI(
    prompt: string,
    systemInstruction?: string,
    temperature?: number,
    maxTokens?: number
  ): Promise<AICompletionResponse> {
    const { apiKey, modelName, baseUrl } = this.config;
    let endpoint = baseUrl || 'https://api.anthropic.com/v1';
    endpoint = endpoint.replace(/\/$/, '');
    if (!endpoint.endsWith('/messages')) {
      endpoint = `${endpoint}/messages`;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'dangerously-allow-browser': 'true', // Needed for direct browser requests
    };

    const body: any = {
      model: modelName,
      max_tokens: maxTokens ?? 1024,
      temperature: temperature ?? 0.7,
      messages: [{ role: 'user', content: prompt }],
    };

    if (systemInstruction) {
      body.system = systemInstruction;
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Anthropic HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    const text = data.content?.[0]?.text || '';

    return {
      text,
      providerUsed: 'anthropic',
      modelUsed: modelName,
    };
  }

  /**
   * Connection health check test
   */
  public async testConnection(testConfig?: AIModelConfig): Promise<{ success: boolean; message: string }> {
    const originalConfig = this.config;
    if (testConfig) {
      this.config = testConfig;
    }

    try {
      const res = await this.generateCompletion({
        prompt: 'System health ping check. Respond with "QUANTUM_ENGINE_ONLINE".',
        maxTokens: 20,
      });

      this.config = originalConfig;

      if (res.error) {
        return { success: false, message: res.error };
      }
      return {
        success: true,
        message: `Connected successfully to ${res.providerUsed.toUpperCase()} (${res.modelUsed}). Response: "${res.text.trim().slice(0, 60)}"`,
      };
    } catch (err: any) {
      this.config = originalConfig;
      return {
        success: false,
        message: err.message || 'Connection test failed.',
      };
    }
  }

  /**
   * Graceful simulated fallback if offline or no key configured
   */
  private generateFallbackResponse(
    prompt: string,
    provider: string,
    model: string,
    warningMsg: string
  ): AICompletionResponse {
    const fallbackText = `[QUANTUM CHRONO SIMULATOR] ${warningMsg}\n\n` +
      `Processed Query: "${prompt.slice(0, 100)}..."\n` +
      `Status: Temporal field coherent. To connect live AI models (${provider}/${model}), open AI Settings and input your API key.`;

    return {
      text: fallbackText,
      providerUsed: provider as any,
      modelUsed: `${model} (Simulated)`,
      error: warningMsg,
    };
  }
}

export const aiService = new AIService();
