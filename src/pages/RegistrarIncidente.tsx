import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonTextarea, IonCard, IonCardContent, IonIcon, IonImg, IonAlert, useIonRouter } from '@ionic/react';
import { cameraOutline, checkmarkCircleOutline, arrowBackOutline } from 'ionicons/icons';
import { TipoIncidente, Prioridad, Ubicacion, EstadoIncidente, Incidente } from '../types';
import { StorageService } from '../services/storage.service';
import { NotificationService } from '../services/notification.service';
import { CameraService } from '../services/camera.service';
import { AuthService } from '../services/auth.service';
import './RegistrarIncidente.css';

const RegistrarIncidente: React.FC = () => {
  const router = useIonRouter();
  const [tipo, setTipo] = useState<TipoIncidente>(TipoIncidente.EQUIPO_DANADO);
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState<Ubicacion>(Ubicacion.AULA);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [hora, setHora] = useState(new Date().toTimeString().slice(0, 5));
  const [prioridad, setPrioridad] = useState<Prioridad>(Prioridad.MEDIA);
  const [fotos, setFotos] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [ubicacionDetalle, setUbicacionDetalle] = useState('');

  useEffect(() => {
    const usuario = AuthService.obtenerUsuarioActual();
    if (!usuario) {
      router.push('/login', 'back', 'replace');
      return;
    }

    // Obtener tipo desde query params si existe
    const params = new URLSearchParams(window.location.search);
    const tipoParam = params.get('tipo');
    if (tipoParam) {
      setTipo(tipoParam as TipoIncidente);
    }
  }, [router]);

  const handleTomarFoto = async () => {
    try {
      const foto = await CameraService.tomarFoto();
      setFotos([...fotos, foto]);
    } catch (error) {
      console.error('Error al tomar foto:', error);
    }
  };

  const handleSeleccionarFoto = async () => {
    try {
      const foto = await CameraService.seleccionarFoto();
      setFotos([...fotos, foto]);
    } catch (error) {
      console.error('Error al seleccionar foto:', error);
    }
  };

  const handleEliminarFoto = (index: number) => {
    setFotos(fotos.filter((_, i) => i !== index));
  };

  const handleGuardar = async () => {
    if (!descripcion.trim()) {
      alert('Por favor ingresa una descripción');
      return;
    }

    const usuario = AuthService.obtenerUsuarioActual();
    if (!usuario) return;

    const incidente: Incidente = {
      id: Date.now().toString(),
      tipo,
      descripcion,
      ubicacion,
      fecha,
      hora,
      prioridad,
      estado: EstadoIncidente.PENDIENTE,
      fotos: fotos.length > 0 ? fotos : undefined,
      usuarioId: usuario.id,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
      notas: ubicacionDetalle ? `Detalle ubicación: ${ubicacionDetalle}` : undefined
    };

    await StorageService.guardarIncidente(incidente);
    await NotificationService.enviarNotificacion(
      'Incidente Reportado',
      `Tu incidente "${tipo}" ha sido reportado exitosamente`
    );
    setShowSuccess(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButton slot="start" fill="clear" onClick={() => router.goBack()}>
            <IonIcon icon={arrowBackOutline} />
          </IonButton>
          <IonTitle>Registrar Incidente</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonCard>
          <IonCardContent>
            <IonItem>
              <IonLabel position="stacked">Tipo de Incidente *</IonLabel>
              <IonSelect value={tipo} onIonChange={(e) => setTipo(e.detail.value)}>
                <IonSelectOption value={TipoIncidente.EQUIPO_DANADO}>Equipo Dañado</IonSelectOption>
                <IonSelectOption value={TipoIncidente.OBJETO_PERDIDO}>Objeto Perdido</IonSelectOption>
                <IonSelectOption value={TipoIncidente.OLVIDO_LUCES}>Olvido de Luces</IonSelectOption>
                <IonSelectOption value={TipoIncidente.OLVIDO_AIRES}>Olvido de Aires</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Descripción *</IonLabel>
              <IonTextarea
                rows={4}
                value={descripcion}
                placeholder="Describe el incidente detalladamente..."
                onIonInput={(e) => setDescripcion(e.detail.value!)}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Ubicación *</IonLabel>
              <IonSelect value={ubicacion} onIonChange={(e) => setUbicacion(e.detail.value)}>
                <IonSelectOption value={Ubicacion.AULA}>Aula</IonSelectOption>
                <IonSelectOption value={Ubicacion.CUBICULO}>Cubículo</IonSelectOption>
                <IonSelectOption value={Ubicacion.LABORATORIO}>Laboratorio</IonSelectOption>
                <IonSelectOption value={Ubicacion.AUDITORIO}>Auditorio</IonSelectOption>
                <IonSelectOption value={Ubicacion.DIRECCION}>Dirección</IonSelectOption>
                <IonSelectOption value={Ubicacion.BANO}>Baño</IonSelectOption>
                <IonSelectOption value={Ubicacion.EXPLANADA}>Explanada</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Detalle de Ubicación (opcional)</IonLabel>
              <IonInput
                value={ubicacionDetalle}
                placeholder="Ej: Aula 101, Cubículo 5, etc."
                onIonInput={(e) => setUbicacionDetalle(e.detail.value!)}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Fecha *</IonLabel>
              <IonInput
                type="date"
                value={fecha}
                onIonInput={(e) => setFecha(e.detail.value!)}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Hora *</IonLabel>
              <IonInput
                type="time"
                value={hora}
                onIonInput={(e) => setHora(e.detail.value!)}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Prioridad *</IonLabel>
              <IonSelect value={prioridad} onIonChange={(e) => setPrioridad(e.detail.value)}>
                <IonSelectOption value={Prioridad.BAJA}>Baja</IonSelectOption>
                <IonSelectOption value={Prioridad.MEDIA}>Media</IonSelectOption>
                <IonSelectOption value={Prioridad.ALTA}>Alta</IonSelectOption>
              </IonSelect>
            </IonItem>

            <div className="fotos-section">
              <IonLabel>Fotos (opcional)</IonLabel>
              <div className="fotos-buttons">
                <IonButton fill="outline" onClick={handleTomarFoto}>
                  <IonIcon icon={cameraOutline} slot="start" />
                  Tomar Foto
                </IonButton>
                <IonButton fill="outline" onClick={handleSeleccionarFoto}>
                  <IonIcon icon={cameraOutline} slot="start" />
                  Seleccionar
                </IonButton>
              </div>
              {fotos.length > 0 && (
                <div className="fotos-preview">
                  {fotos.map((foto, index) => (
                    <div key={index} className="foto-item">
                      <IonImg src={foto} />
                      <IonButton
                        fill="clear"
                        color="danger"
                        size="small"
                        onClick={() => handleEliminarFoto(index)}
                      >
                        Eliminar
                      </IonButton>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <IonButton expand="block" onClick={handleGuardar} className="ion-margin-top">
              <IonIcon icon={checkmarkCircleOutline} slot="start" />
              Guardar Incidente
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonAlert
          isOpen={showSuccess}
          onDidDismiss={() => {
            setShowSuccess(false);
            router.push('/home');
          }}
          header="Éxito"
          message="El incidente ha sido registrado correctamente"
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default RegistrarIncidente;

