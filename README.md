# 🌀 NVK Time Machine - Quantum Entanglement Engine v2.0

An interactive, sci-fi temporal mechanics web application powered by a **Pluggable Universal AI Architecture**. Calculate quantum entanglement coherence, warp across spacetime coordinates, prevent grandfather paradoxes with localized timeline shields, and interact with an onboard AI Engine powered by any LLM of your choice.

![NVK Time Machine Banner](https://img.shields.io/badge/AI-Swappable_Multi--Model-cyan?style=for-the-badge&logo=openai)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss)

---

## ⚡ Pluggable Universal AI Model Architecture

The NVK Time Machine features a completely decoupled, provider-agnostic AI model architecture (`/lib/ai/`). You can easily swap between any AI model or provider directly through the **UI Settings Modal** or via environment variables.

### Supported AI Providers & Models out of the box:

- 🟢 **Google Gemini**: `gemini-2.5-flash`, `gemini-2.5-pro`, `gemini-1.5-flash`
- 🟢 **OpenAI**: `gpt-4o`, `gpt-4o-mini`, `o3-mini`
- 🟢 **DeepSeek**: `deepseek-chat` (DeepSeek-V3), `deepseek-reasoner` (DeepSeek-R1)
- 🟢 **Groq (LPU Speed)**: `llama-3.3-70b-versatile`, `mixtral-8x7b-32768`
- 🟢 **Anthropic Claude**: `claude-3-5-sonnet`, `claude-3-5-haiku`
- 🟢 **Local / Offline (Ollama)**: `llama3.2`, `deepseek-r1:8b`, `mistral`, `qwen2.5`
- 🟢 **Custom / OpenRouter**: Connect to any OpenAI-compatible custom endpoint or proxy.

---

## 🎮 How to Swap AI Models

### Option 1: Live UI Model Matrix (No rebuild needed)
1. Launch the application.
2. Click the **"SWAP MODEL"** badge in the header or open the **"AI Engine"** tab.
3. Select any quick preset (e.g. *Google Gemini 2.5 Flash*, *DeepSeek-R1*, *OpenAI GPT-4o-mini*, *Local Ollama*).
4. Enter your API Key or custom endpoint URL.
5. Click **"Test Connection"** to verify live model ping, then **"SAVE & APPLY MODEL"**.

### Option 2: Environment Variables
Copy `.env.example` to `.env` and set your preferred defaults:

```bash
cp .env.example .env
```

Example `.env` configuration:
```env
# Change provider to 'openai', 'deepseek', 'groq', 'gemini', 'anthropic', or 'ollama'
VITE_AI_PROVIDER=deepseek
VITE_AI_MODEL=deepseek-reasoner

# API Key
VITE_DEEPSEEK_API_KEY=your_deepseek_key_here
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/your-username/nvk-time-machine.git
cd nvk-time-machine

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Build & Deployment

To compile for production:

```bash
npm run build
```

To run production build locally:

```bash
npm run start
```

---

## 📁 Repository Architecture

```
├── components/
│   ├── modals/
│   │   └── AISettingsModal.tsx      # Interactive model selection & connection tester
│   ├── panels/
│   │   ├── AICommsPanel.tsx         # Direct AI Core chat & query interface
│   │   ├── QuantumCorePanel.tsx     # Quantum coherence & Bell state controls
│   │   └── GlobalTimeDashboard.tsx  # World clock & temporal visualization
│   └── watch-faces/                 # Canvas-rendered sci-fi watch faces
├── context/
│   └── AIContext.tsx                # React context wrapping AI model state
├── lib/
│   ├── ai/
│   │   ├── aiService.ts             # Universal multi-provider REST client
│   │   └── types.ts                 # AI model config types & presets
│   └── quantum.ts                   # Quantum physics simulation algorithms
├── .env.example                     # Sample environment variable template
├── App.tsx                          # Primary entry point
└── package.json
```

---

## 📜 License

MIT License. Free for open source development and temporal experimentation.
