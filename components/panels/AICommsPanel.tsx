import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAI } from '../../context/AIContext';
import { AgentName } from '../../types';

interface AICommsPanelProps {
  onOpenModelSettings: () => void;
  addEchoMessage?: (agent: AgentName | string, text: string, colorClass?: string) => void;
}

export const AICommsPanel: React.FC<AICommsPanelProps> = ({
  onOpenModelSettings,
  addEchoMessage,
}) => {
  const { config, isGenerating, invokeAI, error } = useAI();
  const [inputPrompt, setInputPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<
    { id: string; role: 'user' | 'model'; text: string; provider?: string; model?: string; timestamp: Date }[]
  >([
    {
      id: 'init-1',
      role: 'model',
      text: `QUANTUM AI CORE INITIALIZED.\nActive Model Provider: ${config.provider.toUpperCase()} (${config.modelName})\nState: Temporal field standing by. Submit inquiry for instant processing across timeline coordinates.`,
      provider: config.provider,
      model: config.modelName,
      timestamp: new Date(),
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isGenerating]);

  const handleSend = async () => {
    if (!inputPrompt.trim() || isGenerating) return;

    const userText = inputPrompt.trim();
    setInputPrompt('');

    const userMsgId = `user-${Date.now()}`;
    setChatHistory((prev) => [
      ...prev,
      { id: userMsgId, role: 'user', text: userText, timestamp: new Date() },
    ]);

    const res = await invokeAI(userText, {
      systemInstruction:
        config.systemInstruction ||
        'You are the Sovereign Quantum AI Core onboard the NVK Time Machine. Answer temporal, scientific, or philosophical queries concisely with sci-fi authority.',
    });

    const modelMsgId = `model-${Date.now()}`;
    setChatHistory((prev) => [
      ...prev,
      {
        id: modelMsgId,
        role: 'model',
        text: res.text,
        provider: res.providerUsed,
        model: res.modelUsed,
        timestamp: new Date(),
      },
    ]);

    if (addEchoMessage) {
      addEchoMessage(
        `AI (${res.modelUsed})`,
        res.text.length > 200 ? res.text.slice(0, 197) + '...' : res.text,
        'text-cyan-300'
      );
    }
  };

  return (
    <div className="bg-slate-950/80 backdrop-blur-md rounded-2xl border border-cyan-500/30 p-4 md:p-6 shadow-xl flex flex-col h-[520px]">
      {/* Panel Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <i className="ri-brain-line text-lg animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold font-orbitron text-cyan-400 tracking-wider">
              QUANTUM AI CORE COMMS
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Pluggable Multi-Model AI Interface
            </p>
          </div>
        </div>

        {/* Active Model Indicator & Switcher Button */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-700 rounded-full text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400 uppercase">{config.provider}:</span>
            <span className="text-cyan-300 font-bold">{config.modelName}</span>
          </div>

          <button
            onClick={onOpenModelSettings}
            className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 rounded-lg text-xs font-orbitron text-cyan-200 hover:text-white transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
          >
            <i className="ri-settings-4-line" />
            SWAP MODEL
          </button>
        </div>
      </div>

      {/* Chat Messages Window */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 p-3 bg-slate-900/40 rounded-xl border border-slate-800/80 custom-scrollbar mb-4"
      >
        <AnimatePresence initial={false}>
          {chatHistory.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs font-mono leading-relaxed border ${
                    isUser
                      ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-100 rounded-tr-none shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                      : 'bg-slate-900/90 border-slate-700/80 text-slate-200 rounded-tl-none shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-75 font-orbitron pb-1 border-b border-white/10">
                    <span className={isUser ? 'text-cyan-300 font-bold' : 'text-purple-300 font-bold'}>
                      {isUser ? 'CHRONO PILOT' : `AI ENGINE [${msg.provider?.toUpperCase() || config.provider.toUpperCase()}]`}
                    </span>
                    <span className="text-slate-400">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>

                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {!isUser && msg.model && (
                    <div className="mt-2 text-[9px] text-slate-500 font-mono tracking-wide text-right">
                      MODEL: {msg.model}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {isGenerating && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-purple-950/40 border border-purple-500/30 rounded-2xl p-3.5 text-xs font-mono text-purple-200 flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping" />
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping [animation-delay:0.4s]" />
                </div>
                <span>PROCESSING INQUIRY VIA {config.modelName.toUpperCase()}...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-3 px-3 py-2 bg-rose-950/60 border border-rose-500/40 rounded-lg text-xs font-mono text-rose-300 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={onOpenModelSettings} className="underline text-rose-200 ml-2 font-bold">
            Configure Key
          </button>
        </div>
      )}

      {/* Input Field & Send */}
      <div className="flex gap-2">
        <textarea
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={`Inquire with ${config.modelName}... (Shift+Enter for new line)`}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:border-cyan-500 outline-none resize-none"
          rows={2}
          disabled={isGenerating}
        />
        <button
          onClick={handleSend}
          disabled={isGenerating || !inputPrompt.trim()}
          className="px-5 bg-cyan-500 hover:bg-cyan-400 text-black font-orbitron font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        >
          <i className="ri-send-plane-fill text-sm" />
          <span>INQUIRE</span>
        </button>
      </div>
    </div>
  );
};

export default AICommsPanel;
