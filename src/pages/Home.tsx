import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonGrid, IonRow, IonCol, IonBadge, useIonRouter } from '@ionic/react';
import { addCircleOutline, listOutline, statsChartOutline, settingsOutline, logOutOutline, warningOutline, searchOutline, timeOutline } from 'ionicons/icons';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { StorageService } from '../services/storage.service';
import './Home.css';

const Home: React.FC = () => {
  const router = useIonRouter();
  const [notificacionesNoLeidas, setNotificacionesNoLeidas] = useState(0);
  const [totalIncidentes, setTotalIncidentes] = useState(0);

  useEffect(() => {
    const usuario = AuthService.obtenerUsuarioActual();
    if (!usuario) {
      router.push('/login', 'back', 'replace');
      return;
    }

    const actualizarContadores = () => {
      setNotificacionesNoLeidas(NotificationService.obtenerNotificacionesNoLeidas());
      setTotalIncidentes(StorageService.obtenerIncidentes().length);
    };

    actualizarContadores();
    const interval = setInterval(actualizarContadores, 5000);

    return () => clearInterval(interval);
  }, [router]);

  const handleLogout = () => {
    AuthService.logout();
    router.push('/login', 'back', 'replace');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Registro de Incidentes</IonTitle>
          <IonButton slot="end" fill="clear" onClick={handleLogout}>
            <IonIcon icon={logOutOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="home-container">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Bienvenido</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>Facultad de Telemática - Universidad de Colima</p>
              {notificacionesNoLeidas > 0 && (
                <IonBadge color="danger">{notificacionesNoLeidas} notificaciones</IonBadge>
              )}
            </IonCardContent>
          </IonCard>

          <IonGrid>
            <IonRow>
              <IonCol size="6">
                <IonCard button onClick={() => router.push('/registrar-incidente')}>
                  <IonCardContent className="action-card">
                    <IonIcon icon={addCircleOutline} size="large" color="primary" />
                    <h3>Reportar Incidente</h3>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol size="6">
                <IonCard button onClick={() => router.push('/lista-incidentes')}>
                  <IonCardContent className="action-card">
                    <IonIcon icon={listOutline} size="large" color="secondary" />
                    <h3>Ver Incidentes</h3>
                    {totalIncidentes > 0 && (
                      <IonBadge color="primary">{totalIncidentes}</IonBadge>
                    )}
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="6">
                <IonCard button onClick={() => router.push('/historial')}>
                  <IonCardContent className="action-card">
                    <IonIcon icon={statsChartOutline} size="large" color="tertiary" />
                    <h3>Historial</h3>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol size="6">
                <IonCard button onClick={() => router.push('/configuracion')}>
                  <IonCardContent className="action-card">
                    <IonIcon icon={settingsOutline} size="large" color="medium" />
                    <h3>Configuración</h3>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>

          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Accesos Rápidos</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonButton expand="block" fill="outline" onClick={() => router.push('/registrar-incidente?tipo=equipo_danado')}>
                <IonIcon icon={warningOutline} slot="start" />
                Equipo Dañado
              </IonButton>
              <IonButton expand="block" fill="outline" onClick={() => router.push('/registrar-incidente?tipo=objeto_perdido')} className="ion-margin-top">
                <IonIcon icon={searchOutline} slot="start" />
                Objeto Perdido
              </IonButton>
              <IonButton expand="block" fill="outline" onClick={() => router.push('/registrar-incidente?tipo=olvido_luces')} className="ion-margin-top">
                <IonIcon icon={timeOutline} slot="start" />
                Olvido de Luces
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
