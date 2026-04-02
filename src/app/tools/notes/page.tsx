'use client';

import { useEffect, useState, useCallback } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FileText, Save, Clock, Trash2, Plus, Loader2, Eye, Edit3, Search, Sparkles, BookOpen, Star, MoreVertical } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/Toast';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { trackUsage } from '@/services/usage';
import { useDebouncedCallback } from 'use-debounce';

// Custom Components
import NoteEditor from '@/components/notes/NoteEditor';
import AIAssistPanel from '@/components/notes/AIAssistPanel';
import AskMyNotesDialog from '@/components/notes/AskMyNotesDialog';

interface Note {
    id: string;
    title: string;
    content: string; // HTML content from Tiptap
    created_at: string;
    user_email: string;
    isFavorite?: boolean;
}

export default function NotesPage() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [deletingId, setDeletingId] = useState<string | null>(null);
    
    // Active Note State
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    
    // UI State
    const [mode, setMode] = useState<'edit' | 'preview' | 'split'>('edit');
    const [aiPanelOpen, setAiPanelOpen] = useState(false);
    const [askNotesOpen, setAskNotesOpen] = useState(false);

    useEffect(() => {
        if (!user?.email) return;

        const q = query(
            collection(db, 'notes'),
            where('user_email', '==', user.email),
            orderBy('created_at', 'desc')
        );
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedNotes = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Note[];
            
            setNotes(fetchedNotes);
            setLoading(false);
            
            // If the active note was deleted by another client/process, clear it
            if (activeNoteId && !fetchedNotes.find(n => n.id === activeNoteId)) {
                setActiveNoteId(null);
                setTitle('');
                setContent('');
                setIsFavorite(false);
            }
        }, (error) => {
            console.error('Error in notes snapshot listener:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, activeNoteId]);

    // Handle Saving
    const handleSave = async (contentToSave: string, titleToSave: string, createVersion = false) => {
        if (!user?.email || (!titleToSave.trim() && !contentToSave.trim())) return;

        setSaveStatus('saving');
        try {
            let noteId = activeNoteId;

            if (noteId) {
                const noteRef = doc(db, 'notes', noteId);
                await updateDoc(noteRef, {
                    title: titleToSave || 'Untitled Note',
                    content: contentToSave,
                    isFavorite: isFavorite
                });
                
                setNotes(prev => prev.map(n => n.id === noteId ? { ...n, title: titleToSave || 'Untitled Note', content: contentToSave, isFavorite } : n));
            } else {
                const newNoteData = {
                    title: titleToSave || 'Untitled Note',
                    content: contentToSave,
                    user_email: user.email,
                    created_at: new Date().toISOString(),
                    isFavorite: isFavorite
                };
                
                const docRef = await addDoc(collection(db, 'notes'), newNoteData);
                noteId = docRef.id;
                
                const newNote: Note = { id: noteId, ...newNoteData };
                setNotes(prev => [newNote, ...prev]);
                setActiveNoteId(noteId);
                trackUsage('notes', user.email);
            }

            if (createVersion && noteId) {
                // Save a version history snapshot
                await addDoc(collection(db, `notes/${noteId}/versions`), {
                    content: contentToSave,
                    title: titleToSave,
                    saved_at: new Date().toISOString()
                });
            }

            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        } catch (err) {
            console.error('Error saving note:', err);
            setSaveStatus('error');
            showToast('Failed to save note.', 'error');
        }
    };

    // Auto-save debounce
    const debouncedSave = useDebouncedCallback(
        (c: string, t: string) => handleSave(c, t, false),
        3000
    );

    // Manual Save
    const handleManualSave = useCallback(() => {
        handleSave(content, title, true);
        showToast('Note saved manually!', 'success');
    }, [content, title, handleSave, showToast]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleManualSave();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setAskNotesOpen(true);
            }
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [handleManualSave]);

    const handleContentChange = (newContent: string) => {
        setContent(newContent);
        if (activeNoteId) {
            setSaveStatus('saving');
            debouncedSave(newContent, title);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (deletingId) return;
        setDeletingId(id);

        try {
            await deleteDoc(doc(db, 'notes', id));
            setNotes(prev => prev.filter(n => n.id !== id));
            if (activeNoteId === id) handleNewNote();
            showToast('Note deleted successfully.', 'success');
        } catch (err) {
            console.error('Error deleting note:', err);
            showToast('Failed to delete note.', 'error');
        } finally {
            setDeletingId(null);
        }
    };

    const toggleFavorite = async (id: string, currentFav: boolean, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        try {
            await updateDoc(doc(db, 'notes', id), { isFavorite: !currentFav });
            setNotes(prev => prev.map(n => n.id === id ? { ...n, isFavorite: !currentFav } : n));
            if (activeNoteId === id) setIsFavorite(!currentFav);
        } catch (err) {
            showToast('Failed to update favorite status', 'error');
        }
    };

    const handleNoteClick = (note: Note) => {
        setActiveNoteId(note.id);
        setTitle(note.title);
        setContent(note.content);
        setIsFavorite(!!note.isFavorite);
        setSaveStatus('idle');
    };

    const handleNewNote = () => {
        setActiveNoteId(null);
        setTitle('');
        setContent('');
        setIsFavorite(false);
        setSaveStatus('idle');
    };

    const handleAIApply = (newHtml: string, applyMode: 'replace' | 'append') => {
        let updatedContent = content;
        if (applyMode === 'replace') {
            updatedContent = newHtml;
        } else {
            updatedContent = content + '<br/>' + newHtml;
        }
        handleContentChange(updatedContent);
        showToast('AI response applied to note!', 'success');
    };

    return (
        <ProtectedRoute>
            <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 page-enter text-slate-800">
                <AIAssistPanel 
                    isOpen={aiPanelOpen} 
                    onClose={() => setAiPanelOpen(false)} 
                    currentContent={content}
                    title={title}
                    onApply={handleAIApply}
                />
                <AskMyNotesDialog 
                    isOpen={askNotesOpen} 
                    onClose={() => setAskNotesOpen(false)} 
                    notes={notes}
                    onSelectNote={handleNoteClick}
                />

                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-700 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">AI Brain</h1>
                            <p className="text-slate-500 font-medium tracking-wide">Your intelligent second brain.</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button 
                            variant="outline" 
                            className="bg-white/50 border-slate-200 text-slate-600 gap-2 h-10 px-4 group hover:bg-white flex-1 sm:flex-none shadow-sm"
                            onClick={() => setAskNotesOpen(true)}
                        >
                            <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                            Search / Ask Notes
                            <span className="ml-2 hidden sm:inline-block text-[10px] font-mono bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded uppercase tracking-wider">Ctrl K</span>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 xl:grid-cols-5 lg:gap-8">
                    {/* Saved Notes Sidebar */}
                    <div className="space-y-4 lg:col-span-1 xl:col-span-1 order-2 lg:order-1">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-sm border border-slate-200/60 font-bold uppercase tracking-widest text-slate-400 bg-white/40 px-3 py-1 rounded-full flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" /> Recents
                            </h3>
                            <Button variant="ghost" size="icon" onClick={handleNewNote} className="h-8 w-8 hover:bg-indigo-50 text-indigo-600 rounded-full shadow-sm bg-white/50">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 pb-4 scrollbar-hide">
                            {loading ? (
                                <div className="space-y-3 mt-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-20 bg-white/40 animate-pulse rounded-xl border border-slate-100" />
                                    ))}
                                </div>
                            ) : notes.length === 0 ? (
                                <div className="text-center py-10 px-4 bg-white/30 rounded-2xl border border-dashed border-slate-200">
                                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <FileText className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-600">No notes yet</p>
                                    <p className="text-xs text-slate-400 mt-1">Start typing to save your thoughts.</p>
                                </div>
                            ) : (
                                notes.map((note) => (
                                    <div
                                        key={note.id} 
                                        onClick={() => handleNoteClick(note)}
                                        className={`group relative transition-all cursor-pointer rounded-xl border ${
                                            activeNoteId === note.id 
                                                ? 'bg-white border-indigo-200 shadow-md shadow-indigo-100/50 scale-[1.02] z-10'
                                                : 'bg-white/40 border-slate-100 hover:border-indigo-200 hover:bg-white/80 hover:shadow-sm'
                                        } p-3 flex flex-col gap-1.5 overflow-hidden`}
                                    >
                                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 transition-opacity" style={{ opacity: activeNoteId === note.id ? 1 : 0 }} />
                                        
                                        <div className="flex justify-between items-start gap-2 pl-1">
                                            <h4 className="font-semibold text-slate-800 line-clamp-1 text-sm pt-0.5">{note.title || 'Untitled'}</h4>
                                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 rounded backdrop-blur border border-slate-100 shadow-sm p-0.5">
                                                <button 
                                                    onClick={(e) => toggleFavorite(note.id, !!note.isFavorite, e)}
                                                    className={`p-1 rounded text-slate-400 hover:bg-slate-100 transition-colors ${note.isFavorite ? 'text-amber-400' : ''}`}
                                                >
                                                    <Star className="w-3.5 h-3.5" fill={note.isFavorite ? 'currentColor' : 'none'} />
                                                </button>
                                                <button 
                                                    onClick={(e) => handleDelete(note.id, e)}
                                                    disabled={deletingId === note.id}
                                                    className="p-1 rounded text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                                >
                                                    {deletingId === note.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="pl-1">
                                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed opacity-80" dangerouslySetInnerHTML={{ __html: (note.content || '').replace(/<[^>]*>?/gm, ' ') || 'Empty note...' }} />
                                        </div>
                                        
                                        <div className="flex items-center gap-2 mt-1 pl-1">
                                            <span className="text-[10px] font-medium text-slate-400 tracking-wide uppercase">
                                                {new Date(note.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Editor Section */}
                    <div className="lg:col-span-3 xl:col-span-4 order-1 lg:order-2 h-[calc(100vh-140px)] flex flex-col pt-1">
                        <Card className="h-full border-slate-200/60 bg-white/80 shadow-xl shadow-slate-200/20 flex flex-col transition-all overflow-hidden rounded-2xl ring-1 ring-slate-900/5 backdrop-blur-xl">
                            
                            {/* Editor Header */}
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <Input 
                                        className="text-xl font-bold bg-transparent border-0 px-0 h-auto shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-300 w-full truncate" 
                                        placeholder="Note Title" 
                                        value={title}
                                        onChange={(e) => {
                                            setTitle(e.target.value);
                                            if (activeNoteId) { setSaveStatus('saving'); debouncedSave(content, e.target.value); }
                                        }}
                                    />
                                    
                                    <div className="flex items-center gap-2 ml-4 shrink-0">
                                        <div className="text-xs font-mono font-medium rounded-full px-2.5 py-1 flex items-center gap-1.5 transition-colors">
                                            {saveStatus === 'saving' && <><Loader2 className="w-3 h-3 animate-spin text-amber-500" /> <span className="text-amber-600">Saving</span></>}
                                            {saveStatus === 'saved' && <><Save className="w-3 h-3 text-emerald-500" /> <span className="text-emerald-600">Saved</span></>}
                                            {saveStatus === 'error' && <span className="text-red-500">Error saving</span>}
                                            {saveStatus === 'idle' && <span className="text-slate-400 opacity-50">Synced to cloud</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 ml-6 bg-white p-1 rounded-lg border border-slate-200 shadow-sm shrink-0">
                                    <Button variant={mode === 'edit' ? 'secondary' : 'ghost'} size="sm" onClick={() => setMode('edit')} className={`h-7 px-3 text-xs gap-1.5 rounded-md ${mode === 'edit' ? 'bg-slate-100 text-slate-800' : 'text-slate-500'}`}>
                                        <Edit3 className="w-3.5 h-3.5" /> Edit
                                    </Button>
                                    <Button variant={mode === 'split' ? 'secondary' : 'ghost'} size="sm" onClick={() => setMode('split')} className={`h-7 px-3 text-xs gap-1.5 rounded-md ${mode === 'split' ? 'bg-slate-100 text-slate-800 hidden sm:flex' : 'text-slate-500 hidden sm:flex'}`}>
                                        <BookOpen className="w-3.5 h-3.5" /> Split
                                    </Button>
                                    <Button variant={mode === 'preview' ? 'secondary' : 'ghost'} size="sm" onClick={() => setMode('preview')} className={`h-7 px-3 text-xs gap-1.5 rounded-md ${mode === 'preview' ? 'bg-slate-100 text-slate-800' : 'text-slate-500'}`}>
                                        <Eye className="w-3.5 h-3.5" /> Read
                                    </Button>
                                </div>
                            </div>
                            
                            {/* Editor Body */}
                            <div className="flex-1 overflow-hidden relative flex">
                                {/* Left Side: Editor */}
                                {(mode === 'edit' || mode === 'split') && (
                                    <div className={`flex-1 h-full overflow-hidden ${mode === 'split' ? 'border-r border-slate-100' : ''}`}>
                                        <NoteEditor 
                                            content={content} 
                                            onChange={handleContentChange} 
                                            onOpenAIAssist={() => setAiPanelOpen(true)}
                                            editable={true}
                                        />
                                    </div>
                                )}

                                {/* Right Side: Read-Only Preview */}
                                {(mode === 'preview' || mode === 'split') && (
                                    <div className="flex-1 h-full overflow-y-auto bg-slate-50/30">
                                        <div className="max-w-3xl mx-auto py-8 px-8 xl:px-12">
                                            <h1 className="text-3xl font-black text-slate-900 mb-6 pb-4 border-b border-slate-100">{title || 'Untitled Note'}</h1>
                                            <NoteEditor 
                                                content={content || '<p class="text-slate-400">Nothing to preview...</p>'} 
                                                onChange={() => {}} 
                                                onOpenAIAssist={() => {}}
                                                editable={false}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
