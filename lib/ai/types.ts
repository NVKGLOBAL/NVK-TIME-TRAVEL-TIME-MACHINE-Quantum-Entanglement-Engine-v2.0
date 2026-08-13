export type AIProviderType = 
  | 'gemini' 
  | 'openai' 
  | 'anthropic' 
  | 'deepseek' 
  | 'groq' 
  | 'ollama' 
  | 'custom';

export interface AIModelPreset {
  id: string;
  name: string;
  provider: AIProviderType;
  defaultModel: string;
  defaultBaseUrl?: string;
  description: string;
}

export interface AIModelConfig {
  provider: AIProviderType;
  modelName: string;
  apiKey: string;
  baseUrl: string;
  temperature: number;
  maxTokens: number;
  systemInstruction?: string;
}

export interface AICompletionRequest {
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AICompletionResponse {
  text: string;
  providerUsed: AIProviderType;
  modelUsed: string;
  error?: string;
}

export const DEFAULT_AI_PRESETS: AIModelPreset[] = [
  {
    id: 'gemini-2.5-flash',
    name: 'Google Gemini 2.5 Flash',
    provider: 'gemini',
    defaultModel: 'gemini-2.5-flash',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    description: 'Fast, highly intelligent multimodal model by Google (Recommended default)'
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Google Gemini 2.5 Pro',
    provider: 'gemini',
    defaultModel: 'gemini-2.5-pro',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    description: 'Advanced reasoning model for complex temporal and quantum calculations'
  },
  {
    id: 'openai-gpt-4o-mini',
    name: 'OpenAI GPT-4o Mini',
    provider: 'openai',
    defaultModel: 'gpt-4o-mini',
    defaultBaseUrl: 'https://api.openai.com/v1',
    description: 'Lightweight, fast, and affordable OpenAI model'
  },
  {
    id: 'openai-gpt-4o',
    name: 'OpenAI GPT-4o',
    provider: 'openai',
    defaultModel: 'gpt-4o',
    defaultBaseUrl: 'https://api.openai.com/v1',
    description: 'High-capability flagship model from OpenAI'
  },
  {
    id: 'deepseek-chat',
    name: 'DeepSeek-V3 Chat',
    provider: 'deepseek',
    defaultModel: 'deepseek-chat',
    defaultBaseUrl: 'https://api.deepseek.com/v1',
    description: 'Powerful, economical model by DeepSeek'
  },
  {
    id: 'deepseek-reasoner',
    name: 'DeepSeek-R1 Reasoner',
    provider: 'deepseek',
    defaultModel: 'deepseek-reasoner',
    defaultBaseUrl: 'https://api.deepseek.com/v1',
    description: 'Chain-of-thought reasoning model by DeepSeek'
  },
  {
    id: 'groq-llama-3.3-70b',
    name: 'Groq Llama 3.3 70B',
    provider: 'groq',
    defaultModel: 'llama-3.3-70b-versatile',
    defaultBaseUrl: 'https://api.groq.com/openai/v1',
    description: 'Ultra-fast inference powered by Groq LPU'
  },
  {
    id: 'anthropic-claude-3-5-sonnet',
    name: 'Anthropic Claude 3.5 Sonnet',
    provider: 'anthropic',
    defaultModel: 'claude-3-5-sonnet-20241022',
    defaultBaseUrl: 'https://api.anthropic.com/v1',
    description: 'State-of-the-art reasoning and nuance by Anthropic'
  },
  {
    id: 'ollama-local',
    name: 'Local Ollama (Offline)',
    provider: 'ollama',
    defaultModel: 'llama3.2',
    defaultBaseUrl: 'http://localhost:11434/v1',
    description: 'Run completely offline on your local machine via Ollama'
  },
  {
    id: 'custom-endpoint',
    name: 'Custom / OpenRouter API',
    provider: 'custom',
    defaultModel: 'custom-model',
    defaultBaseUrl: 'https://openrouter.ai/api/v1',
    description: 'Connect to any OpenAI-compatible custom endpoint or proxy'
  }
];
