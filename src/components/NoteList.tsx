import './Menu.css';
import {
    IonButton,
    IonItem,
    IonLabel,
    IonText,
    IonList,
    IonListHeader,
} from '@ionic/react';
import React from 'react';
import NkDialog from '@/components/NkDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime)

import { useIonRouter } from '@ionic/react';
import { useNoteStore } from '@/noteStore';
import { useMemo, useState } from "react"
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

export const NoteList = ({ listPostion, toggleMenu }) => {
    const router = useIonRouter();
    const tags = useNoteStore((state) => state.noteTagOptions)
    const noteList = useNoteStore((state) => state.notes)

    const deleteNote = useNoteStore((state) => state.deleteNote)
    const [tagNow, setTagNow] = useState("All")


    const renderedItems = useMemo(() => {
        if (tagNow === "All") {
            return noteList.sort((a, b) => dayjs(b.updatedAt ? b.updatedAt : b.createdAt) - dayjs(a.updatedAt ? a.updatedAt : a.createdAt))
        }

        const tagNoteList = noteList.filter((note) => note.tags.includes(tagNow))
        return tagNoteList.sort((a, b) => dayjs(b.updatedAt ? b.updatedAt : b.createdAt) - dayjs(a.updatedAt ? a.updatedAt : a.createdAt))

    }, [tagNow, noteList])


    const handleDeleteNote = async (id: string) => {
        // Delete from the store
        deleteNote(id)
        // Delete the file
        await Filesystem.deleteFile({
            path: `/notes/${id}.json`,
            directory: Directory.Data,
        });
        if (listPostion === "menu") {
            toggleMenu()
        }
        router.push('/folder/Welcome');
    };
    const toNotePage = async (id: string) => {
        router.push(`/notes/${id}`);

    };
    const showTag = async (tag: string) => {
        setTagNow(tag)
    }
    const showAll = async () => {
        setTagNow("All")

    }
    return (<>
        <Tabs defaultValue="all" className="w-full border border-x-0 border-b-0 border-orange-600 pt-5 mt-5">
            {/* <TabsList className={listPostion === "menu" ? 'divTagsCol' : 'divTagsRow'}> */}
            <TabsList className="flex flex-col gap-3">

                <TabsTrigger value="all" onClick={() => showAll()}>All</TabsTrigger>
                <div className='flex flex-row'>
                    {tags.map((tag, index) => {
                        return (
                            <TabsTrigger
                                value={tag}
                                key={tag}
                                onClick={() => showTag(tag)}>
                                {tag}
                            </TabsTrigger>
                        )
                    })}
                </div>
            </TabsList>
        </Tabs>

        <IonList id="labels-list">
            {/* <IonListHeader>My Notes :  {"\u00A0"}<span className='text-orange-500'>{tagNow}</span></IonListHeader> */}
            {
                renderedItems.map((item, index) => {
                    return (
                        <IonItem key={index} >
                            <div className={listPostion === "menu" ? 'divNoteListItemCol' : 'divNoteListItemRow'}>
                                <div className='flex flex-col w-full' onClick={async () => {
                                    toNotePage(item.id);
                                    if (listPostion === "menu") {
                                        toggleMenu()
                                    }
                                }}>
                                    <IonText className='cursor-pointer text-wrap mr-2 w-5/6'>{item.title ? item.title : "No Title"}</IonText>
                                    <IonLabel className="updateAtLabel" >

                                        {dayjs(item.updatedAt ? item.updatedAt : item.createdAt).fromNow()}
                                    </IonLabel>
                                </div>
                                <NkDialog
                                    itemID={item.id}
                                    deleteFunction={() => handleDeleteNote(item.id)}
                                    dialogContent=""
                                    dialogTitle="Are you sure?"
                                    dialogDescription="" >
                                    <IonButton>Delete</IonButton>
                                </NkDialog>
                            </div>

                        </IonItem>
                    )
                }
                )
            }

        </IonList>
    </>)
}