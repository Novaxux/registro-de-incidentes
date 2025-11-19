import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonItem, IonLabel, IonSelect, IonSelectOption, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonBadge, IonIcon, IonSearchbar, useIonRouter } from '@ionic/react';
import { addOutline, filterOutline, arrowBackOutline } from 'ionicons/icons';
import { Incidente, TipoIncidente, EstadoIncidente, Ubicacion, Prioridad } from '../types';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import './ListaIncidentes.css';

const ListaIncidentes: React.FC = () => {
  const router = useIonRouter();
  const [incidentes, setIncidentes] = useState<Incidente[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>('');
  const [filtroEstado, setFiltroEstado] = useState<string>('');
  const [filtroUbicacion, setFiltroUbicacion] = useState<string>('');
  const [filtroPrioridad, setFiltroPrioridad] = useState<string>('');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const usuario = AuthService.obtenerUsuarioActual();
    if (!usuario) {
      router.push('/login', 'back', 'replace');
      return;
    }

    cargarIncidentes();
  }, [router, filtroTipo, filtroEstado, filtroUbicacion, filtroPrioridad, busqueda]);

  const cargarIncidentes = () => {
    let incidentesFiltrados = StorageService.obtenerIncidentes();

    // Aplicar filtros
    const filtros: any = {};
    if (filtroTipo) filtros.tipo = filtroTipo as TipoIncidente;
    if (filtroEstado) filtros.estado = filtroEstado as EstadoIncidente;
    if (filtroUbicacion) filtros.ubicacion = filtroUbicacion as Ubicacion;
    if (filtroPrioridad) filtros.prioridad = filtroPrioridad as Prioridad;

    if (Object.keys(filtros).length > 0) {
      incidentesFiltrados = StorageService.filtrarIncidentes(filtros);
    }

    // Aplicar búsqueda por texto
    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase();
      incidentesFiltrados = incidentesFiltrados.filter(incidente =>
        incidente.descripcion.toLowerCase().includes(busquedaLower) ||
        incidente.tipo.toLowerCase().includes(busquedaLower)
      );
    }

    setIncidentes(incidentesFiltrados);
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

  const obtenerColorPrioridad = (prioridad: Prioridad) => {
    switch (prioridad) {
      case Prioridad.ALTA:
        return 'danger';
      case Prioridad.MEDIA:
        return 'warning';
      case Prioridad.BAJA:
        return 'success';
      default:
        return 'medium';
    }
  };

  const obtenerTextoTipo = (tipo: TipoIncidente) => {
    const tipos: Record<TipoIncidente, string> = {
      [TipoIncidente.EQUIPO_DANADO]: 'Equipo Dañado',
      [TipoIncidente.OBJETO_PERDIDO]: 'Objeto Perdido',
      [TipoIncidente.OLVIDO_LUCES]: 'Olvido de Luces',
      [TipoIncidente.OLVIDO_AIRES]: 'Olvido de Aires'
    };
    return tipos[tipo] || tipo;
  };

  const limpiarFiltros = () => {
    setFiltroTipo('');
    setFiltroEstado('');
    setFiltroUbicacion('');
    setFiltroPrioridad('');
    setBusqueda('');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButton slot="start" fill="clear" onClick={() => router.goBack()}>
            <IonIcon icon={arrowBackOutline} />
          </IonButton>
          <IonTitle>Incidentes Reportados</IonTitle>
          <IonButton slot="end" fill="clear" onClick={() => router.push('/registrar-incidente')}>
            <IonIcon icon={addOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="lista-container">
          <IonSearchbar
            value={busqueda}
            onIonInput={(e) => setBusqueda(e.detail.value!)}
            placeholder="Buscar incidentes..."
          />

          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={filterOutline} />
                Filtros
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonLabel>Tipo</IonLabel>
                <IonSelect value={filtroTipo} onIonChange={(e) => setFiltroTipo(e.detail.value)} placeholder="Todos">
                  <IonSelectOption value="">Todos</IonSelectOption>
                  <IonSelectOption value={TipoIncidente.EQUIPO_DANADO}>Equipo Dañado</IonSelectOption>
                  <IonSelectOption value={TipoIncidente.OBJETO_PERDIDO}>Objeto Perdido</IonSelectOption>
                  <IonSelectOption value={TipoIncidente.OLVIDO_LUCES}>Olvido de Luces</IonSelectOption>
                  <IonSelectOption value={TipoIncidente.OLVIDO_AIRES}>Olvido de Aires</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel>Estado</IonLabel>
                <IonSelect value={filtroEstado} onIonChange={(e) => setFiltroEstado(e.detail.value)} placeholder="Todos">
                  <IonSelectOption value="">Todos</IonSelectOption>
                  <IonSelectOption value={EstadoIncidente.PENDIENTE}>Pendiente</IonSelectOption>
                  <IonSelectOption value={EstadoIncidente.EN_PROGRESO}>En Progreso</IonSelectOption>
                  <IonSelectOption value={EstadoIncidente.RESUELTO}>Resuelto</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel>Ubicación</IonLabel>
                <IonSelect value={filtroUbicacion} onIonChange={(e) => setFiltroUbicacion(e.detail.value)} placeholder="Todos">
                  <IonSelectOption value="">Todos</IonSelectOption>
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
                <IonLabel>Prioridad</IonLabel>
                <IonSelect value={filtroPrioridad} onIonChange={(e) => setFiltroPrioridad(e.detail.value)} placeholder="Todos">
                  <IonSelectOption value="">Todos</IonSelectOption>
                  <IonSelectOption value={Prioridad.BAJA}>Baja</IonSelectOption>
                  <IonSelectOption value={Prioridad.MEDIA}>Media</IonSelectOption>
                  <IonSelectOption value={Prioridad.ALTA}>Alta</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonButton expand="block" fill="outline" onClick={limpiarFiltros} className="ion-margin-top">
                Limpiar Filtros
              </IonButton>
            </IonCardContent>
          </IonCard>

          <div className="incidentes-list">
            {incidentes.length === 0 ? (
              <IonCard>
                <IonCardContent>
                  <p>No se encontraron incidentes</p>
                </IonCardContent>
              </IonCard>
            ) : (
              incidentes.map((incidente) => (
                <IonCard
                  key={incidente.id}
                  button
                  onClick={() => router.push(`/detalle-incidente/${incidente.id}`)}
                >
                  <IonCardHeader>
                    <IonCardTitle>{obtenerTextoTipo(incidente.tipo)}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p>{incidente.descripcion.substring(0, 100)}...</p>
                    <div className="badges-container">
                      <IonBadge color={obtenerColorEstado(incidente.estado)}>
                        {incidente.estado}
                      </IonBadge>
                      <IonBadge color={obtenerColorPrioridad(incidente.prioridad)}>
                        {incidente.prioridad}
                      </IonBadge>
                      <IonBadge color="medium">{incidente.ubicacion}</IonBadge>
                    </div>
                    <p className="fecha-texto">
                      {new Date(incidente.fecha).toLocaleDateString()} {incidente.hora}
                    </p>
                  </IonCardContent>
                </IonCard>
              ))
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ListaIncidentes;

