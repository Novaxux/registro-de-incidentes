import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel, IonToggle, IonButton, IonIcon, IonInput, IonAlert, useIonRouter } from '@ionic/react';
import { arrowBackOutline, notificationsOutline, shieldOutline, personOutline, saveOutline, trashOutline } from 'ionicons/icons';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { Usuario } from '../types';
import './Configuracion.css';

const Configuracion: React.FC = () => {
  const router = useIonRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [notificacionesHabilitadas, setNotificacionesHabilitadas] = useState(true);
  const [biometriaHabilitada, setBiometriaHabilitada] = useState(false);
  const [showConfirmacion, setShowConfirmacion] = useState(false);

  useEffect(() => {
    const usuarioActual = AuthService.obtenerUsuarioActual();
    if (!usuarioActual) {
      router.push('/login', 'back', 'replace');
      return;
    }

    setUsuario(usuarioActual);
    setNotificacionesHabilitadas(usuarioActual.notificacionesHabilitadas);
    setBiometriaHabilitada(usuarioActual.biometriaHabilitada);
  }, [router]);

  const handleGuardarConfiguracion = () => {
    if (!usuario) return;

    const usuarioActualizado: Usuario = {
      ...usuario,
      notificacionesHabilitadas,
      biometriaHabilitada
    };

    StorageService.guardarUsuario(usuarioActualizado);
    setUsuario(usuarioActualizado);
    alert('Configuración guardada exitosamente');
  };

  const handleEliminarDatos = () => {
    setShowConfirmacion(true);
  };

  const confirmarEliminacion = () => {
    localStorage.clear();
    AuthService.logout();
    router.push('/login', 'back', 'replace');
  };

  if (!usuario) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Cargando...</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <p>Cargando configuración...</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButton slot="start" fill="clear" onClick={() => router.goBack()}>
            <IonIcon icon={arrowBackOutline} />
          </IonButton>
          <IonTitle>Configuración</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={personOutline} />
              Perfil de Usuario
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel>
                <h3>Nombre</h3>
                <p>{usuario.nombre}</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <h3>Email</h3>
                <p>{usuario.email}</p>
              </IonLabel>
            </IonItem>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Notificaciones</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonIcon icon={notificationsOutline} slot="start" />
              <IonLabel>
                <h3>Habilitar Notificaciones</h3>
                <p>Recibir actualizaciones sobre tus incidentes</p>
              </IonLabel>
              <IonToggle
                checked={notificacionesHabilitadas}
                onIonChange={(e) => setNotificacionesHabilitadas(e.detail.checked)}
              />
            </IonItem>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Seguridad</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonIcon icon={shieldOutline} slot="start" />
              <IonLabel>
                <h3>Autenticación Biométrica</h3>
                <p>Usar huella dactilar o reconocimiento facial</p>
              </IonLabel>
              <IonToggle
                checked={biometriaHabilitada}
                onIonChange={(e) => setBiometriaHabilitada(e.detail.checked)}
              />
            </IonItem>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Acciones</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonButton expand="block" onClick={handleGuardarConfiguracion}>
              <IonIcon icon={saveOutline} slot="start" />
              Guardar Configuración
            </IonButton>
            <IonButton
              expand="block"
              color="danger"
              fill="outline"
              onClick={handleEliminarDatos}
              className="ion-margin-top"
            >
              <IonIcon icon={trashOutline} slot="start" />
              Eliminar Todos los Datos
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonAlert
          isOpen={showConfirmacion}
          onDidDismiss={() => setShowConfirmacion(false)}
          header="Confirmar Eliminación"
          message="¿Estás seguro de que deseas eliminar todos los datos? Esta acción no se puede deshacer."
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel'
            },
            {
              text: 'Eliminar',
              role: 'destructive',
              handler: confirmarEliminacion
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Configuracion;

