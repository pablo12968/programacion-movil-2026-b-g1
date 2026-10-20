import { useCallback, useEffect, useRef, useState } from 'react';
import { IonButton, IonSkeletonText } from '@ionic/react';
import { cargarHelados, cop, type Helado } from './catalog';
import { Marco } from './shop';
export default function Catalogo({ cargar = cargarHelados }: { cargar?: typeof cargarHelados }) {
  const [helados, setHelados] = useState<Helado[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todos');
  const [estado, setEstado] = useState<'cargando' | 'datos' | 'error'>('cargando');
  const pendiente = useRef(false);
  const recargar = useCallback(async () => {
    if (pendiente.current) return;
    pendiente.current = true;
    setEstado('cargando');
    try { setHelados(await cargar()); setEstado('datos'); }
    catch { setEstado('error'); }
    finally { pendiente.current = false; }
  }, [cargar]);
  useEffect(() => { void recargar(); }, [recargar]);
  const visibles = helados.filter(helado => (categoria === 'Todos' || helado.category === categoria)
    && helado.name.toLocaleLowerCase('es').includes(busqueda.trim().toLocaleLowerCase('es')));
  return <Marco title="Helados" refresh={recargar}><h1>Elige tu próximo helado</h1><p>Sabores artesanales, a tu manera.</p>
    {estado === 'cargando' && <section aria-label="Cargando sabores" aria-busy="true">
      <p role="status">Cargando sabores…</p><div className="ica-grid">{[1, 2, 3, 4].map(id =>
        <div className="ica-card" key={id} aria-hidden="true"><IonSkeletonText animated style={{height:'1rem',width:'50%'}} />
          <IonSkeletonText animated style={{height:'2rem'}} /><IonSkeletonText animated style={{height:'3rem'}} />
          <IonSkeletonText animated style={{height:'1rem',width:'70%'}} /></div>)}</div></section>}
    {estado === 'error' && <section role="alert"><h2>No pudimos cargar los helados</h2>
      <p>Comprueba tu conexión y vuelve a intentarlo. Tu carrito se conserva.</p>
      <IonButton onClick={() => void recargar()}>Reintentar</IonButton></section>}
    {estado === 'datos' && helados.length === 0 && <section><h2>Aún no hay sabores disponibles</h2>
      <p>La tienda no tiene helados publicados en este momento.</p><IonButton onClick={() => void recargar()}>Actualizar catálogo</IonButton></section>}
    {estado === 'datos' && helados.length > 0 && <>
    <label>Buscar por sabor<input className="ica-search" value={busqueda} onChange={event => setBusqueda(event.target.value)} placeholder="Por ejemplo, fresa" /></label>
    <div className="ica-actions">{['Todos', 'Clásicos', 'Frutales', 'Especiales'].map(nombre =>
      <IonButton key={nombre} aria-pressed={categoria === nombre} fill={categoria === nombre ? 'solid' : 'outline'} onClick={() => setCategoria(nombre)}>{nombre}</IonButton>)}</div>
    <p role="status" aria-live="polite">{visibles.length} sabores disponibles</p>
    {visibles.length === 0 && <section><h2>No encontramos ese sabor</h2><p>Prueba otra categoría o borra la búsqueda.</p>
      <IonButton onClick={() => { setBusqueda(''); setCategoria('Todos'); }}>Restablecer búsqueda</IonButton></section>}
    <div className="ica-grid">
      {visibles.map(helado => <article className="ica-card" key={helado.id}>
        <p className="ica-note">{helado.category}</p><h2>{helado.name}</h2><p>{helado.description}</p>
        <p className="ica-price">Desde {cop(helado.price)}</p>
        <IonButton aria-label={`Personalizar ${helado.name}`} routerLink={`/tabs/helados/${helado.id}`}>Personalizar</IonButton>
      </article>)}
    </div></>}<p className="ica-note">Recogida en tienda. Consulta al personal sobre alérgenos.</p></Marco>;
}
