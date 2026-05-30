# PromptOS

> Transform messy prompts into optimized, structured masterpieces with a 4-agent AI pipeline.

## Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Zustand
- **Backend**: FastAPI, SQLite, SQLAlchemy
- **AI**: Ollama (Llama 3.1)

## Quick Start

### 1. Start Ollama
```bash
ollama serve
# In another terminal, make sure llama3.1 is available:
ollama pull llama3.1
```

### 2. Start Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

### 3. Start Frontend
```bash
cd frontend
npm run dev
```

Open http://localhost:3000

## Features
- **4-Agent Pipeline**: Analyzer → Cleaner → Builder → Optimizer
- **SSE Streaming**: Real-time step-by-step UI updates
- **Dev Mode**: Full sidebar with pipeline visualization, scores, token metrics
- **Templates**: Pre-built prompt architectures with category filtering
- **History**: Expandable cards with re-run functionality
- **Settings**: Theme toggle, Dev Mode, API key management
