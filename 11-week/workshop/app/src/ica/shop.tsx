import { createContext, useContext, useState, type ReactNode } from 'react';
import { IonAlert, IonButton, IonContent, IonHeader, IonPage, IonToolbar, IonRefresher, IonRefresherContent } from '@ionic/react';
import { cop, type Helado } from './catalog';
import type { Pedido } from './pedidos';
export interface Linea { helado: Helado; tamano: string; topping: string; total: number }
const ShopContext = createContext<{ lineas: Linea[]; pedidos: Pedido[]; add: (linea: Linea) => void; quitar: (index: number) => void; confirmar: (pedido: Pedido, enviadas: Linea[]) => void }>({ lineas: [], pedidos: [], add: () => {}, quitar: () => {}, confirmar: () => {} });
export const useShop = () => useContext(ShopContext);
export function ShopProvider({ children }: { children: ReactNode }) {
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const confirmar = (pedido: Pedido, enviadas: Linea[]) => {
    setPedidos(old => old.some(item => item.id === pedido.id) ? old : [pedido, ...old]);
    setLineas(old => old.filter(linea => !enviadas.includes(linea)));
  };
  return <ShopContext.Provider value={{ lineas, pedidos, confirmar, quitar: index => setLineas(old => old.filter((_, i) => i !== index)), add: linea => setLineas(old => [...old, linea]) }}>{children}</ShopContext.Provider>;
}
export function Marco({ title, children, refresh }: { title: string; children: ReactNode; refresh?: () => Promise<void> }) {
  return <IonPage><IonHeader><IonToolbar><div className="ica-toolbar-title">ICA · {title}</div></IonToolbar></IonHeader>
    <IonContent>{refresh && <IonRefresher slot="fixed" onIonRefresh={event => { void refresh().finally(() => event.detail.complete()); }}>
      <IonRefresherContent pullingText="Desliza para actualizar sabores" refreshingText="Actualizando catálogo" /></IonRefresher>}
      <main className="ica-content"><p className="ica-note">{import.meta.env.VITE_ICA_API_URL ? 'Pedidos para recoger · pago en tienda' : 'Demo del taller · sin cobros ni envío de pedidos'}</p>{children}</main></IonContent></IonPage>;
}
export function Carrito() {
  const { lineas, quitar } = useShop();
  const [quitarIndice, setQuitarIndice] = useState<number | null>(null);
  return <Marco title="Carrito"><h1>Tu bolsa de felicidad</h1>
    {lineas.length === 0 ? <p>Tu próximo helado te espera.</p> : <>
      {lineas.map((linea, index) => <article className="ica-card" key={index}><h2>{linea.helado.name}</h2>
        <p>{linea.tamano} · {linea.topping}</p><p>{cop(linea.total)}</p>
        <IonButton fill="clear" aria-label={`Quitar ${linea.helado.name}`} onClick={() => setQuitarIndice(index)}>Quitar</IonButton></article>)}
      <p className="ica-price">Total: {cop(lineas.reduce((sum, linea) => sum + linea.total, 0))}</p>
      <IonButton routerLink="/tabs/carrito/confirmar">Continuar con el pedido</IonButton>
      <p className="ica-note">El carrito y los pedidos de este taller se conservan durante esta sesión.</p>
    </>}<IonButton routerLink="/tabs/helados">Explorar sabores</IonButton>
    <IonAlert isOpen={quitarIndice !== null} header="¿Quitar este helado?" message="Se eliminará del carrito. Puedes añadirlo de nuevo desde el catálogo."
      onDidDismiss={() => setQuitarIndice(null)} buttons={[{ text: 'Conservar', role: 'cancel' }, { text: 'Quitar helado', role: 'destructive', handler: () => { if (quitarIndice !== null) quitar(quitarIndice); } }]} />
  </Marco>;
}
export function Pedidos() {
  const { pedidos } = useShop();
  return <Marco title="Mis pedidos"><h1>Mis pedidos</h1>{pedidos.length === 0 && <p>Aún no hay pedidos en esta sesión.</p>}
    {pedidos.map(pedido => <article className="ica-card" key={pedido.id}><h2>Pedido de {pedido.nombre}</h2>
      <p>{pedido.estado} · {new Date(pedido.fecha).toLocaleString('es-CO')}</p>
      {pedido.lineas.map((linea, index) => <p key={index}>{linea.helado.name} · {linea.tamano} · {linea.topping} · {cop(linea.total)}</p>)}
      <p className="ica-price">Total: {cop(pedido.total)}</p>{pedido.nota && <p>Nota: {pedido.nota}</p>}</article>)}
    <p className="ica-note">Historial de esta sesión; no importa los pedidos guardados en Flutter.</p>
    <IonButton routerLink="/tabs/helados">Elegir un helado</IonButton></Marco>;
}
