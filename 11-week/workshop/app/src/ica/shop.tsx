import { createContext, useContext, useState, type ReactNode } from 'react';
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRefresher, IonRefresherContent } from '@ionic/react';
import { cop, type Helado } from './catalog';
export interface Linea { helado: Helado; tamano: string; topping: string; total: number }
const ShopContext = createContext<{ lineas: Linea[]; add: (linea: Linea) => void }>({ lineas: [], add: () => {} });
export const useShop = () => useContext(ShopContext);
export function ShopProvider({ children }: { children: ReactNode }) {
  const [lineas, setLineas] = useState<Linea[]>([]);
  return <ShopContext.Provider value={{ lineas, add: linea => setLineas(old => [...old, linea]) }}>{children}</ShopContext.Provider>;
}
export function Marco({ title, children, refresh }: { title: string; children: ReactNode; refresh?: () => Promise<void> }) {
  return <IonPage><IonHeader><IonToolbar><IonTitle>ICA · {title}</IonTitle></IonToolbar></IonHeader>
    <IonContent>{refresh && <IonRefresher slot="fixed" onIonRefresh={event => { void refresh().finally(() => event.detail.complete()); }}>
      <IonRefresherContent pullingText="Desliza para actualizar sabores" refreshingText="Actualizando catálogo" /></IonRefresher>}
      <main className="ica-content"><p className="ica-note">Demo del taller · sin cobros ni envío de pedidos</p>{children}</main></IonContent></IonPage>;
}
export function Carrito() {
  const { lineas } = useShop();
  return <Marco title="Carrito"><h1>Tu bolsa de felicidad</h1>
    {lineas.length === 0 ? <p>Tu próximo helado te espera.</p> : <>
      {lineas.map((linea, index) => <article className="ica-card" key={index}><h2>{linea.helado.name}</h2>
        <p>{linea.tamano} · {linea.topping}</p><p>{cop(linea.total)}</p></article>)}
      <p className="ica-price">Total: {cop(lineas.reduce((sum, linea) => sum + linea.total, 0))}</p>
      <p>El carrito se conserva durante esta sesión. El envío de pedidos queda fuera de esta entrega.</p>
    </>}<IonButton routerLink="/tabs/helados">Explorar sabores</IonButton></Marco>;
}
export function Pedidos() {
  return <Marco title="Mis pedidos"><h1>Mis pedidos</h1><p>Aún no hay pedidos en este prototipo.</p>
    <p>Esta adaptación no importa el historial guardado en el dispositivo de la app Flutter.</p>
    <IonButton routerLink="/tabs/helados">Elegir un helado</IonButton></Marco>;
}
