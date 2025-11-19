import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonText, IonIcon, useIonRouter } from '@ionic/react';
import { logInOutline, personAddOutline, lockClosedOutline, mailOutline } from 'ionicons/icons';
import { AuthService } from '../services/auth.service';
import './Login.css';

const Login: React.FC = () => {
  console.log('Login.tsx: Componente Login renderizando...');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [esRegistro, setEsRegistro] = useState(false);
  const [error, setError] = useState('');
  const router = useIonRouter();
  console.log('Login.tsx: Estados inicializados, renderizando JSX...');

  const handleLogin = async () => {
    try {
      setError('');
      const usuario = await AuthService.login(email, password);
      if (usuario) {
        router.push('/home', 'forward', 'push');
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    }
  };

  const handleRegistro = async () => {
    try {
      setError('');
      if (!nombre || !email || !password) {
        setError('Por favor completa todos los campos');
        return;
      }
      await AuthService.registro(nombre, email, password);
      router.push('/home', 'forward', 'push');
    } catch (err: any) {
      setError(err.message || 'Error al registrar usuario');
    }
  };

  const handleBiometrico = async () => {
    try {
      setError('');
      const usuario = await AuthService.loginBiometrico();
      if (usuario) {
        router.push('/home', 'forward', 'push');
      } else {
        setError('No se pudo autenticar con biometría');
      }
    } catch (err) {
      setError('Error en autenticación biométrica');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Registro de Incidentes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <div className="login-container">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                {esRegistro ? 'Crear Cuenta' : 'Iniciar Sesión'}
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {esRegistro && (
                <IonItem>
                  <IonLabel position="stacked">Nombre</IonLabel>
                  <IonInput
                    type="text"
                    value={nombre}
                    placeholder="Ingresa tu nombre"
                    onIonInput={(e) => setNombre(e.detail.value!)}
                  />
                </IonItem>
              )}

              <IonItem>
                <IonIcon icon={mailOutline} slot="start" />
                <IonLabel position="stacked">Email</IonLabel>
                <IonInput
                  type="email"
                  value={email}
                  placeholder="correo@ejemplo.com"
                  onIonInput={(e) => setEmail(e.detail.value!)}
                />
              </IonItem>

              <IonItem>
                <IonIcon icon={lockClosedOutline} slot="start" />
                <IonLabel position="stacked">Contraseña</IonLabel>
                <IonInput
                  type="password"
                  value={password}
                  placeholder="Ingresa tu contraseña"
                  onIonInput={(e) => setPassword(e.detail.value!)}
                />
              </IonItem>

              {error && (
                <IonText color="danger">
                  <p className="error-message">{error}</p>
                </IonText>
              )}

              <IonButton
                expand="block"
                onClick={esRegistro ? handleRegistro : handleLogin}
                className="ion-margin-top"
              >
                <IonIcon icon={logInOutline} slot="start" />
                {esRegistro ? 'Registrarse' : 'Iniciar Sesión'}
              </IonButton>

              <IonButton
                expand="block"
                fill="outline"
                onClick={() => setEsRegistro(!esRegistro)}
                className="ion-margin-top"
              >
                <IonIcon icon={personAddOutline} slot="start" />
                {esRegistro ? 'Ya tengo cuenta' : 'Crear cuenta'}
              </IonButton>

              {!esRegistro && (
                <IonButton
                  expand="block"
                  fill="clear"
                  onClick={handleBiometrico}
                  className="ion-margin-top"
                >
                  Iniciar con Biometría
                </IonButton>
              )}
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;

