import { IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';


import Menu from '../components/Menu';
const Page: React.FC = () => {

  const { name } = useParams<{ name: string; }>();

  return (
    <>
      {/* <IonMenu contentId="main-content">
        hello
      </IonMenu> */}
      {/* <Menu></Menu> */}
      <IonPage id="main-content" >
        {/* <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader> */}
        <IonHeader>
          <IonToolbar color="black">
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">Tap the button in the toolbar to open the menu.</IonContent>

        {/* <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">{name}</IonTitle>
            </IonToolbar>
          </IonHeader>
          <ExploreContainer name={name} />

        </IonContent> */}
      </IonPage>
    </>
  );
};

export default Page;
