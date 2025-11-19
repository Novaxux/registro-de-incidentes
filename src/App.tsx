import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

console.log('App.tsx: Importando componentes...');

import Login from './pages/Login';
console.log('App.tsx: Login importado');

import Home from './pages/Home';
console.log('App.tsx: Home importado');

import RegistrarIncidente from './pages/RegistrarIncidente';
console.log('App.tsx: RegistrarIncidente importado');

import ListaIncidentes from './pages/ListaIncidentes';
console.log('App.tsx: ListaIncidentes importado');

import DetalleIncidente from './pages/DetalleIncidente';
console.log('App.tsx: DetalleIncidente importado');

import Historial from './pages/Historial';
console.log('App.tsx: Historial importado');

import Configuracion from './pages/Configuracion';
console.log('App.tsx: Configuracion importado');

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

console.log('App.tsx: Configurando App...');

const App: React.FC = () => {
  console.log('App.tsx: Renderizando App component...');
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/registrar-incidente">
            <RegistrarIncidente />
          </Route>
          <Route exact path="/lista-incidentes">
            <ListaIncidentes />
          </Route>
          <Route exact path="/detalle-incidente/:id">
            <DetalleIncidente />
          </Route>
          <Route exact path="/historial">
            <Historial />
          </Route>
          <Route exact path="/configuracion">
            <Configuracion />
          </Route>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
