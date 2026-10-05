import React, { useRef, useState } from 'react';
import { Redirect, Route, useHistory, useParams } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';
import { IonApp, IonBackButton, IonBadge, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonRouterOutlet, IonSpinner, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import { addOutline, arrowForwardOutline, calendarOutline, locationOutline, refreshOutline } from 'ionicons/icons';
import { createEvent, getEvent, listEvents } from './api.js';

const categories = ['Académico', 'Cultural', 'Deportivo'];
const formatDate = value => new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value}T12:00:00`));
const categoryClass = category => ({ Académico: 'academic', Cultural: 'culture', Deportivo: 'sports' })[category];

function Header({ back = false }) {
  return <IonHeader className="ion-no-border"><IonToolbar>
    {back && <IonButtons slot="start"><IonBackButton defaultHref="/eventos" text="Volver" /></IonButtons>}
    <IonTitle><span className="brand-mark">U</span> UniEventos<span className="brand-caption">COMUNIDAD UNIVERSITARIA</span></IonTitle>
    <IonButtons slot="end"><span className="campus-tag">Tu campus, conectado</span></IonButtons>
  </IonToolbar></IonHeader>;
}

function ErrorNotice({ message, retry }) {
  return <div className="error-notice" role="alert"><strong>No pudimos completar la solicitud</strong><p>{message}</p>{retry && <IonButton size="small" fill="outline" onClick={retry}>Reintentar</IonButton>}</div>;
}

function Loading() { return <div className="loading" role="status"><IonSpinner name="crescent" /><span>Cargando eventos…</span></div>; }

function EventForm({ onCreated }) {
  const initial = { titulo: '', descripcion: '', fecha: '', lugar: '', categoria: 'Académico' };
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fields, setFields] = useState({});
  const lock = useRef(false);
  const update = event => setForm(previous => ({ ...previous, [event.target.name]: event.target.value }));
  async function submit(event) {
    event.preventDefault();
    if (lock.current) return;
    lock.current = true;
    setSaving(true); setError(''); setFields({});
    try {
      const created = await createEvent(form);
      setForm(initial);
      onCreated(created);
    } catch (failure) { setError(failure.message); setFields(failure.fields || {}); }
    finally { setSaving(false); lock.current = false; }
  }
  function feedback(name) { return fields[name] && <small className="field-error" id={`${name}-error`}>{fields[name]}</small>; }
  function accessibility(name) { return { 'aria-invalid': Boolean(fields[name]), 'aria-describedby': fields[name] ? `${name}-error` : undefined }; }
  return <section className="form-panel" aria-labelledby="create-title">
    <div className="section-eyebrow">HAZ PARTE</div><h2 id="create-title">Publica un evento</h2><p className="muted">Las mejores experiencias empiezan con una invitación.</p>
    <form onSubmit={submit}>
      <fieldset disabled={saving}>
        <label htmlFor="titulo">Nombre del evento</label>
        <input id="titulo" name="titulo" value={form.titulo} onChange={update} required minLength={3} maxLength={100} placeholder="¿Qué está pasando en el campus?" {...accessibility('titulo')} />{feedback('titulo')}
        <div className="form-row"><div><label htmlFor="fecha">Fecha</label><input id="fecha" name="fecha" type="date" required value={form.fecha} onChange={update} {...accessibility('fecha')} />{feedback('fecha')}</div>
        <div><label htmlFor="categoria">Categoría</label><select id="categoria" name="categoria" value={form.categoria} onChange={update} {...accessibility('categoria')}>{categories.map(category => <option key={category}>{category}</option>)}</select>{feedback('categoria')}</div></div>
        <label htmlFor="lugar">Lugar</label><input id="lugar" name="lugar" value={form.lugar} onChange={update} required minLength={3} maxLength={120} placeholder="Ej. Auditorio principal" {...accessibility('lugar')} />{feedback('lugar')}
        <label htmlFor="descripcion">Descripción</label><textarea id="descripcion" name="descripcion" value={form.descripcion} onChange={update} required minLength={10} maxLength={1000} rows={4} placeholder="Cuéntanos de qué se trata y quiénes pueden asistir." {...accessibility('descripcion')} />{feedback('descripcion')}
        <p className="form-hint">Todos los campos son obligatorios.</p>
        {error && <ErrorNotice message={error} />}
        <IonButton type="submit" expand="block" disabled={saving}>{saving ? <><IonSpinner name="crescent" /> Guardando…</> : <><IonIcon icon={addOutline} slot="start" /> Publicar evento</>}</IonButton>
      </fieldset>
    </form>
  </section>;
}

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('Todos');
  const revision = useRef(0);
  async function load() {
    const current = ++revision.current;
    setLoading(true); setError('');
    try {
      const data = await listEvents();
      if (!Array.isArray(data)) throw new Error('La API no devolvió una lista de eventos.');
      if (current === revision.current) setEvents(data);
    } catch (failure) { if (current === revision.current) setError(failure.message); }
    finally { if (current === revision.current) setLoading(false); }
  }
  useIonViewWillEnter(() => { void load(); });
  function created(event) {
    ++revision.current; // Evita que un GET anterior sobrescriba el POST reciente.
    setLoading(false); setError('');
    setEvents(previous => [event, ...previous]); setFilter('Todos');
    setSuccess(`“${event.titulo}” se publicó correctamente.`);
  }
  const visible = events.filter(event => filter === 'Todos' || event.categoria === filter);
  return <IonPage><Header /><IonContent><main className="page-shell">
    <section className="hero"><div><div className="eyebrow">DESCUBRE · CONECTA · PARTICIPA</div><h1>Tu próxima experiencia<br /><em>empieza aquí.</em></h1><p>Un campus lleno de ideas, cultura y movimiento.<br />Encuentra tu próximo plan o comparte uno con todos.</p><a href="#create-title" className="hero-link">Comparte una experiencia <span aria-hidden="true">↗</span></a></div><div className="hero-art" aria-hidden="true"><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div><div className="ticket"><span>UNIEVENTOS</span><strong>Nos vemos<br />en el campus.</strong><div className="ticket-line"></div><span>IDEAS + PERSONAS + MOMENTOS</span></div><div className="spark">✳</div></div></section>
    <div className="workspace"><section className="events-section" aria-labelledby="events-title"><div className="section-heading"><div><div className="section-eyebrow">EXPLORA TU COMUNIDAD</div><h2 id="events-title">Agenda del campus <span className="count">{events.length}</span></h2></div><IonButton fill="clear" aria-label="Actualizar eventos" disabled={loading} onClick={load}><IonIcon icon={refreshOutline} slot="icon-only" /></IonButton></div>
      <div className="filters" aria-label="Filtrar por categoría">{['Todos', ...categories].map(category => <button key={category} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}</button>)}</div>
      {success && <div className="success-notice" role="status">{success}<button onClick={() => setSuccess('')} aria-label="Cerrar confirmación">×</button></div>}
      {error && <ErrorNotice message={error} retry={load} />}
      {loading ? <Loading /> : <><div className="event-list">{visible.map(event => <article key={event.id} className={`event-card ${categoryClass(event.categoria)}`}><div className="date-tile"><strong>{event.fecha.slice(8)}</strong><span>{new Intl.DateTimeFormat('es-CO', { month: 'short' }).format(new Date(`${event.fecha}T12:00:00`))}</span></div><div className="event-copy"><IonBadge className={categoryClass(event.categoria)}>{event.categoria}</IonBadge><h3>{event.titulo}</h3><p><IonIcon icon={locationOutline} /> {event.lugar}</p><IonButton fill="clear" size="small" routerLink={`/eventos/${event.id}`} aria-label={`Ver detalle de ${event.titulo}`}>Ver detalle <IonIcon icon={arrowForwardOutline} slot="end" /></IonButton></div></article>)}</div>{!visible.length && !error && <div className="empty"><IonIcon icon={calendarOutline} /><h3>Aún no hay eventos{filter === 'Todos' ? '' : ' en esta categoría'}</h3><p>Publica el primero y reúne a tu comunidad.</p></div>}</>}
    </section><EventForm onCreated={created} /></div><footer>UniEventos <span>Hecho para encontrarnos.</span></footer>
  </main></IonContent></IonPage>;
}

function DetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const history = useHistory();
  async function load() {
    setLoading(true); setError(''); setEvent(null);
    try { setEvent(await getEvent(id)); } catch (failure) { setError(failure.message); }
    finally { setLoading(false); }
  }
  useIonViewWillEnter(() => { void load(); }, [id]);
  return <IonPage><Header back /><IonContent><main className="detail-shell">
    <div className="section-eyebrow">AGENDA DEL CAMPUS / DETALLE DEL EVENTO</div>
    {loading ? <Loading /> : error ? <ErrorNotice message={error} retry={load} /> : event && <article className="detail-card"><IonBadge className={categoryClass(event.categoria)}>{event.categoria}</IonBadge><h1>{event.titulo}</h1><div className="detail-meta"><p><IonIcon icon={calendarOutline} /> {formatDate(event.fecha)}</p><p><IonIcon icon={locationOutline} /> {event.lugar}</p></div><hr /><h2>Acerca de este evento</h2><p className="description">{event.descripcion}</p><p className="muted">Comparte el enlace de esta página para invitar a tu comunidad.</p></article>}
    <IonButton fill="outline" onClick={() => history.replace('/eventos')}>Volver a eventos</IonButton>
  </main></IonContent></IonPage>;
}

function NotFoundPage() { return <IonPage><Header back /><IonContent><main className="detail-shell"><h1>Página no encontrada</h1><p>Esta dirección no corresponde a una pantalla de UniEventos.</p><IonButton routerLink="/eventos" routerDirection="root">Ir a eventos</IonButton></main></IonContent></IonPage>; }

export default function App() {
  return <IonApp><IonReactRouter><IonRouterOutlet><Route exact path="/eventos" component={EventsPage} /><Route exact path="/eventos/:id" component={DetailPage} /><Route exact path="/"><Redirect to="/eventos" /></Route><Route component={NotFoundPage} /></IonRouterOutlet></IonReactRouter></IonApp>;
}
