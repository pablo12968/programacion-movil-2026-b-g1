import { useEffect, useState } from 'react';
import { IonButton } from '@ionic/react';
import { cargarHelados, cop, type Helado } from './catalog';
import { Marco } from './shop';
export default function Catalogo() {
  const [helados, setHelados] = useState<Helado[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todos');
  useEffect(() => { void cargarHelados().then(setHelados); }, []);
  const visibles = helados.filter(helado => (categoria === 'Todos' || helado.category === categoria)
    && helado.name.toLocaleLowerCase('es').includes(busqueda.trim().toLocaleLowerCase('es')));
  return <Marco title="Helados"><h1>Elige tu próximo helado</h1><p>Sabores artesanales, a tu manera.</p>
    <label>Buscar por sabor<input className="ica-search" value={busqueda} onChange={event => setBusqueda(event.target.value)} placeholder="Por ejemplo, fresa" /></label>
    <div className="ica-actions">{['Todos', 'Clásicos', 'Frutales', 'Especiales'].map(nombre =>
      <IonButton key={nombre} fill={categoria === nombre ? 'solid' : 'outline'} onClick={() => setCategoria(nombre)}>{nombre}</IonButton>)}</div>
    <p>{visibles.length} sabores disponibles</p><div className="ica-grid">
      {visibles.map(helado => <article className="ica-card" key={helado.id}>
        <p className="ica-note">{helado.category}</p><h2>{helado.name}</h2><p>{helado.description}</p>
        <p className="ica-price">Desde {cop(helado.price)}</p>
        <IonButton routerLink={`/tabs/helados/${helado.id}`}>Personalizar</IonButton>
      </article>)}
    </div><p className="ica-note">Recogida en tienda. Consulta al personal sobre alérgenos.</p></Marco>;
}
