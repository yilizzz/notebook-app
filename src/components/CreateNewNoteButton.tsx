import { IonButton } from '@ionic/react'

import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { v4 as uuid } from 'uuid';
import { useIonRouter } from '@ionic/react';
import { useNoteStore } from '@/noteStore';
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime)


export const CreateNewNoteButton = ({ handleAfterCreation = () => { } }) => {
    const router = useIonRouter();
    const addNote = useNoteStore((state) => state.addNote)

    const createNewNote = async () => {
        const newNoteId = uuid()

        const infoInitialNoteForStore = { id: newNoteId, title: "", tags: [], createdAt: dayjs().toString(), updatedAt: "" }
        const infoInitialNote = { ...infoInitialNoteForStore, content: "" }

        // Write into a file
        const stringInfoNote = JSON.stringify(infoInitialNote)
        await Filesystem.stat({ directory: Directory.Data, path: 'notes' })
            .then(result => {
                console.log(result);
            }).catch(async err => {
                return await Filesystem.mkdir({
                    recursive: true,
                    directory: Directory.Data,
                    path: 'notes'
                })
            })
        await Filesystem.writeFile({
            path: `notes/${newNoteId}.json`,
            data: stringInfoNote,
            directory: Directory.Data,
            encoding: Encoding.UTF8,
            recursive: true
        });
        // Add into the store
        addNote(infoInitialNoteForStore)

        // Redirect to new note page
        router.push(`/notes/${newNoteId}`)

        handleAfterCreation()

    }

    return <><IonButton className="border-2 rounded-md bg-black text-slate-100" onClick={createNewNote}>NEW NOTE</IonButton></>
}