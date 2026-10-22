import { IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

import { iceCreamOutline, bagOutline, receiptOutline } from 'ionicons/icons';
import Catalogo from '../ica/Catalogo';
import Personalizar from '../ica/Personalizar';
import FormularioPedido from '../ica/FormularioPedido';
import { Carrito, Pedidos, ShopProvider } from '../ica/shop';

/* CSS base de Ionic (obligatorio) */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Tema de la aplicación */
import './theme/ica.css';

const App: React.FC = () => (
  <IonApp><ShopProvider><IonReactRouter><IonTabs>
    <IonRouterOutlet>
      <Route exact path="/tabs/helados" component={Catalogo} />
      <Route exact path="/tabs/helados/:id" component={Personalizar} />
      <Route exact path="/tabs/carrito" component={Carrito} />
      <Route exact path="/tabs/carrito/confirmar" component={FormularioPedido} />
      <Route exact path="/tabs/pedidos" component={Pedidos} />
      <Route exact path="/"><Redirect to="/tabs/helados" /></Route>
    </IonRouterOutlet>
    <IonTabBar slot="bottom">
      <IonTabButton tab="helados" href="/tabs/helados" aria-label="Helados"><IonIcon icon={iceCreamOutline} aria-hidden="true" /><IonLabel>Helados</IonLabel></IonTabButton>
      <IonTabButton tab="carrito" href="/tabs/carrito" aria-label="Carrito"><IonIcon icon={bagOutline} aria-hidden="true" /><IonLabel>Carrito</IonLabel></IonTabButton>
      <IonTabButton tab="pedidos" href="/tabs/pedidos" aria-label="Mis pedidos"><IonIcon icon={receiptOutline} aria-hidden="true" /><IonLabel>Mis pedidos</IonLabel></IonTabButton>
    </IonTabBar>
  </IonTabs></IonReactRouter></ShopProvider></IonApp>
);

export default App;
