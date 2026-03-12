'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useState } from 'react';
import { Plus, Trash2, Save, FileText } from 'lucide-react';

export default function NotesPage() {
    const [notes] = useState([{ id: 1, title: 'Meeting Notes', content: 'Discussed project architecture...' }]);

    return (
        <ProtectedRoute>
            <div className="container mx-auto px-4 py-8 max-w-5xl animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-500 rounded-xl flex items-center justify-center shadow-sm">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">My Notes</h1>
                            <p className="text-gray-500 dark:text-gray-400">Manage and organize your personal notes securely.</p>
                        </div>
                    </div>
                    <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm active:scale-95">
                        <Plus className="w-5 h-5" />
                        New Note
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 space-y-4">
                        {notes.map(note => (
                            <div key={note.id} className="p-5 bg-white dark:bg-gray-900 rounded-2xl border-2 border-emerald-500/20 dark:border-emerald-500/30 cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors shadow-sm">
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{note.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{note.content}</p>
                            </div>
                        ))}
                    </div>

                    <div className="md:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 min-h-[500px] flex flex-col shadow-sm">
                        <input
                            type="text"
                            placeholder="Note Title"
                            className="text-2xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white mb-6 w-full placeholder:text-gray-300 dark:placeholder:text-gray-700"
                            defaultValue="Meeting Notes"
                        />
                        <textarea
                            className="flex-1 bg-transparent border-none outline-none text-gray-700 dark:text-gray-300 resize-none w-full placeholder:text-gray-300 dark:placeholder:text-gray-700 leading-relaxed"
                            placeholder="Write your note here..."
                            defaultValue="Discussed project architecture..."
                        />
                        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                            <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors font-medium">
                                <Trash2 className="w-4 h-4" /> Delete
                            </button>
                            <button className="flex items-center gap-2 px-5 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 rounded-lg transition-colors font-medium shadow-sm">
                                <Save className="w-4 h-4" /> Save Note
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
