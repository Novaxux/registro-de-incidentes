export enum TipoIncidente {
  EQUIPO_DANADO = 'equipo_danado',
  OBJETO_PERDIDO = 'objeto_perdido',
  OLVIDO_LUCES = 'olvido_luces',
  OLVIDO_AIRES = 'olvido_aires'
}

export enum Prioridad {
  BAJA = 'baja',
  MEDIA = 'media',
  ALTA = 'alta'
}

export enum EstadoIncidente {
  PENDIENTE = 'pendiente',
  EN_PROGRESO = 'en_progreso',
  RESUELTO = 'resuelto'
}

export enum Ubicacion {
  AULA = 'aula',
  CUBICULO = 'cubiculo',
  LABORATORIO = 'laboratorio',
  AUDITORIO = 'auditorio',
  DIRECCION = 'direccion',
  BANO = 'bano',
  EXPLANADA = 'explanada'
}

export interface Incidente {
  id: string;
  tipo: TipoIncidente;
  descripcion: string;
  ubicacion: Ubicacion;
  fecha: string;
  hora: string;
  prioridad: Prioridad;
  estado: EstadoIncidente;
  fotos?: string[]; // URLs base64 o rutas de archivos
  usuarioId: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  notas?: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  password: string; // Solo para autenticación local
  notificacionesHabilitadas: boolean;
  biometriaHabilitada: boolean;
}

export interface Estadisticas {
  totalIncidentes: number;
  porTipo: Record<TipoIncidente, number>;
  porEstado: Record<EstadoIncidente, number>;
  porUbicacion: Record<Ubicacion, number>;
  porPrioridad: Record<Prioridad, number>;
}

