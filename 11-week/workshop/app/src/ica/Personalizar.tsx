import { useEffect, useState } from 'react';
import { IonButton, IonSkeletonText, IonToast } from '@ionic/react';
import { useParams } from 'react-router-dom';
import { cargarHelados, cop, tamanos, toppings, type Helado } from './catalog';
import { Marco, useShop } from './shop';
export default function Personalizar() {
  const { id } = useParams<{ id: string }>();
  const [helado, setHelado] = useState<Helado>();
  const [estado, setEstado] = useState('cargando');
  const [intento, setIntento] = useState(0);
  useEffect(() => {
    let vigente = true;
    setEstado('cargando');
    setHelado(undefined);
    if (!/^[1-9]\d*$/.test(id)) { setEstado('listo'); return; }
    void cargarHelados().then(lista => {
      if (vigente) { setHelado(lista.find(item => item.id === Number(id))); setEstado('listo'); }
    }).catch(() => { if (vigente) setEstado('error'); });
    return () => { vigente = false; };
  }, [id, intento]);
  const [tamano, setTamano] = useState<keyof typeof tamanos>('Una bola');
  const [topping, setTopping] = useState<keyof typeof toppings>('Sin topping');
  const [confirmado, setConfirmado] = useState(false);
  useEffect(() => {
    setTamano('Una bola'); setTopping('Sin topping'); setConfirmado(false);
  }, [id]);
  const { add } = useShop();
  const volver = <IonButton fill="clear" routerLink="/tabs/helados" routerDirection="back">Volver al catálogo</IonButton>;
  if (estado === 'cargando') return <Marco title="Personalizar">{volver}<p role="status">Cargando helado…</p>
    <div aria-hidden="true"><IonSkeletonText animated style={{ height: '2rem', width: '70%' }} />
      <IonSkeletonText animated style={{ height: '5rem' }} />
      <IonSkeletonText animated style={{ height: '12rem' }} /></div></Marco>;
  if (estado === 'error') return <Marco title="Personalizar"><p role="alert">No pudimos cargar este helado.</p>
    <IonButton onClick={() => setIntento(old => old + 1)}>Reintentar</IonButton>
    {volver}</Marco>;
  if (!helado) return <Marco title="Personalizar"><h1>Helado no encontrado</h1>
    <p>Este sabor no está disponible. Puedes elegir otro desde el catálogo.</p>{volver}</Marco>;
  const total = helado.price + tamanos[tamano] + toppings[topping];
  return <Marco title="Personalizar">{volver}
    <h1>{helado.name}</h1><p>{helado.description}</p>
    <p>{helado.category} · Desde {cop(helado.price)}</p>
    <div className="ica-form">
      <fieldset className="ica-options"><legend>Tamaño</legend>
        {Object.entries(tamanos).map(([name, extra]) => <label key={name}>
          <input type="radio" name="tamano" value={name} checked={tamano === name} onChange={() => setTamano(name as keyof typeof tamanos)} />
          <span>{name} · {cop(helado.price + extra)}</span></label>)}
      </fieldset>
      <fieldset className="ica-options"><legend>Topping</legend>
        {Object.entries(toppings).map(([name, extra]) => <label key={name}>
          <input type="radio" name="topping" value={name} checked={topping === name} onChange={() => setTopping(name as keyof typeof toppings)} />
          <span>{name}{extra > 0 ? ` · +${cop(extra)}` : ''}</span></label>)}
      </fieldset>
      <p className="ica-price" role="status" aria-live="polite">Total: {cop(total)}</p>
      <IonButton onClick={() => { add({ helado, tamano, topping, total }); setConfirmado(true); }}>Añadir al carrito</IonButton>
      <IonButton fill="outline" routerLink="/tabs/carrito">Ver carrito</IonButton>
    </div><p className="ica-note">Consulta al personal sobre alérgenos y contaminación cruzada.</p>
    <IonToast isOpen={confirmado} message={`${helado.name} añadido al carrito`} duration={2500} onDidDismiss={() => setConfirmado(false)} />
  </Marco>;
}
