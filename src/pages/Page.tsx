import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import { CreateNewNoteButton } from '../components/CreateNewNoteButton';
import { NoteList } from '../components/NoteList';

const Page: React.FC = () => {

  const { name } = useParams<{ name: string; }>();

  return (
    <>
      <IonPage id="main-content" >
        <IonHeader>
          <IonToolbar color="black">
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {/* <Button onClick={createNewNote}>NEW NOTE</Button> */}
          <div className='flex flex-col justify-start items-center h-5/6 mt-5 '>
            <CreateNewNoteButton handleAfterCreation={() => { }} />
            <NoteList listPostion="page" toggleMenu={() => { }}></NoteList>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Page;
