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

    const updateNoteStore = useNoteStore((state) => state.updateNote)

    const [content, setContent] = useState<string | null>(null)
    const [title, setTitle] = useState<string>("")
    const [createdAt, setCreatedAt] = useState<string>("")
    const [updatedAt, setUpdatedAt] = useState<string>("")
    const [tagsChoosed, setTagsChoosed] = useState<Array<string>>([])

    const readNote = async () => {

        const note = await Filesystem.readFile({
            path: `notes/${id}.json`,
            directory: Directory.Data,
            encoding: Encoding.UTF8,
        });

        const noteObj = JSON.parse(note.data)

        setTitle(noteObj.title)
        setContent(noteObj.content)
        setCreatedAt(noteObj.createdAt)
        setUpdatedAt(noteObj.updatedAt)
        setTagsChoosed(noteObj.tags)

    };
    useEffect(() => {
        readNote()
    }, [])


    const [contentEdited, setContentEdited] = useState(false)

    const tagOptions = useNoteStore((state) => state.noteTagOptions)


    const updateNote = async (id: string) => {

        const timeNowString = dayjs().toString()
        setUpdatedAt(timeNowString)

        const infoNoteForStore = { id: id, title: title, tags: tagsChoosed, updatedAt: timeNowString, createdAt: createdAt }
        const infoNote = { ...infoNoteForStore, content: content }

        updateNoteStore(infoNoteForStore)

        const stringInfoNote = JSON.stringify(infoNote)
        await Filesystem.writeFile({
            path: `notes/${id}.json`,
            data: stringInfoNote,
            directory: Directory.Data,
            encoding: Encoding.UTF8,
            recursive: true
        });

    }

    useEffect(() => {
        if (contentEdited) {
            updateNote(id);
        }
    }, [title, tagsChoosed, content, contentEdited]);


    const handleTagClick = async (tag: string) => {
        const isTagSelected = tagsChoosed ? tagsChoosed.includes(tag) : false;
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

            <div className="flex flex-row items-end gap-2 text-sm">
                <IonText >{updatedAt ? "Updated at" : "Created at"}</IonText>
                <IonText>{dayjs(updatedAt ? updatedAt : createdAt).format('YYYY-MM-DD HH:mm:ss')}</IonText>
            </div>

            <div className="flex flex-row justify-start items-center ion-padding-top max-[400px]:flex-col max-[400px]:items-start">
                <IonText className="font-bold mr-2">Title</IonText>
                <Input
                    value={title}
                    onChange={async (e) => {
                        setTitle(e.target.value);
                        setContentEdited(true)

                    }
                    } />
            </div>
            <ToggleGroup type="multiple" className="flex-row justify-start ion-padding-top">
                {tagOptions?.map((tag, index) => {
                    return (<>
                        <Toggle key={index} pressed={tagsChoosed?.includes(tag)} onClick={() => handleTagClick(tag)}>
                            <span key={index} className="text-orange-600">{tag}</span>
                        </Toggle>
                    </>
                    )
                })}
            </ToggleGroup>

            {typeof content === 'string' && (
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

                    }}

                />
            )}
        </IonContent>
    </IonPage>

}

export default withRouter(NotePage)