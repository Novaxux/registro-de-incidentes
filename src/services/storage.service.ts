import { Incidente, Usuario, Estadisticas, TipoIncidente, EstadoIncidente, Ubicacion, Prioridad } from '../types';

const INCIDENTES_KEY = 'incidentes';
const USUARIO_KEY = 'usuario_actual';
const BACKUP_KEY = 'backup_incidentes';

export class StorageService {
  // Incidentes
  static async guardarIncidente(incidente: Incidente): Promise<void> {
    const incidentes = this.obtenerIncidentes();
    const index = incidentes.findIndex(i => i.id === incidente.id);
    
    if (index >= 0) {
      incidentes[index] = { ...incidente, fechaActualizacion: new Date().toISOString() };
    } else {
      incidentes.push(incidente);
    }
    
    localStorage.setItem(INCIDENTES_KEY, JSON.stringify(incidentes));
  }

  static obtenerIncidentes(): Incidente[] {
    const data = localStorage.getItem(INCIDENTES_KEY);
    return data ? JSON.parse(data) : [];
  }

  static obtenerIncidentePorId(id: string): Incidente | null {
    const incidentes = this.obtenerIncidentes();
    return incidentes.find(i => i.id === id) || null;
  }

  static eliminarIncidente(id: string): void {
    const incidentes = this.obtenerIncidentes();
    const filtrados = incidentes.filter(i => i.id !== id);
    localStorage.setItem(INCIDENTES_KEY, JSON.stringify(filtrados));
  }

  static filtrarIncidentes(filtros: {
    tipo?: TipoIncidente;
    estado?: EstadoIncidente;
    ubicacion?: Ubicacion;
    prioridad?: Prioridad;
    fechaDesde?: string;
    fechaHasta?: string;
  }): Incidente[] {
    let incidentes = this.obtenerIncidentes();

    if (filtros.tipo) {
      incidentes = incidentes.filter(i => i.tipo === filtros.tipo);
    }
    if (filtros.estado) {
      incidentes = incidentes.filter(i => i.estado === filtros.estado);
    }
    if (filtros.ubicacion) {
      incidentes = incidentes.filter(i => i.ubicacion === filtros.ubicacion);
    }
    if (filtros.prioridad) {
      incidentes = incidentes.filter(i => i.prioridad === filtros.prioridad);
    }
    if (filtros.fechaDesde) {
      incidentes = incidentes.filter(i => i.fecha >= filtros.fechaDesde!);
    }
    if (filtros.fechaHasta) {
      incidentes = incidentes.filter(i => i.fecha <= filtros.fechaHasta!);
    }

    return incidentes.sort((a, b) => 
      new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
    );
  }

  // Usuario
  static guardarUsuario(usuario: Usuario): void {
    localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
  }

  static obtenerUsuarioActual(): Usuario | null {
    const data = localStorage.getItem(USUARIO_KEY);
    return data ? JSON.parse(data) : null;
  }

  static eliminarUsuario(): void {
    localStorage.removeItem(USUARIO_KEY);
  }

  // Estadísticas
  static obtenerEstadisticas(): Estadisticas {
    const incidentes = this.obtenerIncidentes();
    
    const estadisticas: Estadisticas = {
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
      estadisticas.porTipo[incidente.tipo]++;
      estadisticas.porEstado[incidente.estado]++;
      estadisticas.porUbicacion[incidente.ubicacion]++;
      estadisticas.porPrioridad[incidente.prioridad]++;
    });

    return estadisticas;
  }

  // Backup
  static crearBackup(): string {
    const incidentes = this.obtenerIncidentes();
    const backup = {
      fecha: new Date().toISOString(),
      incidentes
    };
    localStorage.setItem(BACKUP_KEY, JSON.stringify(backup));
    return JSON.stringify(backup);
  }

  static restaurarBackup(backupData: string): void {
    try {
      const backup = JSON.parse(backupData);
      if (backup.incidentes && Array.isArray(backup.incidentes)) {
        localStorage.setItem(INCIDENTES_KEY, JSON.stringify(backup.incidentes));
      }
    } catch (error) {
      console.error('Error al restaurar backup:', error);
      throw new Error('Formato de backup inválido');
    }
  }
}

