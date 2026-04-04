import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Button } from '@/components/ui/button';
import { 
    Bold, 
    Italic, 
    Strikethrough, 
    List, 
    ListOrdered, 
    CheckSquare,
    Heading1, 
    Heading2, 
    Quote,
    Sparkles
} from 'lucide-react';
import React, { useEffect, useCallback } from 'react';

// Tooltip plugin (optional, but good for clean UI)

interface NoteEditorProps {
    content: string;
    onChange: (content: string) => void;
    onOpenAIAssist: () => void;
    editable?: boolean;
}

const MenuBar = ({ editor, onOpenAIAssist }: { editor: any, onOpenAIAssist: () => void }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="flex items-center flex-wrap gap-1 border-b border-slate-100 bg-slate-50/50 p-2 rounded-t-xl sticky top-0 z-10 backdrop-blur-md">
            <div className="flex items-center gap-1 pr-2 border-r border-slate-200">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onOpenAIAssist}
                    className="h-8 gap-1.5 px-3 bg-gradient-to-r from-sky-50 to-indigo-50 text-indigo-700 hover:from-sky-100 hover:to-indigo-100 border border-indigo-100 shadow-sm transition-all focus:ring-0"
                >
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    AI Assist <span className="text-[10px] text-indigo-400 opacity-80 font-mono tracking-widest pl-1">Ctrl+/</span>
                </Button>
            </div>

            <div className="flex items-center gap-1 px-2 border-r border-slate-200">
                <Button
                    variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`h-8 w-8 p-0 ${editor.isActive('heading', { level: 1 }) ? 'bg-slate-200 text-slate-900' : 'text-slate-500'}`}
                    title="Heading 1"
                >
                    <Heading1 className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`h-8 w-8 p-0 ${editor.isActive('heading', { level: 2 }) ? 'bg-slate-200 text-slate-900' : 'text-slate-500'}`}
                    title="Heading 2"
                >
                    <Heading2 className="w-4 h-4" />
                </Button>
            </div>

            <div className="flex items-center gap-1 px-2 border-r border-slate-200">
                <Button
                    variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`h-8 w-8 p-0 ${editor.isActive('bold') ? 'bg-slate-200 text-slate-900' : 'text-slate-500'}`}
                >
                    <Bold className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`h-8 w-8 p-0 ${editor.isActive('italic') ? 'bg-slate-200 text-slate-900' : 'text-slate-500'}`}
                >
                    <Italic className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`h-8 w-8 p-0 ${editor.isActive('strike') ? 'bg-slate-200 text-slate-900' : 'text-slate-500'}`}
                >
                    <Strikethrough className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-1 ml-1 bg-white border border-slate-200 rounded-md shadow-sm p-1">
                    <button
                        onClick={() => editor.chain().focus().toggleHighlight({ color: '#fde047' }).run()}
                        className={`w-5 h-5 rounded-[4px] bg-[#fde047] hover:scale-110 transition-transform ${editor.isActive('highlight', { color: '#fde047' }) ? 'ring-2 ring-slate-800 ring-offset-1' : ''}`}
                        title="Yellow Highlight"
                    />
                    <button
                        onClick={() => editor.chain().focus().toggleHighlight({ color: '#86efac' }).run()}
                        className={`w-5 h-5 rounded-[4px] bg-[#86efac] hover:scale-110 transition-transform ${editor.isActive('highlight', { color: '#86efac' }) ? 'ring-2 ring-slate-800 ring-offset-1' : ''}`}
                        title="Green Highlight"
                    />
                    <button
                        onClick={() => editor.chain().focus().toggleHighlight({ color: '#f9a8d4' }).run()}
                        className={`w-5 h-5 rounded-[4px] bg-[#f9a8d4] hover:scale-110 transition-transform ${editor.isActive('highlight', { color: '#f9a8d4' }) ? 'ring-2 ring-slate-800 ring-offset-1' : ''}`}
                        title="Pink Highlight"
                    />
                    <button
                        onClick={() => editor.chain().focus().toggleHighlight({ color: '#93c5fd' }).run()}
                        className={`w-5 h-5 rounded-[4px] bg-[#93c5fd] hover:scale-110 transition-transform ${editor.isActive('highlight', { color: '#93c5fd' }) ? 'ring-2 ring-slate-800 ring-offset-1' : ''}`}
                        title="Blue Highlight"
                    />
                    <Button
                        variant="ghost" size="sm" onClick={() => editor.chain().focus().unsetHighlight().run()}
                        className="w-6 h-6 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-[4px] ml-0.5"
                        title="Clear Highlight"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-1 pl-2">
                <Button
                    variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`h-8 w-8 p-0 ${editor.isActive('bulletList') ? 'bg-slate-200 text-slate-900' : 'text-slate-500'}`}
                >
                    <List className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`h-8 w-8 p-0 ${editor.isActive('orderedList') ? 'bg-slate-200 text-slate-900' : 'text-slate-500'}`}
                >
                    <ListOrdered className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleTaskList().run()}
                    className={`h-8 w-8 p-0 ${editor.isActive('taskList') ? 'bg-slate-200 text-slate-900' : 'text-slate-500'}`}
                >
                    <CheckSquare className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`h-8 w-8 p-0 ${editor.isActive('blockquote') ? 'bg-slate-200 text-slate-900' : 'text-slate-500'}`}
                >
                    <Quote className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

