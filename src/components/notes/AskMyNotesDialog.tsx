import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Sparkles, Loader2, FileText, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { trackUsage } from '@/services/usage';

export interface Note {
    id: string;
    title: string;
    content: string;
    created_at: string;
}

interface AskMyNotesDialogProps {
    isOpen: boolean;
    onClose: () => void;
    notes: any[];
    onSelectNote: (note: any) => void;
}

export default function AskMyNotesDialog({ isOpen, onClose, notes, onSelectNote }: AskMyNotesDialogProps) {
    const { user } = useAuth();
    const [query, setQuery] = useState('');
    const [mode, setMode] = useState<'search' | 'ask'>('search');
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState('');
    
    // Simple filter for search mode
    const filteredNotes = query ? notes.filter(n => 
        n.title.toLowerCase().includes(query.toLowerCase()) || 
        n.content.toLowerCase().includes(query.toLowerCase())
    ) : [];

    const handleAskAI = async () => {
        if (!query.trim() || notes.length === 0) return;
        
        setLoading(true);
        setAnswer('');
        
        try {
            // Strip HTML from notes to save tokens and create context
            const stripHtml = (htmlStr: string) => {
                const doc = new DOMParser().parseFromString(htmlStr, 'text/html');
                return doc.body.textContent || "";
            }

            // Take top 10 most recent/relevant notes as context to avoid token limits
            const contextNotes = notes.slice(0, 10).map(n => `Title: ${n.title}\nContent: ${stripHtml(n.content).slice(0, 1000)}`).join('\n\n---\n\n');

            const res = await fetch('/api/tools/notes/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: query,
                    context: contextNotes
                })
            });

            if (!res.ok) throw new Error('Failed to fetch answer');
            
            const data = await res.json();
            setAnswer(data.answer);
            
            if (user?.email) {
                trackUsage('notes', user.email); // Track as an AI usage event
            }
        } catch (error) {
            console.error(error);
            setAnswer("Sorry, I couldn't process your question right now. Ensure your API keys are valid.");
        } finally {
            setLoading(false);
        }
    };

    // Auto-focus input when opened
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setAnswer('');
            setMode('search');
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white/95 backdrop-blur-xl border-slate-200 shadow-2xl rounded-2xl">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex bg-slate-200/50 p-1 rounded-xl">
                        <button 
                            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${mode === 'search' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setMode('search')}
                        >
                            <span className="flex items-center gap-2"><Search className="w-4 h-4" /> Find Note</span>
                        </button>
                        <button 
                            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${mode === 'ask' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setMode('ask')}
                        >
                            <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Ask AI</span>
                        </button>
                    </div>
                </div>
                
                <div className="p-4">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="relative w-full">
                            {mode === 'search' ? <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /> : <Sparkles className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" />}
                            <Input 
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        if (mode === 'ask') handleAskAI();
                                    }
                                }}
                                placeholder={mode === 'search' ? "Search unifies note titles and content..." : "Ask questions about your notes..."}
                                className={`pl-10 h-12 text-lg border-slate-200 focus-visible:ring-1 w-full ${mode === 'ask' ? 'focus-visible:ring-indigo-400' : 'focus-visible:ring-emerald-400'}`}
                                autoFocus
                            />
                        </div>
                        {mode === 'ask' && (
                            <Button 
                                size="lg" 
                                onClick={handleAskAI}
                                disabled={loading || !query.trim()}
                                className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 w-full sm:w-auto font-semibold shadow-sm"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Ask AI'}
                            </Button>
                        )}
                    </div>

                    <div className="mt-4 min-h-[200px] max-h-[300px] overflow-y-auto pr-1">
                        {mode === 'search' ? (
                            <div className="space-y-2">
                                {query.trim() === '' ? (
                                    <div className="py-8 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
                                        <Search className="w-8 h-8 opacity-20" />
                                        Type to start searching your notes collection
                                    </div>
                                ) : filteredNotes.length === 0 ? (
                                    <div className="py-8 text-center text-slate-500 text-sm">
                                        No notes found matching "{query}"
                                    </div>
                                ) : (
                                    filteredNotes.map(n => (
                                        <button 
                                            key={n.id}
                                            onClick={() => {
                                                onSelectNote(n);
                                                onClose();
                                            }}
                                            className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all text-left group"
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="p-2 bg-slate-100 group-hover:bg-emerald-100 rounded-lg text-slate-500 group-hover:text-emerald-600 transition-colors">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <div className="truncate">
                                                    <p className="font-medium text-slate-800 truncate">{n.title || 'Untitled Note'}</p>
                                                    <p className="text-xs text-slate-500 truncate">{new Date(n.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:text-emerald-500 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                        </button>
                                    ))
                                )}
                            </div>
                        ) : (
                            <div className="h-full">
                                {loading ? (
                                    <div className="py-12 flex flex-col items-center justify-center gap-3">
                                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                                        <p className="text-sm text-indigo-600/70 font-medium animate-pulse">Reading your notes and synthesizing an answer...</p>
                                    </div>
                                ) : answer ? (
                                    <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border border-indigo-100/50 p-5 rounded-2xl">
                                        <div className="flex items-center gap-2 text-indigo-800 font-semibold mb-3">
                                            <Sparkles className="w-4 h-4" />
                                            <span>AI Answer</span>
                                        </div>
                                        <div className="prose prose-sm prose-indigo whitespace-pre-wrap text-slate-700 leading-relaxed">
                                            {answer}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-12 text-center flex flex-col items-center gap-3 opacity-60">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-400">
                                            <Sparkles className="w-6 h-6" />
                                        </div>
                                        <p className="text-sm text-slate-500 max-w-[250px]">
                                            Ask any question and the AI will analyze your notes to find the answer.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="bg-slate-50 p-2 text-center border-t border-slate-100">
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Powered by Groq Semantic Engine</p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
