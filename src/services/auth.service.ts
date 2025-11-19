import { StorageService } from './storage.service';
import { Usuario } from '../types';

export class AuthService {
  static async login(email: string, password: string): Promise<Usuario | null> {
    // En una app real, esto haría una llamada al servidor
    // Por ahora, simulamos autenticación local
    const usuarios = this.obtenerUsuarios();
    const usuario = usuarios.find(u => u.email === email && u.password === password);
    
    if (usuario) {
      const { password: _, ...usuarioSinPassword } = usuario;
      StorageService.guardarUsuario(usuarioSinPassword as Usuario);
      return usuarioSinPassword as Usuario;
    }
    
    return null;
  }

  static async registro(nombre: string, email: string, password: string): Promise<Usuario> {
    const usuarios = this.obtenerUsuarios();
    
    if (usuarios.find(u => u.email === email)) {
      throw new Error('El email ya está registrado');
    }

    const nuevoUsuario: Usuario = {
      id: Date.now().toString(),
      nombre,
      email,
      password, // En producción, esto debería estar hasheado
      notificacionesHabilitadas: true,
      biometriaHabilitada: false
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    const { password: _, ...usuarioSinPassword } = nuevoUsuario;
    StorageService.guardarUsuario(usuarioSinPassword as Usuario);
    
    return usuarioSinPassword as Usuario;
  }

  static logout(): void {
    StorageService.eliminarUsuario();
  }

  static obtenerUsuarioActual(): Usuario | null {
    return StorageService.obtenerUsuarioActual();
  }

  static estaAutenticado(): boolean {
    return this.obtenerUsuarioActual() !== null;
  }

  private static obtenerUsuarios(): (Usuario & { password: string })[] {
    const data = localStorage.getItem('usuarios');
    return data ? JSON.parse(data) : [];
  }

  static async loginBiometrico(): Promise<Usuario | null> {
    // Simulación de autenticación biométrica
    // En producción, usarías @capacitor/biometric
    const usuario = this.obtenerUsuarioActual();
    return usuario;
  }
}

