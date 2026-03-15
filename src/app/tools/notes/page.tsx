'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { FileText, Save, Clock, Trash2, Plus, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/Toast';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

interface Note {
    id: string;
    title: string;
    content: string;
    created_at: string;
    user_email: string;
}

export default function NotesPage() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (!user?.email) return;

        async function fetchNotes() {
            try {
                const q = query(
                    collection(db, 'notes'),
                    where('user_email', '==', user!.email!),
                    orderBy('created_at', 'desc')
                );
                
                const querySnapshot = await getDocs(q);
                const fetchedNotes = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Note[];
                
                setNotes(fetchedNotes);
            } catch (err: unknown) {
                console.error('Error fetching notes:', err);
                if (err instanceof Error && err.message.includes('requires an index')) {
                    console.warn('Firestore index required: Please check your console browser logs for the link to create it.');
                }
            } finally {
                setLoading(false);
            }
        }

        fetchNotes();
    }, [user]);

    const handleSave = async () => {
        if (!user?.email || (!title.trim() && !content.trim())) return;

        setSaving(true);
        try {
            if (activeNoteId) {
                // Update existing
                const noteRef = doc(db, 'notes', activeNoteId);
                await updateDoc(noteRef, {
                    title: title || 'Untitled Note',
                    content
                });
                
                setNotes(notes.map(n => n.id === activeNoteId ? { ...n, title: title || 'Untitled Note', content } : n));
                showToast('Note updated successfully!', 'success');
            } else {
                // Create new
                const newNoteData = {
                    title: title || 'Untitled Note',
                    content,
                    user_email: user.email,
                    created_at: new Date().toISOString(),
                };
                
                const docRef = await addDoc(collection(db, 'notes'), newNoteData);
                
                const newNote: Note = {
                    id: docRef.id,
                    ...newNoteData
                };
                
                setNotes([newNote, ...notes]);
                setActiveNoteId(docRef.id);
                showToast('Note saved successfully!', 'success');
            }
        } catch (err) {
            console.error('Error saving note:', err);
            showToast('Failed to save note. Ensure Firestore rules allow writes!', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // prevent setting active note
        
        // Prevent double-click
        if (deletingId) return;
        setDeletingId(id);

        try {
            await deleteDoc(doc(db, 'notes', id));
            
            setNotes(notes.filter(n => n.id !== id));
            if (activeNoteId === id) {
                handleNewNote();
            }
            showToast('Note deleted successfully.', 'success');
        } catch (err) {
            console.error('Error deleting note:', err);
            showToast('Failed to delete note. Ensure Firestore rules allow deletes!', 'error');
        } finally {
            setDeletingId(null);
        }
    };

    const handleNoteClick = (note: Note) => {
        setActiveNoteId(note.id);
        setTitle(note.title);
        setContent(note.content);
    };

    const handleNewNote = () => {
        setActiveNoteId(null);
        setTitle('');
        setContent('');
    };

    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

    return (
        <ProtectedRoute>
            <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 page-enter">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700 shadow-sm">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">AI Notes Saver</h1>
                            <p className="text-slate-600">Capture and organize your thoughts.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-8">
                    {/* Saved Notes Section */}
                    <div className="space-y-4 lg:col-span-1 order-2 lg:order-1">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Clock className="w-4 h-4" /> Recent Notes
                            </h3>
                            <Button variant="ghost" size="sm" onClick={handleNewNote} className="h-8 hover:bg-emerald-50 text-emerald-600 dark:hover:bg-emerald-500/10 dark:text-emerald-400">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 pb-4">
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                                </div>
                            ) : notes.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
                                    <p className="text-sm text-gray-500">No notes yet.</p>
                                </div>
                            ) : (
                                notes.map((note) => (
                                    <Card
                                        key={note.id} 
                                        onClick={() => handleNoteClick(note)}
                                        className={`group transition-all cursor-pointer ${
                                            activeNoteId === note.id 
                                                ? 'border-emerald-400 bg-emerald-50/70 ring-1 ring-emerald-200'
                                                : 'hover:border-emerald-300'
                                        }`}
                                    >
                                        <CardContent className="p-4 flex flex-col gap-2">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1">{note.title || 'Untitled Note'}</h4>
                                                <button 
                                                    onClick={(e) => handleDelete(note.id, e)}
                                                    disabled={deletingId === note.id}
                                                    className="text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all disabled:opacity-50"
                                                >
                                                    {deletingId === note.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                                {note.content || 'No content...'}
                                            </p>
                                            <span className="text-xs text-gray-400 mt-1">
                                                {new Date(note.created_at).toLocaleDateString()}
                                            </span>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Editor Section */}
                    <div className="lg:col-span-3 space-y-4 order-1 lg:order-2">
                        <Card className="h-full border-emerald-200/80 bg-white/85 shadow-sm flex flex-col transition-all">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    {activeNoteId ? 'Edit Note' : 'New Note'}
                                </CardTitle>
                                <CardDescription>Write down your ideas, summaries, or quick thoughts.</CardDescription>
                                <Input 
                                    className="mt-4 text-lg font-semibold bg-transparent border-0 border-b border-slate-200 rounded-none px-0 py-2 shadow-none focus-visible:ring-0 focus-visible:border-emerald-500" 
                                    placeholder="Note Title" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </CardHeader>
                            <CardContent className="flex-1 pb-0">
                                <Textarea
                                    className="min-h-[400px] md:min-h-[500px] h-full resize-y border-0 bg-transparent px-0 py-2 text-base shadow-none leading-relaxed focus-visible:ring-0"
                                    placeholder="Start typing your note here..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </CardContent>
                            <CardFooter className="mt-auto flex items-center justify-between rounded-b-xl border-t border-slate-200 bg-slate-50 py-4">
                                <span className="text-xs font-medium text-slate-500">{wordCount} word{wordCount !== 1 ? 's' : ''}</span>
                                <Button 
                                    onClick={handleSave} 
                                    disabled={saving || (!title.trim() && !content.trim())}
                                    className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {saving ? 'Saving...' : 'Save Note'}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
