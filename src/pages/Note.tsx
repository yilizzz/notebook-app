import { IonPage, IonLabel } from "@ionic/react";
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
        updateNote(id);
    }, [title]);
    useEffect(() => {
        updateNote(id);
    }, [content]);
    useEffect(() => {
        updateNote(id);
    }, [tagsChoosed]);

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

    }
    return <IonPage className="font-mono flex-col justify-start gap-4 mt-8 w-4/5">
        <IonLabel>Title</IonLabel>
        <Input
            value={title}
            onChange={async (e) => {
                setTitle(e.target.value);
            }
            } />

        <div className="flex flex-row">
            <IonLabel className="mr-2">Updated At</IonLabel>
            {dayjs(updatedAt ? updatedAt : createdAt).format('YYYY-MM-DD HH:mm:ss')}
        </div>

        <ToggleGroup type="multiple" className="flex-row justify-start">
            {tagOptions?.map((tag, index) => {
                return (<>
                    <Toggle key={index} pressed={tagsChoosed.includes(tag)} onClick={() => handleTagClick(tag)}>
                        <span className="text-orange-600">{tag}</span>
                    </Toggle>
                </>
                )
            })}
        </ToggleGroup>

        <CKEditor
            editor={ClassicEditor}
            data={content}
            onChange={async (event, editor) => {
                const text = editor.getData()
                setContent(text)
            }}
        />
    </IonPage>

}

export default withRouter(NotePage)