import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Wand2, AlignLeft, RefreshCw, CheckCircle2, ClipboardCopy, X } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface AIAssistPanelProps {
    isOpen: boolean;
    onClose: () => void;
    currentContent: string;
    title: string;
    onApply: (newContent: string, mode: 'replace' | 'append') => void;
}

type AIAction = 'improve' | 'summarize' | 'expand' | 'grammar' | 'bullets' | 'ideas';

export default function AIAssistPanel({ isOpen, onClose, currentContent, title, onApply }: AIAssistPanelProps) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const [action, setAction] = useState<AIAction | null>(null);

    if (!isOpen) return null;

    const handleAILogic = async (selectedAction: AIAction) => {
        const textToProcess = currentContent.trim() ? currentContent : title;
        if (!textToProcess.trim()) return;
        
        setLoading(true);
        setAction(selectedAction);
        setResult('');

        try {
            const res = await fetch('/api/tools/notes/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: textToProcess,
                    title: title, // Pass title for context
                    action: selectedAction
                })
            });

            if (!res.ok) throw new Error('API request failed');
            
            const data = await res.json();
            setResult(data.result || 'No output generated.');
        } catch (error) {
            console.error('AI Assist error:', error);
            setResult('An error occurred while generating the AI response. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(result);
    };

    const stripHtml = (htmlStr: string) => {
        const doc = new DOMParser().parseFromString(htmlStr, 'text/html');
        return doc.body.textContent || "";
    }

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-sm animate-in fade-in duration-200">
            <Card className="w-full max-w-lg shadow-2xl border-indigo-100 bg-white/95 backdrop-blur-xl animate-in zoom-in-95 duration-200">
                <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <h3 className="font-semibold text-slate-800">AI Assist</h3>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                    </Button>
                </CardHeader>
                
                <CardContent className="pt-4 space-y-4">
                    {!result && !loading && (
                        <div className="grid grid-cols-2 gap-2">
                            <Button 
                                variant="outline" 
                                className="justify-start gap-2 h-auto py-3 text-sm font-medium border-slate-200 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 transition-all col-span-2"
                                onClick={() => handleAILogic('ideas')}
                                disabled={!stripHtml(currentContent).trim() && !title.trim()}
                            >
                                <Sparkles className="w-4 h-4 text-violet-500" />
                                Generate Ideas / Outline
                            </Button>
                            <Button 
                                variant="outline" 
                                className="justify-start gap-2 h-auto py-3 text-sm font-medium border-slate-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all"
                                onClick={() => handleAILogic('improve')}
                                disabled={!stripHtml(currentContent).trim() && !title.trim()}
                            >
                                <Wand2 className="w-4 h-4 text-indigo-500" />
                                Improve Writing
                            </Button>
                            <Button 
                                variant="outline" 
                                className="justify-start gap-2 h-auto py-3 text-sm font-medium border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all"
                                onClick={() => handleAILogic('summarize')}
                                disabled={!stripHtml(currentContent).trim() && !title.trim()}
                            >
                                <AlignLeft className="w-4 h-4 text-emerald-500" />
                                Summarize Note
                            </Button>
                            <Button 
                                variant="outline" 
                                className="justify-start gap-2 h-auto py-3 text-sm font-medium border-slate-200 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 transition-all"
                                onClick={() => handleAILogic('expand')}
                                disabled={!stripHtml(currentContent).trim() && !title.trim()}
                            >
                                <RefreshCw className="w-4 h-4 text-sky-500" />
                                Expand Content
                            </Button>
                            <Button 
                                variant="outline" 
                                className="justify-start gap-2 h-auto py-3 text-sm font-medium border-slate-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-all"
                                onClick={() => handleAILogic('grammar')}
                                disabled={!stripHtml(currentContent).trim() && !title.trim()}
                            >
                                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                                Fix Grammar
                            </Button>
                        </div>
                    )}

                    {loading && (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center animate-pulse">
                                <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                            </div>
                            <p className="text-sm font-medium text-slate-500 animate-pulse">
                                AI is working its magic...
                            </p>
                        </div>
                    )}

                    {result && !loading && (
                        <div className="space-y-3">
                            <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-4 max-h-64 overflow-y-auto text-sm text-slate-700 whitespace-pre-wrap leading-relaxed shadow-inner">
                                {result}
                            </div>
                            <div className="flex gap-2 pt-2">
                                <Button 
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                                    onClick={() => {
                                        // Simple heuristic to format HTML outputs or plain text appropriately
                                        const formattedResult = result.includes('<') && result.includes('>') ? result : `<p>${result.replace(/\\n/g, '<br/>')}</p>`;
                                        onApply(formattedResult, 'replace');
                                        onClose();
                                    }}
                                >
                                    Replace
                                </Button>
                                <Button 
                                    variant="secondary"
                                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-sm"
                                    onClick={() => {
                                        const formattedResult = result.includes('<') && result.includes('>') ? result : `<p>${result.replace(/\\n/g, '<br/>')}</p>`;
                                        onApply(formattedResult, 'append');
                                        onClose();
                                    }}
                                >
                                    Insert Below
                                </Button>
                                <Button 
                                    variant="outline"
                                    className="w-10 px-0"
                                    onClick={handleCopy}
                                    title="Copy to clipboard"
                                >
                                    <ClipboardCopy className="w-4 h-4 text-slate-500" />
                                </Button>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="w-full text-slate-400 hover:text-slate-600"
                                onClick={() => setResult('')}
                            >
                                Try something else
                            </Button>
                        </div>
                    )}
                    
                    {!stripHtml(currentContent).trim() && !title.trim() && !loading && !result && (
                        <p className="border-l-2 border-amber-400 pl-3 text-xs text-amber-600 py-1 bg-amber-50 pr-2 rounded-r">
                            You need to write a title or something in the editor first before using AI Assist!
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
