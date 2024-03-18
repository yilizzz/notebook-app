import { IonPage, IonLabel } from "@ionic/react";
import { IonButtons, IonContent, IonText, IonHeader, IonMenuButton, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from "react-router";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { useState, useEffect, useMemo } from "react";
import { withRouter } from "react-router-dom";
import "./Note.css"

import { Input } from "@/components/ui/input";
import { CKEditor } from '@ckeditor/ckeditor5-react';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { useNoteStore } from '@/noteStore';
import dayjs from 'dayjs'

import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Toggle } from "@/components/ui/toggle"

function NotePage() {

    const { id } = useParams<{ id: string; }>();
    const noteList = useNoteStore((state) => state.notes)
    const currentNote = useMemo(() => noteList.find((note) => note.id === id), [noteList])
    // If it's a empty note, show its createdAt instead of updatedAt
    const createdAt = currentNote?.createdAt
    const updateNoteStore = useNoteStore((state) => state.updateNote)
    const [content, setContent] = useState<string>(currentNote ? currentNote.content : '')
    const [title, setTitle] = useState<string>(currentNote ? currentNote.title : '')
    const [updatedAt, setUpdatedAt] = useState<string>(currentNote ? currentNote.updatedAt : '')
    const [tagsChoosed, setTagsChoosed] = useState<Array<string>>((currentNote ? currentNote.tags : []))
    const [contentEdited, setContentEdited] = useState(false)

    const tagOptions = useNoteStore((state) => state.noteTagOptions)


    const updateNote = async (id: string) => {

        const thisNote = noteList.find((item) => item.id === id)
        const createdAtInfo = thisNote?.createdAt;
        const timeNowString = dayjs().toString()
        setUpdatedAt(timeNowString)
        const infoNote = { id: id, title: title, content: content, tags: tagsChoosed, updatedAt: timeNowString, createdAt: createdAtInfo }
        updateNoteStore(infoNote)

        const stringInfoNote = JSON.stringify(infoNote)
        await Filesystem.writeFile({
            path: `notes/${id}.json`,
            data: stringInfoNote,
            directory: Directory.Documents,
            encoding: Encoding.UTF8,
            recursive: true
        });

    }

    useEffect(() => {
        if (contentEdited) {
            updateNote(id);
        }

    }, [title, content, tagsChoosed, contentEdited]);
    // useEffect(() => {
    //     updateNote(id);
    // }, [content]);
    // useEffect(() => {
    //     updateNote(id);
    // }, [tagsChoosed]);

    const handleTagClick = async (tag: string) => {
        const isTagSelected = tagsChoosed.includes(tag);
        // type tagsList= Array<string>
        let tagsList: string[]
        const updatedTagsChoosed = (isTagSelected: boolean) => {

            if (isTagSelected) {
                tagsList = tagsChoosed.filter((selectedTag) => selectedTag !== tag) // Remove tag if already selected
            }
            else {
                tagsList = [...tagsChoosed, tag]; // Add tag if not selected
            }
        };
        updatedTagsChoosed(isTagSelected)
        setTagsChoosed(tagsList);
        setContentEdited(true)
        // updateNote(id);

    }
    return <IonPage id="main-content">
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonMenuButton />
                </IonButtons>
                <IonTitle>Menu</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">

            <div className="flex flex-row items-end gap-3 ion-padding-top ion-padding-bottom">
                <IonLabel className="font-bold text-2xl">Title</IonLabel>
                <IonLabel className="text-sm">Updated At</IonLabel>
                <IonText><p className="text-sm">{dayjs(updatedAt ? updatedAt : createdAt).format('YYYY-MM-DD HH:mm:ss')}</p></IonText>
            </div>
            <Input
                value={title}
                onChange={async (e) => {
                    setTitle(e.target.value);
                    // updateNote(id);
                    setContentEdited(true)
                }
                } />

            <ToggleGroup type="multiple" className="flex-row justify-start ion-padding-top">
                {tagOptions?.map((tag, index) => {
                    return (<>
                        <Toggle key={index} pressed={tagsChoosed.includes(tag)} onClick={() => handleTagClick(tag)}>
                            <span key={index} className="text-orange-600">{tag}</span>
                        </Toggle>
                    </>
                    )
                })}
            </ToggleGroup>

            <CKEditor
                editor={ClassicEditor}

                config={{
                    toolbar: ['heading', '|', 'bold', 'italic', 'blockQuote', 'link', 'numberedList', 'bulletedList', '|', 'undo', 'redo']
                }}
                data={content}
                onChange={async (event, editor) => {
                    const text = editor.getData()
                    setContent(text)
                    setContentEdited(true)
                    // updateNote(id);
                }}
            />
        </IonContent>
    </IonPage>

}

export default withRouter(NotePage)