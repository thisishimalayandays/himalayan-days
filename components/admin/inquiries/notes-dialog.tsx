'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { updateInquiryNotes } from '@/app/actions/inquiries';
import { useToast } from '@/hooks/use-toast';
import { NotebookPen, Save, History, Trash2, X } from 'lucide-react';

interface NotesDialogProps {
    inquiryId: string;
    existingNotes: string | null;
    customerName: string;
    userEmail?: string;
}

export function NotesDialog({ inquiryId, existingNotes, customerName, userEmail }: NotesDialogProps) {
    const [open, setOpen] = useState(false);
    const [notes, setNotes] = useState(existingNotes || '');
    const [newNote, setNewNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    // Check if user is the specific admin who can delete
    const canDelete = userEmail === 'admin@himalayandays.in' || userEmail === 'admin@himalayandays';

    // Parse notes into array based on double newline separator
    const noteEntries = notes ? notes.split(/\n\n/).filter(n => n.trim().length > 0) : [];

    // Sync state when props change
    useEffect(() => {
        setNotes(existingNotes || '');
    }, [existingNotes]);

    const handleSave = async () => {
        if (!newNote.trim()) return;

        setIsSaving(true);
        const timestamp = new Date().toLocaleString('en-GB', {
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
        });

        const entry = `[${timestamp}] ${newNote.trim()}`;
        // Prepend new note
        const updatedNotes = notes ? `${entry}\n\n${notes}` : entry;

        const result = await updateInquiryNotes(inquiryId, updatedNotes);

        if (result.success) {
            setNotes(updatedNotes);
            setNewNote('');
            toast({ title: "Note Added", className: "bg-green-50 text-green-800 border-green-200" });
        } else {
            toast({ variant: "destructive", title: "Failed to save note" });
        }
        setIsSaving(false);
    };

    const handleDeleteNote = async (indexToDelete: number) => {
        if (!confirm("Are you sure you want to delete this note?")) return;

        setIsSaving(true);

        // Remove the note at the specific index
        const newEntries = noteEntries.filter((_, index) => index !== indexToDelete);
        const updatedNotes = newEntries.join('\n\n');

        const result = await updateInquiryNotes(inquiryId, updatedNotes);

        if (result.success) {
            setNotes(updatedNotes);
            toast({ title: "Note Deleted", className: "bg-red-50 text-red-800 border-red-200" });
        } else {
            toast({ variant: "destructive", title: "Failed to delete note" });
        }
        setIsSaving(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className={`h-8 w-8 ${notes ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`} title="Notes">
                    <NotebookPen className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <NotebookPen className="w-5 h-5 text-primary" />
                        Notes: {customerName}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* New Note Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Add New Note</label>
                        <Textarea
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Called customer. They are interested in..."
                            className="min-h-[100px] resize-none focus-visible:ring-primary"
                        />
                        <div className="flex justify-end">
                            <Button
                                size="sm"
                                onClick={handleSave}
                                disabled={!newNote.trim() || isSaving}
                                className="bg-primary hover:bg-primary/90 text-white"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isSaving ? 'Saving...' : 'Save Note'}
                            </Button>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                            <History className="w-4 h-4" /> History
                        </label>
                        <div className="h-[250px] w-full rounded-md border dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 overflow-y-auto custom-scrollbar flex flex-col gap-2 p-2">
                            {noteEntries.length > 0 ? (
                                noteEntries.map((entry, index) => (
                                    <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded border dark:border-gray-700 shadow-sm relative group text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                        {entry}
                                        {canDelete && (
                                            <button
                                                onClick={() => handleDeleteNote(index)}
                                                className="absolute top-2 right-2 p-1 text-gray-300 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                title="Delete Note"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-400 dark:text-gray-500 text-sm py-8">
                                    No notes yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
