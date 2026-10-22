import { useEffect, useRef, useState } from 'react';
import { IonAlert, IonButton, IonSpinner, IonToast } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { erroresPedido, enviarPedido, type DatosPedido } from './pedidos';
import { cop } from './catalog';
import { Marco, useShop } from './shop';

const vacio: DatosPedido = { nombre: '', nota: '' };
export default function FormularioPedido() {
  const { lineas, confirmar } = useShop();
  const history = useHistory();
  const [datos, setDatos] = useState(vacio);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const [cancelar, setCancelar] = useState(false);
  useEffect(() => { if (lineas.length) setExito(false); }, [lineas]);
  const referencia = useRef({ cuerpo: '', clave: '' });
  const ocupado = useRef(false);
  const errores = erroresPedido(datos);
  const invalido = !!(errores.nombre || errores.nota || !lineas.length || lineas.length > 50);
  const enviar = async () => {
    if (invalido || ocupado.current || exito) return;
    ocupado.current = true;
    setEnviando(true);
    setError('');
    const cuerpo = JSON.stringify({ nombre: datos.nombre.trim(), nota: datos.nota.trim(), lineas });
    if (referencia.current.cuerpo !== cuerpo) referencia.current = { cuerpo, clave: crypto.randomUUID() };
    try {
      const pedido = await enviarPedido(datos, lineas, referencia.current.clave);
      confirmar(pedido, lineas);
      setExito(true);
      setDatos(vacio);
    } catch (fallo) {
      setError(fallo instanceof Error && fallo.name === 'Error' ? fallo.message : 'No se confirmó el pedido. Comprueba la conexión y vuelve a intentarlo.');
    } finally { ocupado.current = false; setEnviando(false); }
  };
  const descartar = () => {
    setDatos(vacio); setError(''); referencia.current = { cuerpo: '', clave: '' };
    history.replace('/tabs/carrito');
  };
  const seguir = () => { setExito(false); history.replace('/tabs/pedidos'); };
  return <Marco title="Confirmar pedido"><h1>Tu pedido para recoger</h1>
    {exito ? <section role="status"><h2>Pedido registrado</h2><p>Consulta los sabores y el total en Mis pedidos.</p>
      <IonButton onClick={seguir}>Ver mis pedidos</IonButton></section> : !lineas.length ? <>
      <p>Primero añade un helado al carrito.</p><IonButton routerLink="/tabs/helados">Explorar sabores</IonButton></> :
      <form className="ica-form" noValidate onSubmit={event => { event.preventDefault(); void enviar(); }} aria-busy={enviando}>
        <p className="ica-price">Total: {cop(lineas.reduce((suma, linea) => suma + linea.total, 0))}</p>
        <label htmlFor="pedido-nombre">Nombre para recoger (obligatorio)</label>
        <input id="pedido-nombre" className="ica-search" autoComplete="name" value={datos.nombre} disabled={enviando}
          aria-invalid={!!errores.nombre} aria-describedby="error-nombre" onChange={event => setDatos({ ...datos, nombre: event.target.value })} />
        <p id="error-nombre" className="ica-note">{errores.nombre || 'Nombre válido para identificar tu pedido.'}</p>
        <label htmlFor="pedido-nota">Nota para la tienda (opcional)</label>
        <textarea id="pedido-nota" className="ica-search" rows={3} value={datos.nota} disabled={enviando}
          aria-invalid={!!errores.nota} aria-describedby="error-nota" onChange={event => setDatos({ ...datos, nota: event.target.value })} />
        <p id="error-nota" className="ica-note">{errores.nota || `${datos.nota.length}/300 caracteres. No incluyas datos de pago.`}</p>
        {lineas.length > 50 && <p role="alert">El pedido admite hasta 50 helados. Vuelve al carrito para revisarlo.</p>}
        {error && <p role="alert">{error}</p>}
        {enviando && <p role="status"><IonSpinner aria-hidden="true" /> Guardando tu pedido…</p>}
        <IonButton type="submit" disabled={invalido || enviando}>{import.meta.env.VITE_ICA_API_URL ? 'Confirmar pedido' : 'Simular pedido'}</IonButton>
        <IonButton fill="outline" disabled={enviando} onClick={() => setCancelar(true)}>Cancelar formulario</IonButton>
      </form>}
    <IonToast isOpen={exito} message="Pedido registrado correctamente" duration={2500} />
    <IonAlert isOpen={cancelar} header="¿Descartar los datos del formulario?" message="Se borrarán el nombre y la nota. Los helados seguirán en el carrito."
      onDidDismiss={() => setCancelar(false)} buttons={[{ text: 'Seguir escribiendo', role: 'cancel' }, { text: 'Descartar', role: 'destructive', handler: descartar }]} />
  </Marco>;
}
