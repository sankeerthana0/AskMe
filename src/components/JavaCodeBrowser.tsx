import React, { useState } from 'react';
import { Code2, Copy, Check, FileText, Download, Search, Server, Cpu, Layers } from 'lucide-react';
import { JAVA_CODEBASE } from '../data/javaCodebase';
import { JavaCodeFile } from '../types';

export const JavaCodeBrowser: React.FC = () => {
  const [selectedFileId, setSelectedFileId] = useState<string>('netty-server');
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeFile = JAVA_CODEBASE.find((f) => f.id === selectedFileId) || JAVA_CODEBASE[0];

  const filteredFiles = JAVA_CODEBASE.filter(
    (f) =>
      f.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([activeFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* File Explorer Sidebar */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4 text-amber-400" />
              Java Backend Code Repository
            </h3>
            <span className="text-xs text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded">
              Pure Java
            </span>
          </div>

          {/* Search Box */}
          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search classes, Netty handlers..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          {/* File List Grouped by Category */}
          <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
            {filteredFiles.map((file) => {
              const isSelected = selectedFileId === file.id;
              return (
                <button
                  key={file.id}
                  onClick={() => setSelectedFileId(file.id)}
                  className={`w-full text-left p-2.5 rounded-lg border transition ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/40 text-slate-100 shadow'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs flex items-center gap-1.5 text-slate-200">
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      {file.filename}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {file.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-1 font-mono">
                    {file.path}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Key Architectural Highlights Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <h4 className="text-xs font-bold text-amber-300 font-mono uppercase mb-2 flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>Class Implementation Highlights</span>
          </h4>

          <ul className="space-y-1.5 font-mono text-xs text-slate-400">
            {activeFile.keyHighlights.map((hl, idx) => (
              <li key={idx} className="flex items-start space-x-2 bg-slate-900/80 p-2 rounded border border-slate-800/60">
                <span className="text-amber-400 font-bold">•</span>
                <span className="text-[11px] text-slate-300">{hl}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Code Viewer Window */}
      <div className="lg:col-span-8 space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          {/* File Header Actions */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <h3 className="font-mono font-bold text-sm text-slate-100">{activeFile.filename}</h3>
                <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  {activeFile.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{activeFile.path}</p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded text-xs font-mono transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>

              <button
                onClick={handleDownloadFile}
                className="flex items-center space-x-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded text-xs font-mono transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export File</span>
              </button>
            </div>
          </div>

          {/* Description Callout */}
          <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-300 font-mono">
            💡 {activeFile.description}
          </div>

          {/* Syntax Highlighted Code Viewer */}
          <div className="p-4 bg-slate-950 overflow-x-auto max-h-[600px] overflow-y-auto text-xs font-mono leading-relaxed text-slate-200">
            <pre className="whitespace-pre">
              <code>{activeFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
