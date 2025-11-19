import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonBadge, IonIcon, IonImg, IonItem, IonLabel, IonSelect, IonSelectOption, IonText, useIonRouter, useIonViewWillEnter } from '@ionic/react';
import { arrowBackOutline, locationOutline, timeOutline, flagOutline, cameraOutline } from 'ionicons/icons';
import { Incidente, EstadoIncidente } from '../types';
import { StorageService } from '../services/storage.service';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';
import './DetalleIncidente.css';

const DetalleIncidente: React.FC = () => {
  const location = useLocation();
  const router = useIonRouter();
  const [incidente, setIncidente] = useState<Incidente | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState<EstadoIncidente | ''>('');

  useIonViewWillEnter(() => {
    const usuario = AuthService.obtenerUsuarioActual();
    if (!usuario) {
      router.push('/login', 'back', 'replace');
      return;
    }

    cargarIncidente();
  });

  const cargarIncidente = () => {
    const pathParts = location.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    if (!id) {
      router.push('/lista-incidentes');
      return;
    }
    const incidenteEncontrado = StorageService.obtenerIncidentePorId(id);
    if (incidenteEncontrado) {
      setIncidente(incidenteEncontrado);
      setNuevoEstado(incidenteEncontrado.estado);
    } else {
      router.push('/lista-incidentes');
    }
  };

  const handleCambiarEstado = async () => {
    if (!incidente || !nuevoEstado || nuevoEstado === incidente.estado) return;

    const incidenteActualizado: Incidente = {
      ...incidente,
      estado: nuevoEstado as EstadoIncidente,
      fechaActualizacion: new Date().toISOString()
    };

    await StorageService.guardarIncidente(incidenteActualizado);
    await NotificationService.notificarCambioEstado(incidente, nuevoEstado as EstadoIncidente);
    setIncidente(incidenteActualizado);
  };

  const obtenerColorEstado = (estado: EstadoIncidente) => {
    switch (estado) {
      case EstadoIncidente.PENDIENTE:
        return 'warning';
      case EstadoIncidente.EN_PROGRESO:
        return 'primary';
      case EstadoIncidente.RESUELTO:
        return 'success';
      default:
        return 'medium';
    }
  };

  const obtenerColorPrioridad = (prioridad: string) => {
    switch (prioridad) {
      case 'alta':
        return 'danger';
      case 'media':
        return 'warning';
      case 'baja':
        return 'success';
      default:
        return 'medium';
    }
  };

  const obtenerTextoTipo = (tipo: string) => {
    const tipos: Record<string, string> = {
      'equipo_danado': 'Equipo Dañado',
      'objeto_perdido': 'Objeto Perdido',
      'olvido_luces': 'Olvido de Luces',
      'olvido_aires': 'Olvido de Aires'
    };
    return tipos[tipo] || tipo;
  };

  if (!incidente) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Cargando...</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <p>Cargando incidente...</p>
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
          <IonTitle>Detalle del Incidente</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{obtenerTextoTipo(incidente.tipo)}</IonCardTitle>
            <div className="badges-header">
              <IonBadge color={obtenerColorEstado(incidente.estado)}>
                {incidente.estado}
              </IonBadge>
              <IonBadge color={obtenerColorPrioridad(incidente.prioridad)}>
                {incidente.prioridad}
              </IonBadge>
            </div>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonIcon icon={locationOutline} slot="start" />
              <IonLabel>
                <h3>Ubicación</h3>
                <p>{incidente.ubicacion}</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonIcon icon={timeOutline} slot="start" />
              <IonLabel>
                <h3>Fecha y Hora</h3>
                <p>{new Date(incidente.fecha).toLocaleDateString()} {incidente.hora}</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonIcon icon={flagOutline} slot="start" />
              <IonLabel>
                <h3>Prioridad</h3>
                <p>{incidente.prioridad}</p>
              </IonLabel>
            </IonItem>

            <div className="descripcion-section">
              <IonLabel>
                <h3>Descripción</h3>
              </IonLabel>
              <IonText>
                <p>{incidente.descripcion}</p>
              </IonText>
            </div>

            {incidente.notas && (
              <div className="notas-section">
                <IonLabel>
                  <h3>Notas Adicionales</h3>
                </IonLabel>
                <IonText>
                  <p>{incidente.notas}</p>
                </IonText>
              </div>
            )}

            {incidente.fotos && incidente.fotos.length > 0 && (
              <div className="fotos-section">
                <IonLabel>
                  <h3>
                    <IonIcon icon={cameraOutline} />
                    Fotos
                  </h3>
                </IonLabel>
                <div className="fotos-grid">
                  {incidente.fotos.map((foto, index) => (
                    <IonImg key={index} src={foto} className="foto-detalle" />
                  ))}
                </div>
              </div>
            )}

            <div className="fechas-section">
              <IonText color="medium">
                <p>Reportado: {new Date(incidente.fechaCreacion).toLocaleString()}</p>
                {incidente.fechaActualizacion !== incidente.fechaCreacion && (
                  <p>Última actualización: {new Date(incidente.fechaActualizacion).toLocaleString()}</p>
                )}
              </IonText>
            </div>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Cambiar Estado</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel>Nuevo Estado</IonLabel>
              <IonSelect
                value={nuevoEstado}
                onIonChange={(e) => setNuevoEstado(e.detail.value)}
              >
                <IonSelectOption value={EstadoIncidente.PENDIENTE}>Pendiente</IonSelectOption>
                <IonSelectOption value={EstadoIncidente.EN_PROGRESO}>En Progreso</IonSelectOption>
                <IonSelectOption value={EstadoIncidente.RESUELTO}>Resuelto</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonButton
              expand="block"
              onClick={handleCambiarEstado}
              disabled={!nuevoEstado || nuevoEstado === incidente.estado}
              className="ion-margin-top"
            >
              Actualizar Estado
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default DetalleIncidente;

