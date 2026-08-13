import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAI } from '../../context/AIContext';
import { AIProviderType, AIModelConfig, DEFAULT_AI_PRESETS } from '../../lib/ai/types';

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AISettingsModal: React.FC<AISettingsModalProps> = ({ isOpen, onClose }) => {
  const { config, updateConfig, resetConfig, testConnection } = useAI();
  const [formData, setFormData] = useState<AIModelConfig>(config);
  const [showApiKey, setShowApiKey] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [saveNotification, setSaveNotification] = useState(false);

  useEffect(() => {
    setFormData(config);
    setTestResult(null);
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleProviderChange = (provider: AIProviderType) => {
    const preset = DEFAULT_AI_PRESETS.find((p) => p.provider === provider);
    setFormData((prev) => ({
      ...prev,
      provider,
      modelName: preset?.defaultModel || prev.modelName,
      baseUrl: preset?.defaultBaseUrl || prev.baseUrl,
    }));
    setTestResult(null);
  };

  const handlePresetSelect = (presetId: string) => {
    const preset = DEFAULT_AI_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setFormData((prev) => ({
      ...prev,
      provider: preset.provider,
      modelName: preset.defaultModel,
      baseUrl: preset.defaultBaseUrl || prev.baseUrl,
    }));
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const result = await testConnection(formData);
    setTestResult(result);
    setIsTesting(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
    setSaveNotification(true);
    setTimeout(() => {
      setSaveNotification(false);
      onClose();
    }, 800);
  };

  const handleReset = () => {
    resetConfig();
    setTestResult(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-2xl bg-slate-950 border border-cyan-500/40 rounded-2xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.15)] text-slate-100 relative overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xl">
                <i className="ri-cpu-line animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-orbitron text-cyan-400 tracking-wider">
                  AI ENGINE MODEL CONFIG
                </h2>
                <p className="text-xs text-slate-400">
                  Universal AI Provider & Model Matrix Configuration
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-2xl transition-colors p-1"
            >
              <i className="ri-close-line" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-5 pr-2 custom-scrollbar">
            {/* Quick Model Presets */}
            <div>
              <label className="block text-xs font-orbitron text-cyan-300 uppercase tracking-wider mb-2">
                Quick Model Presets
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {DEFAULT_AI_PRESETS.map((preset) => {
                  const isSelected =
                    formData.provider === preset.provider && formData.modelName === preset.defaultModel;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handlePresetSelect(preset.id)}
                      className={`text-left p-2.5 rounded-lg border text-xs transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                      }`}
                    >
                      <span className="font-semibold">{preset.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono mt-1 capitalize truncate">
                        {preset.provider}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Provider Selection */}
            <div>
              <label className="block text-xs font-orbitron text-cyan-300 uppercase tracking-wider mb-2">
                AI Provider Architecture
              </label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {(['gemini', 'openai', 'anthropic', 'deepseek', 'groq', 'ollama', 'custom'] as AIProviderType[]).map(
                  (prov) => (
                    <button
                      key={prov}
                      type="button"
                      onClick={() => handleProviderChange(prov)}
                      className={`px-3 py-2 rounded-lg text-xs font-mono capitalize border transition-all text-center ${
                        formData.provider === prov
                          ? 'bg-cyan-500 text-black font-bold border-cyan-400'
                          : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {prov}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Model Name & Base URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Model Name / ID</label>
                <input
                  type="text"
                  value={formData.modelName}
                  onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                  placeholder="e.g. gemini-2.5-flash, gpt-4o, deepseek-chat"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-cyan-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  API Base Endpoint URL
                </label>
                <input
                  type="text"
                  value={formData.baseUrl}
                  onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                  placeholder="https://api.openai.com/v1"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-cyan-500 outline-none"
                  required
                />
              </div>
            </div>

            {/* API Key */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-mono text-slate-300">
                  API Authorization Key
                </label>
                <span className="text-[10px] text-slate-500">
                  {formData.provider === 'ollama' ? 'Optional for local Ollama' : 'Required for cloud API'}
                </span>
              </div>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  placeholder={
                    formData.provider === 'gemini'
                      ? 'AIzaSy...'
                      : formData.provider === 'openai'
                      ? 'sk-...'
                      : 'Enter API Key'
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-3 pr-10 py-2 text-xs font-mono text-white focus:border-cyan-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  <i className={showApiKey ? 'ri-eye-off-line' : 'ri-eye-line'} />
                </button>
              </div>
            </div>

            {/* System Instruction */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                System Persona / Prompt Instruction
              </label>
              <textarea
                value={formData.systemInstruction || ''}
                onChange={(e) => setFormData({ ...formData, systemInstruction: e.target.value })}
                rows={2}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs font-mono text-white focus:border-cyan-500 outline-none resize-none"
                placeholder="Custom agent behavior directive..."
              />
            </div>

            {/* Parameters (Temperature & Max Tokens) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                  <span>Temperature (Randomness)</span>
                  <span className="text-cyan-400">{formData.temperature}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1.5"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                  <span>Max Tokens</span>
                  <span className="text-cyan-400">{formData.maxTokens}</span>
                </div>
                <input
                  type="range"
                  min="256"
                  max="8192"
                  step="256"
                  value={formData.maxTokens}
                  onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value, 10) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Connection Test Result Feedback */}
            {testResult && (
              <div
                className={`p-3 rounded-xl border text-xs font-mono flex items-start gap-2 ${
                  testResult.success
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                    : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                }`}
              >
                <i
                  className={`mt-0.5 text-base ${
                    testResult.success ? 'ri-checkbox-circle-line' : 'ri-error-warning-line'
                  }`}
                />
                <div>
                  <p className="font-bold">{testResult.success ? 'CONNECTION SUCCESSFUL' : 'CONNECTION ERROR'}</p>
                  <p className="opacity-90 mt-0.5">{testResult.message}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <i className={`ri-radar-line ${isTesting ? 'animate-spin text-cyan-400' : ''}`} />
                  {isTesting ? 'Pinging Model...' : 'Test Connection'}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-2 text-slate-400 hover:text-slate-200 text-xs font-mono transition-colors"
                >
                  Reset Defaults
                </button>
              </div>

              <div className="flex items-center gap-2">
                {saveNotification && (
                  <span className="text-xs font-mono text-emerald-400 animate-pulse">
                    Saved & Applied!
                  </span>
                )}
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-orbitron font-bold rounded-lg text-xs tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                >
                  SAVE & APPLY MODEL
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AISettingsModal;
