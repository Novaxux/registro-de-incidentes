import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonIcon, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonSelect, IonSelectOption, useIonRouter } from '@ionic/react';
import { arrowBackOutline, statsChartOutline, downloadOutline } from 'ionicons/icons';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { Estadisticas, TipoIncidente, EstadoIncidente, Ubicacion, Prioridad } from '../types';
import './Historial.css';

const Historial: React.FC = () => {
  const router = useIonRouter();
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [filtroFecha, setFiltroFecha] = useState('todos');

  useEffect(() => {
    const usuario = AuthService.obtenerUsuarioActual();
    if (!usuario) {
      router.push('/login', 'back', 'replace');
      return;
    }

    cargarEstadisticas();
  }, [router, filtroFecha]);

  const cargarEstadisticas = () => {
    let estadisticasData = StorageService.obtenerEstadisticas();

    // Aplicar filtro de fecha si es necesario
    if (filtroFecha !== 'todos') {
      const hoy = new Date();
      const fechaLimite = new Date();
      
      switch (filtroFecha) {
        case 'hoy':
          fechaLimite.setHours(0, 0, 0, 0);
          break;
        case 'semana':
          fechaLimite.setDate(hoy.getDate() - 7);
          break;
        case 'mes':
          fechaLimite.setMonth(hoy.getMonth() - 1);
          break;
      }

      const incidentes = StorageService.obtenerIncidentes().filter(incidente => {
        const fechaIncidente = new Date(incidente.fecha);
        return fechaIncidente >= fechaLimite;
      });

      // Recalcular estadísticas con incidentes filtrados
      estadisticasData = {
        totalIncidentes: incidentes.length,
        porTipo: {
          [TipoIncidente.EQUIPO_DANADO]: 0,
          [TipoIncidente.OBJETO_PERDIDO]: 0,
          [TipoIncidente.OLVIDO_LUCES]: 0,
          [TipoIncidente.OLVIDO_AIRES]: 0
        },
        porEstado: {
          [EstadoIncidente.PENDIENTE]: 0,
          [EstadoIncidente.EN_PROGRESO]: 0,
          [EstadoIncidente.RESUELTO]: 0
        },
        porUbicacion: {
          [Ubicacion.AULA]: 0,
          [Ubicacion.CUBICULO]: 0,
          [Ubicacion.LABORATORIO]: 0,
          [Ubicacion.AUDITORIO]: 0,
          [Ubicacion.DIRECCION]: 0,
          [Ubicacion.BANO]: 0,
          [Ubicacion.EXPLANADA]: 0
        },
        porPrioridad: {
          [Prioridad.BAJA]: 0,
          [Prioridad.MEDIA]: 0,
          [Prioridad.ALTA]: 0
        }
      };

      incidentes.forEach(incidente => {
        estadisticasData.porTipo[incidente.tipo]++;
        estadisticasData.porEstado[incidente.estado]++;
        estadisticasData.porUbicacion[incidente.ubicacion]++;
        estadisticasData.porPrioridad[incidente.prioridad]++;
      });
    }

    setEstadisticas(estadisticasData);
  };

  const handleDescargarBackup = () => {
    const backup = StorageService.crearBackup();
    const blob = new Blob([backup], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_incidentes_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

  if (!estadisticas) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Cargando...</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <p>Cargando estadísticas...</p>
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
          <IonTitle>Historial y Estadísticas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={statsChartOutline} />
              Resumen General
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel>Filtrar por Fecha</IonLabel>
              <IonSelect value={filtroFecha} onIonChange={(e) => setFiltroFecha(e.detail.value)}>
                <IonSelectOption value="todos">Todos</IonSelectOption>
                <IonSelectOption value="hoy">Hoy</IonSelectOption>
                <IonSelectOption value="semana">Última Semana</IonSelectOption>
                <IonSelectOption value="mes">Último Mes</IonSelectOption>
              </IonSelect>
            </IonItem>

            <div className="stat-card">
              <h2>{estadisticas.totalIncidentes}</h2>
              <p>Total de Incidentes</p>
            </div>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Por Tipo de Incidente</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              {Object.entries(estadisticas.porTipo).map(([tipo, cantidad]) => (
                <IonRow key={tipo}>
                  <IonCol>
                    <strong>{obtenerTextoTipo(tipo as TipoIncidente)}</strong>
                  </IonCol>
                  <IonCol size="auto">
                    <strong>{cantidad}</strong>
                  </IonCol>
                </IonRow>
              ))}
            </IonGrid>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Por Estado</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              {Object.entries(estadisticas.porEstado).map(([estado, cantidad]) => (
                <IonRow key={estado}>
                  <IonCol>
                    <strong>{estado}</strong>
                  </IonCol>
                  <IonCol size="auto">
                    <strong>{cantidad}</strong>
                  </IonCol>
                </IonRow>
              ))}
            </IonGrid>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Por Ubicación</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              {Object.entries(estadisticas.porUbicacion).map(([ubicacion, cantidad]) => (
                <IonRow key={ubicacion}>
                  <IonCol>
                    <strong>{ubicacion}</strong>
                  </IonCol>
                  <IonCol size="auto">
                    <strong>{cantidad}</strong>
                  </IonCol>
                </IonRow>
              ))}
            </IonGrid>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Por Prioridad</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              {Object.entries(estadisticas.porPrioridad).map(([prioridad, cantidad]) => (
                <IonRow key={prioridad}>
                  <IonCol>
                    <strong>{prioridad}</strong>
                  </IonCol>
                  <IonCol size="auto">
                    <strong>{cantidad}</strong>
                  </IonCol>
                </IonRow>
              ))}
            </IonGrid>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Copias de Seguridad</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonButton expand="block" onClick={handleDescargarBackup}>
              <IonIcon icon={downloadOutline} slot="start" />
              Descargar Backup
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Historial;

