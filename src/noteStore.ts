import { create } from 'zustand'
import { persist } from 'zustand/middleware'


interface noteStateItems {
    id: string,
    title: string,
    content: string,
    createdAt: string,
    tags: Array<string>,
    updatedAt: string
}

interface noteState {
    notes: Array<noteStateItems>,
    noteTagOptions: Array<string>,
    updateNote: (updatedNote: noteStateItems) => void
    addNote: (newNote: noteStateItems) => void
    deleteNote: (noteId: string) => void
}
export const useNoteStore = create<noteState>()(

    persist(
        (set) => ({
            notes: [],
            noteTagOptions: ["Urgent", "Important", "Stupid"],
            updateNote: (updatedNote) => set((state) => {


                const indexOfToUpdate = state.notes.findIndex((item) => item.id === updatedNote.id);
                if (indexOfToUpdate !== -1) {
                    const updatedNotes = [...state.notes];
                    const existingNote = updatedNotes[indexOfToUpdate];

                    // Update fields except createdAt (title, tags, content, updatedAt )
                    existingNote.tags = updatedNote.tags;
                    existingNote.content = updatedNote.content;
                    existingNote.title = updatedNote.title;
                    existingNote.updatedAt = updatedNote.updatedAt;

                    return { notes: updatedNotes };

                }
                return state; // Note not found, return the original state

            }),
            addNote: (newNote) => set((state) => ({ notes: [...state.notes, newNote] })),
            deleteNote: (noteId) => set((state) => ({
                notes: state.notes.filter((note) => note.id !== noteId)
            })),
        }),
        { name: 'noteStore' },
    ),
)