import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime)


import { useLocation } from 'react-router-dom';
import { archiveOutline, archiveSharp, bookmarkOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
import './Menu.css';
import NkDialog from '@/components/NkDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Button } from './ui/button';
import { PropsWithoutRef, ReactNode, useEffect, useMemo, useState } from "react"
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { v4 as uuid } from 'uuid';
import { useIonRouter } from '@ionic/react';
import { useNoteStore } from '@/noteStore';


interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'New Note',
    url: '/folder/Inbox',
    iosIcon: mailOutline,
    mdIcon: mailSharp
  },
  // {
  //   title: 'Outbox',
  //   url: '/folder/Outbox',
  //   iosIcon: paperPlaneOutline,
  //   mdIcon: paperPlaneSharp
  // },
  // {
  //   title: 'Favorites',
  //   url: '/folder/Favorites',
  //   iosIcon: heartOutline,
  //   mdIcon: heartSharp
  // },
  // {
  //   title: 'Archived',
  //   url: '/folder/Archived',
  //   iosIcon: archiveOutline,
  //   mdIcon: archiveSharp
  // },
  // {
  //   title: 'Trash',
  //   url: '/folder/Trash',
  //   iosIcon: trashOutline,
  //   mdIcon: trashSharp
  // },
  // {
  //   title: 'Spam',
  //   url: '/folder/Spam',
  //   iosIcon: warningOutline,
  //   mdIcon: warningSharp
  // }
];

// const labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

const Menu: React.FC = () => {


  const router = useIonRouter();
  const tags = useNoteStore((state) => state.noteTagOptions)
  const noteList = useNoteStore((state) => state.notes)
  const addNote = useNoteStore((state) => state.addNote)
  const deleteNote = useNoteStore((state) => state.deleteNote)
  // const [renderedItems, setRenderedItems] = useState([])
  const [tagNow, setTagNow] = useState("All")

  // const getRenderNoteList = async () => {

  //   if (tagNow === "All") {

  //     await setRenderedItems(noteList.sort((a, b) => dayjs(b.updatedAt ? b.updatedAt : b.createdAt) - dayjs(a.updatedAt ? a.updatedAt : a.createdAt)))
  //     console.log("all", noteList)
  //   } else {

  //     const tagNoteList = noteList.filter((note) => note.tags.includes(tagNow))
  //     await setRenderedItems(tagNoteList.sort((a, b) => dayjs(b.updatedAt ? b.updatedAt : b.createdAt) - dayjs(a.updatedAt ? a.updatedAt : a.createdAt)))
  //   }
  // }
  // useEffect(() => {
  //   getRenderNoteList()
  // }, [tagNow, noteList])
  const renderedItems = useMemo(() => {
    if (tagNow === "All") {
      return noteList.sort((a, b) => dayjs(b.updatedAt ? b.updatedAt : b.createdAt) - dayjs(a.updatedAt ? a.updatedAt : a.createdAt))
    }

    const tagNoteList = noteList.filter((note) => note.tags.includes(tagNow))
    return tagNoteList.sort((a, b) => dayjs(b.updatedAt ? b.updatedAt : b.createdAt) - dayjs(a.updatedAt ? a.updatedAt : a.createdAt))

  }, [tagNow, noteList])


  const handleCreateNewNote = async () => {
    const newNoteId = uuid()

    const infoInitialNote = { id: newNoteId, title: "", content: "", tags: [], createdAt: dayjs().toString(), updatedAt: "" }

    // Write into a file
    const stringInfoNote = JSON.stringify(infoInitialNote)
    await Filesystem.writeFile({
      path: `notes/${newNoteId}.json`,
      data: stringInfoNote,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
      recursive: true
    });
    // Add into the store
    addNote(infoInitialNote)
    // Redirect to new note page
    router.push(`/notes/${newNoteId}`);
  }


  const handleDeleteNote = async (id: string) => {
    // Delete from the store
    deleteNote(id)
    // Delete the file
    await Filesystem.deleteFile({
      path: `/notes/${id}.json`,
      directory: Directory.Documents,
    });
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

  return (

    <IonMenu contentId="main" type="overlay" className=" w-[200px]">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Note</IonListHeader>
          {appPages.map((appPage, index) => {
            return (
              <>
                <Button key={appPage.title} onClick={handleCreateNewNote}>{appPage.title}</Button>
              </>
            );
          })}
        </IonList>
        <IonList id="inbox-list">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className='h-36 flex flex-col items-start gap-2 bg-inherit '>
              <TabsTrigger className='' value="all" onClick={() => showAll()}>All</TabsTrigger>
              {tags.map((tag, index) => {
                return (
                  <TabsTrigger className=''
                    value={tag}
                    key={tag}
                    onClick={() => showTag(tag)}>
                    {tag}
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>
        </IonList>
        {/* <IonList>
          <IonMenuToggle key={"all"} autoHide={false}>
            <IonItem className='cursor-pointer' onClick={() => showAll()}>
              <IonLabel>All</IonLabel>
            </IonItem>
          </IonMenuToggle>
          {tags.map((tag, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className='cursor-pointer' onClick={() => showTag(tag)}>
                  <IonLabel>{tag}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            )
          })}

        </IonList> */}

        <IonList id="labels-list">
          <IonListHeader>My Notes : {tagNow}</IonListHeader>
          {
            renderedItems.map((item, index) => {
              return (
                <IonItem lines="none" key={index}>
                  <div className='flex-col'>
                    <div onClick={() => { toNotePage(item.id) }}>
                      <IonLabel className="cursor-pointer" >{item.title ? item.title : "No Title"}</IonLabel>
                      <div className="cursor-pointer" >

                        {dayjs(item.updatedAt ? item.updatedAt : item.createdAt).fromNow()}
                      </div>
                    </div>
                    {/* <Button onClick={handleDeleteNote(item.id)}>Delete</Button> 
                    <Button onClick={() => {
                      handleDeleteNote(item.id);
                    }}>Delete</Button> */}
                    <NkDialog
                      itemID={item.id}
                      deleteFunction={() => handleDeleteNote(item.id)}
                      dialogContent=""
                      dialogTitle="Are you sure?"
                      dialogDescription="" >
                      <Button>Delete</Button>
                    </NkDialog>
                  </div>
                </IonItem>
              )
            }
            )
          }

        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
