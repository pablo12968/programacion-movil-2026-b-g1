import {
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonIcon,
  IonLabel
} from "@ionic/react";
import { Route, Redirect } from "react-router-dom";
import { calendarOutline, addCircleOutline } from "ionicons/icons";
import Home from "./pages/Home";
import Detail from "./pages/Detail";

const App: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/home">
          <Home />
        </Route>

        <Route exact path="/detail/:id">
          <Detail />
        </Route>

        <Route exact path="/create">
          <Home />
        </Route>

        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/home">
          <IonIcon icon={calendarOutline} />
          <IonLabel>Eventos</IonLabel>
        </IonTabButton>

        <IonTabButton tab="create" href="/create">
          <IonIcon icon={addCircleOutline} />
          <IonLabel>Crear</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default App;
