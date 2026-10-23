import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/app');
    } else {
      navigate('/login');
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200 font-sans relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Banner alert */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-indigo-900/40 border-b border-indigo-500/20 py-2.5 px-4 text-center text-xs text-indigo-300 font-medium">
        <span className="inline-block px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold mr-2 border border-indigo-500/30">
          LOCAL &amp; PRIVATE
        </span>
        Zero third-party data tracking. Powered by Ollama, ChromaDB &amp; PostgreSQL.
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#09090b]/80 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-md shadow-indigo-500/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              DocMind AI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400 font-medium">
            <button onClick={() => scrollToSection('features')} className="hover:text-zinc-100 transition-colors">
              Features
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-zinc-100 transition-colors">
              How It Works
            </button>
            <button onClick={() => scrollToSection('documentation')} className="hover:text-zinc-100 transition-colors">
              Documentation
            </button>
            <button onClick={() => scrollToSection('setup')} className="hover:text-zinc-100 transition-colors">
              Setup Guide
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/app')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-600/20"
              >
                Go to App &rarr;
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-zinc-300 hover:text-white text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl text-sm font-medium transition-colors border border-white/10"
                >
                  Register
                </Link>
                <button
                  onClick={handleGetStarted}
                  className="hidden sm:inline-flex px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-600/20"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-white/10 text-xs font-medium text-zinc-300 mb-8 shadow-inner animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Local Retrieval-Augmented Generation (RAG)</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 max-w-4xl mx-auto leading-[1.1]">
          Intelligent Document &amp; PDF Insights with <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200 bg-clip-text text-transparent">Local AI</span>
        </h1>

        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload complex PDF documents and ask questions instantly. DocMind AI extracts context with local vector search and delivers accurate, source-grounded answers.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <button
            onClick={handleGetStarted}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-xl text-base transition-all shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 group"
          >
            <span>Get Started Free</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
          {!isAuthenticated && (
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-semibold rounded-xl text-base transition-colors border border-white/10 flex items-center justify-center"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Dashboard Mockup Banner */}
        <div className="relative rounded-2xl border border-white/10 bg-zinc-900/60 p-2 sm:p-4 shadow-2xl backdrop-blur-xl max-w-5xl mx-auto overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent z-10 pointer-events-none h-full" />
          <div className="bg-zinc-950 rounded-xl border border-white/[0.06] p-6 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-xs text-zinc-500 font-mono ml-2">DocMind AI — Document Assistant</span>
              </div>
              <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20 font-medium">Llama 3.2 Active</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/5 space-y-2">
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Indexed Document</span>
                <p className="text-sm text-zinc-200 font-medium truncate">📄 Quarterly_Financial_Report.pdf</p>
                <p className="text-xs text-emerald-400 font-mono">Status: 42 Vector Chunks Indexed</p>
              </div>

              <div className="md:col-span-2 p-4 rounded-xl bg-zinc-900/80 border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-xs text-indigo-300 font-medium">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span>Prompt: "Summarize the Q3 revenue growth and key drivers."</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/70 p-3 rounded-lg border border-white/5">
                  "According to page 4 of Quarterly_Financial_Report.pdf, Q3 revenue increased by 18% year-over-year to $4.2M. Growth was primarily driven by recurring subscription sales (+24%) and expansion in enterprise accounts."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. Features Section */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.06]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">Capabilities</h2>
          <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Everything you need for document intelligence</p>
          <p className="text-zinc-400 mt-4 text-base">Built from the ground up for high accuracy, minimal latency, and zero data leakage.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: "📄",
              title: "Upload PDF Documents",
              desc: "Seamlessly parse, clean, and extract text from structured multi-page PDF documents."
            },
            {
              icon: "❓",
              title: "Ask Questions",
              desc: "Query your documents in natural conversational language with complex contextual understanding."
            },
            {
              icon: "⚡",
              title: "AI-Powered Answers",
              desc: "Get instant responses synthesized by local open-weights LLMs via Ollama integration."
            },
            {
              icon: "🔍",
              title: "Source-Based Responses",
              desc: "Every answer cites exact document text and chunk references so you can verify facts easily."
            },
            {
              icon: "🔒",
              title: "Local & Private Processing",
              desc: "All embeddings and inference happen on your machine. Your sensitive documents never leave your server."
            },
            {
              icon: "🚀",
              title: "Fast Document Retrieval",
              desc: "High-performance vector similarity search backed by ChromaDB vector storage."
            }
          ].map((feature, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/10 bg-zinc-900/40 hover:border-indigo-500/30 transition-all hover:translate-y-[-2px]">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-2xl flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">{feature.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. How It Works Section */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-zinc-950/40">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">Workflow</h2>
          <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">How DocMind AI Works</p>
          <p className="text-zinc-400 mt-4 text-base">Five simple steps from document upload to actionable intelligence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            { step: "01", title: "Register / Login", desc: "Create your secure account backed by PostgreSQL authentication." },
            { step: "02", title: "Upload PDF", desc: "Select and upload target PDF documents into your workspace." },
            { step: "03", title: "Indexing", desc: "Documents are split into semantic chunks and embedded in ChromaDB." },
            { step: "04", title: "Ask Questions", desc: "Type natural prompts regarding specific details or overviews." },
            { step: "05", title: "Get Answers", desc: "Receive accurate AI answers backed by cited document chunks." }
          ].map((item, idx) => (
            <div key={idx} className="relative p-6 rounded-2xl bg-zinc-900/60 border border-white/10 flex flex-col justify-between space-y-4">
              <span className="text-2xl font-mono font-bold text-indigo-400">{item.step}</span>
              <div>
                <h3 className="text-base font-semibold text-zinc-100 mb-1">{item.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Documentation Section */}
      <section id="documentation" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.06]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">Architecture &amp; Tech Stack</h2>
            <p className="text-3xl font-bold text-white tracking-tight mb-6">Modern Stack for Local AI</p>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              DocMind AI combines modular web frontend architecture with high-speed async backend Python services, ensuring rapid processing of document uploads and vector operations.
            </p>
            <div className="space-y-4">
              {[
                { name: "React", detail: "Responsive SPA frontend styled with custom glassmorphism and TailwindCSS." },
                { name: "FastAPI", detail: "High-performance Python backend providing async API endpoints." },
                { name: "Ollama", detail: "Local execution of open-weights LLMs (Llama 3.2) without cloud APIs." },
                { name: "ChromaDB", detail: "Vector database for storing embeddings and fast similarity retrieval." },
                { name: "PostgreSQL", detail: "Relational storage for secure user authentication and session management." }
              ].map((tech, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/50 border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-semibold text-zinc-200">{tech.name}: </span>
                    <span className="text-sm text-zinc-400">{tech.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-zinc-900/60 font-mono text-xs text-zinc-300 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 text-zinc-500">
              <span>architecture-overview.json</span>
              <span>FastAPI + LangChain + Chroma</span>
            </div>
            <pre className="text-indigo-300 leading-relaxed overflow-x-auto">
{`{
  "application": "DocMind AI",
  "pipeline": {
    "ingestion": "PyPDFLoader -> RecursiveCharacterTextSplitter",
    "embeddings": "OllamaEmbeddings (nomic-embed-text / llama3.2)",
    "vector_store": "ChromaDB Persistent Client",
    "retrieval": "Similarity Search (k=4 top chunks)",
    "generation": "ChatOllama (Llama 3.2)",
    "database": "PostgreSQL (psycopg3 + SQLAlchemy)"
  }
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* 4. Setup Guide Section */}
      <section id="setup" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-zinc-950/40">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">Developer Guide</h2>
          <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Quick Setup Overview</p>
          <p className="text-zinc-400 mt-4 text-base">Follow these steps to run DocMind AI locally in your environment.</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {[
            { step: "1", title: "Install Python Dependencies", code: "pip install -r requirements.txt" },
            { step: "2", title: "Configure PostgreSQL", code: "# Ensure PostgreSQL service is running and set DATABASE_URL in .env\nDATABASE_URL=postgresql+psycopg://postgres:password@localhost:5432/pdf_rag_db" },
            { step: "3", title: "Configure Environment Variables", code: "# Copy .env.example to .env and adjust variables as needed\ncp .env.example .env" },
            { step: "4", title: "Ensure Ollama is Running", code: "ollama run llama3.2" },
            { step: "5", title: "Start FastAPI Backend & React Frontend", code: "# Backend (Root)\nuvicorn main:app --reload\n\n# Frontend (/frontend)\nnpm run dev" }
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 font-mono font-bold text-xs flex items-center justify-center border border-indigo-500/30">
                  {item.step}
                </span>
                <h3 className="text-base font-semibold text-zinc-100">{item.title}</h3>
              </div>
              <div className="bg-zinc-950 p-4 rounded-xl border border-white/5 font-mono text-xs text-zinc-300 overflow-x-auto">
                {item.code}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Final CTA */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600/10 rounded-3xl blur-3xl pointer-events-none" />
        <div className="relative z-10 glass-panel p-12 sm:p-16 rounded-3xl border border-white/10 bg-zinc-900/60 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Start using DocMind AI
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto mb-8">
            Experience intelligent document search with privacy-first local AI processing today.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-base transition-all shadow-xl shadow-indigo-600/30 inline-flex items-center gap-2 group"
          >
            <span>Get Started Now</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-8 text-center text-xs text-zinc-500">
        <p>&copy; {new Date().getFullYear()} DocMind AI. Built with React, FastAPI &amp; Ollama.</p>
      </footer>
    </div>
  );
}
