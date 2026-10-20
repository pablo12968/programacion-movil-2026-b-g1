import { useState } from 'react';
import { IonButton, IonToast } from '@ionic/react';
import { useParams } from 'react-router-dom';
import { cop, sabores, tamanos, toppings } from './catalog';
import { Marco, useShop } from './shop';
export default function Personalizar() {
  const { id } = useParams<{ id: string }>();
  const helado = sabores.find(sabor => sabor.id === Number(id));
  const [tamano, setTamano] = useState<keyof typeof tamanos>('Una bola');
  const [topping, setTopping] = useState<keyof typeof toppings>('Sin topping');
  const [confirmado, setConfirmado] = useState(false);
  const { add } = useShop();
  if (!helado) return <Marco title="Personalizar"><h1>Helado no encontrado</h1>
    <IonButton routerLink="/tabs/helados">Volver al catálogo</IonButton></Marco>;
  const total = helado.price + tamanos[tamano] + toppings[topping];
  return <Marco title="Personalizar"><IonButton fill="clear" routerLink="/tabs/helados" routerDirection="back">Volver al catálogo</IonButton>
    <h1>{helado.name}</h1><p>{helado.description}</p>
    <div className="ica-form">
      <label>Tamaño<select value={tamano} onChange={event => setTamano(event.target.value as keyof typeof tamanos)}>
        {Object.entries(tamanos).map(([name, extra]) => <option key={name} value={name}>{name} · {cop(helado.price + extra)}</option>)}
      </select></label>
      <label>Topping<select value={topping} onChange={event => setTopping(event.target.value as keyof typeof toppings)}>
        {Object.entries(toppings).map(([name, extra]) => <option key={name} value={name}>{name} · +{cop(extra)}</option>)}
      </select></label>
      <p className="ica-price">Total: {cop(total)}</p>
      <IonButton onClick={() => { add({ helado, tamano, topping, total }); setConfirmado(true); }}>Añadir al carrito</IonButton>
      <IonButton fill="outline" routerLink="/tabs/carrito">Ver carrito</IonButton>
    </div><p className="ica-note">Consulta al personal sobre alérgenos y contaminación cruzada.</p>
    <IonToast isOpen={confirmado} message={`${helado.name} añadido al carrito`} duration={2500} onDidDismiss={() => setConfirmado(false)} />
  </Marco>;
}