export default function NoteEditor({ content, onChange, onOpenAIAssist, editable = true }: NoteEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Type \'/\' for commands or start writing...',
                emptyEditorClass: 'is-editor-empty',
            }),
            Highlight.configure({ multicolor: true }),
            TaskList,
            TaskItem.configure({ nested: true }),
            CharacterCount,
        ],
        content: content,
        editable: editable,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base prose-emerald max-w-none focus:outline-none min-h-[400px] md:min-h-[500px] py-4 px-6 text-slate-700',
            },
        },
    });

    // Update editor content when external content prop changes (e.g., when switching notes)
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            // Need to save cursor position, update content, and restore if we want a fully controlled editor,
            // but for switching notes, replacing the whole content is fine.
            const currentHTML = editor.getHTML();
            if (content !== currentHTML && content !== undefined) {
               // checking if it's completely empty to avoid overwriting typed content unnecessarily
               // We only update if they differ significantly and it's not focus
               if (!editor.isFocused || content === '') {
                 editor.commands.setContent(content);
               }
            }
        }
    }, [content, editor]);

    // Keyboard shortcut for AI Assist
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === '/') {
            e.preventDefault();
            onOpenAIAssist();
        }
    }, [onOpenAIAssist]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    if (!editor) {
        return <div className="min-h-[400px] animate-pulse bg-slate-50/50 rounded-b-xl" />;
    }

    return (
        <div className="flex flex-col h-full overflow-hidden bg-white/50 relative">
            <style jsx global>{`
                .is-editor-empty:first-child::before {
                    color: #94a3b8;
                    content: attr(data-placeholder);
                    float: left;
                    height: 0;
                    pointer-events: none;
                }
                .tiptap p {
                    margin-top: 0.5em;
                    margin-bottom: 0.5em;
                }
                .tiptap ul[data-type="taskList"] {
                    list-style: none;
                    padding: 0;
                }
                .tiptap ul[data-type="taskList"] li {
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 0.5rem;
                }
                .tiptap ul[data-type="taskList"] li > label {
                    margin-right: 0.5rem;
                    user-select: none;
                    margin-top: 0.25rem;
                }
                .tiptap ul[data-type="taskList"] li > label input {
                    cursor: pointer;
                }
                .tiptap ul[data-type="taskList"] li > div {
                    flex: 1;
                }
            `}</style>
            
            {editable && <MenuBar editor={editor} onOpenAIAssist={onOpenAIAssist} />}
            
            <div className="flex-1 overflow-y-auto cursor-text" onClick={() => editor.chain().focus().run()}>
                <EditorContent editor={editor} />
            </div>
            
            <div className="absolute bottom-2 right-4 text-xs font-medium text-slate-400 bg-white/80 px-2 py-1 rounded backdrop-blur-sm shadow-sm pointer-events-none">
                {editor.storage.characterCount.words()} words
            </div>
        </div>
    );
}
