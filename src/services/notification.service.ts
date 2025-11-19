import { Incidente, EstadoIncidente } from '../types';
import { StorageService } from './storage.service';

export class NotificationService {
  static async enviarNotificacion(titulo: string, mensaje: string, incidenteId?: string): Promise<void> {
    // En producción, usarías @capacitor/local-notifications
    console.log('Notificación:', titulo, mensaje);
    
    // Guardar notificación en localStorage para mostrarla en la UI
    const notificaciones = this.obtenerNotificaciones();
    notificaciones.unshift({
      id: Date.now().toString(),
      titulo,
      mensaje,
      incidenteId,
      fecha: new Date().toISOString(),
      leida: false
    });
    
    localStorage.setItem('notificaciones', JSON.stringify(notificaciones.slice(0, 50))); // Máximo 50
  }

  static async notificarCambioEstado(incidente: Incidente, nuevoEstado: EstadoIncidente): Promise<void> {
    const usuario = StorageService.obtenerUsuarioActual();
    if (!usuario || !usuario.notificacionesHabilitadas) return;

    const estadoTexto = {
      [EstadoIncidente.PENDIENTE]: 'pendiente',
      [EstadoIncidente.EN_PROGRESO]: 'en progreso',
      [EstadoIncidente.RESUELTO]: 'resuelto'
    }[nuevoEstado];

    await this.enviarNotificacion(
      'Actualización de Incidente',
      `Tu incidente "${this.obtenerTipoTexto(incidente.tipo)}" ahora está ${estadoTexto}`,
      incidente.id
    );
  }

  static obtenerNotificaciones(): Array<{
    id: string;
    titulo: string;
    mensaje: string;
    incidenteId?: string;
    fecha: string;
    leida: boolean;
  }> {
    const data = localStorage.getItem('notificaciones');
    return data ? JSON.parse(data) : [];
  }

  static marcarComoLeida(id: string): void {
    const notificaciones = this.obtenerNotificaciones();
    const notificacion = notificaciones.find(n => n.id === id);
    if (notificacion) {
      notificacion.leida = true;
      localStorage.setItem('notificaciones', JSON.stringify(notificaciones));
    }
  }

  static obtenerNotificacionesNoLeidas(): number {
    return this.obtenerNotificaciones().filter(n => !n.leida).length;
  }

  private static obtenerTipoTexto(tipo: string): string {
    const tipos: Record<string, string> = {
      'equipo_danado': 'Equipo Dañado',
      'objeto_perdido': 'Objeto Perdido',
      'olvido_luces': 'Olvido de Luces',
      'olvido_aires': 'Olvido de Aires'
    };
    return tipos[tipo] || tipo;
  }
}

