import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AIModelConfig, AICompletionRequest, AICompletionResponse } from '../lib/ai/types';
import { aiService } from '../lib/ai/aiService';

export interface AIContextType {
  config: AIModelConfig;
  isGenerating: boolean;
  lastResponse: AICompletionResponse | null;
  error: string | null;
  invokeAI: (prompt: string, options?: Partial<AICompletionRequest>) => Promise<AICompletionResponse>;
  updateConfig: (newConfig: AIModelConfig) => void;
  resetConfig: () => void;
  testConnection: (testConfig?: AIModelConfig) => Promise<{ success: boolean; message: string }>;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AIModelConfig>(aiService.getConfig());
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastResponse, setLastResponse] = useState<AICompletionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateConfig = useCallback((newConfig: AIModelConfig) => {
    aiService.saveConfig(newConfig);
    setConfig(newConfig);
    setError(null);
  }, []);

  const resetConfig = useCallback(() => {
    const defaultConfig = aiService.resetConfig();
    setConfig(defaultConfig);
    setError(null);
  }, []);

  const testConnection = useCallback(async (testConfig?: AIModelConfig) => {
    return await aiService.testConnection(testConfig || config);
  }, [config]);

  const invokeAI = useCallback(
    async (prompt: string, options?: Partial<AICompletionRequest>): Promise<AICompletionResponse> => {
      setIsGenerating(true);
      setError(null);

      const request: AICompletionRequest = {
        prompt,
        ...options,
      };

      try {
        const response = await aiService.generateCompletion(request);
        setLastResponse(response);
        if (response.error) {
          setError(response.error);
        }
        setIsGenerating(false);
        return response;
      } catch (err: any) {
        const errMsg = err.message || 'An unknown AI generation error occurred';
        setError(errMsg);
        setIsGenerating(false);
        const errResp: AICompletionResponse = {
          text: `[TEMPORAL AI ERROR]: ${errMsg}`,
          providerUsed: config.provider,
          modelUsed: config.modelName,
          error: errMsg,
        };
        setLastResponse(errResp);
        return errResp;
      }
    },
    [config]
  );

  return (
    <AIContext.Provider
      value={{
        config,
        isGenerating,
        lastResponse,
        error,
        invokeAI,
        updateConfig,
        resetConfig,
        testConnection,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = (): AIContextType => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
