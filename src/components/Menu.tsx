import {
  IonContent,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';
import React from 'react';
import { useIonRouter } from '@ionic/react';
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime)


import { useLocation } from 'react-router-dom';
import { archiveOutline, archiveSharp, bookmarkOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
import './Menu.css';
import NkDialog from '@/components/NkDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Button } from './ui/button';
import { PropsWithoutRef, ReactNode, useEffect, useMemo, useRef, useState } from "react"
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
// import { useIonRouter } from '@ionic/react';
import { useNoteStore } from '@/noteStore';
import { CreateNewNoteButton } from './CreateNewNoteButton';
import { NoteList } from './NoteList';


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
  const menuRef = React.useRef<HTMLIonMenuElement>(null)

  const handleToggle = () => {
    menuRef.current?.toggle()
  }
  const router = useIonRouter();
  const handleHeaderClick = () => {
    menuRef.current?.toggle()
    router.push('/folder/Welcome');
  }
  return (

    <IonMenu ref={menuRef} contentId="main-content" type="overlay" className='ion-no-border'>

      <IonContent id="menuContent">
        <IonList className="header-list">
          <IonListHeader className='flex flex-col items-center'>
            <IonButton onClick={handleHeaderClick} className='text-xl w-20 mb-5'>📔NOTE</IonButton>
            <CreateNewNoteButton handleAfterCreation={() => menuRef.current?.toggle()} />
          </IonListHeader>
          {/* {appPages.map((appPage, index) => { */}
          {/* return ( */}
          {/* <> */}
          {/* <IonButton key={appPage.title} onClick={handleCreateNewNote}>{appPage.title}</IonButton> */}
          {/* <div className='flex justify-center'> */}

          {/* </div> */}
          {/* </> */}
          {/* ); */}
          {/* })} */}
        </IonList>

        <NoteList listPostion="menu" toggleMenu={handleToggle}></NoteList>

      </IonContent>
    </IonMenu >
  );
};

export default Menu;
