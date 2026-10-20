import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { getErrorMessage } from '../data/api-error';
import { getProducts } from '../data/products-api';
import type { Product } from '../domain/product';
import EmptyState from './EmptyState';

/**
 * Pantalla: lista de productos (ruta /productos).
 *
 * El código de abajo es un EJEMPLO MÍNIMO YA DADO de cómo se carga una lista:
 *  - `useState` guarda los productos, el estado de la carga y el mensaje de error;
 *  - `useEffect` con `[]` carga la lista UNA vez, al abrir la pantalla;
 *  - `useIonViewWillEnter` la recarga cuando la persona VUELVE a esta pantalla (Ionic mantiene la
 *    página en memoria, así que sin esto no se vería, por ejemplo, un producto recién creado);
 *  - `IonItem` + `IonLabel` pintan cada producto.
 *
 * TODO(Parte 3): completar la pantalla
 *  - un buscador por texto (`IonInput`) y un filtro por categoría con un `IonButton` por categoría
 *    («Todas» + CATEGORIES) y una variable de estado; filtrar con `filterProducts()`;
 *  - estado VACÍO (la API no tiene productos) y estado SIN RESULTADOS (los filtros no encuentran nada),
 *    ambos con `EmptyState`;
 *  - `ProductCard` por producto, en lugar de IonItem/IonLabel, usando `toProductView()`;
 *  - al tocar un producto, ir a /productos/:id (`useHistory`);
 *  - un botón para ir al formulario (/productos/nuevo).
 * Para ver el estado de error, detenga el servidor (`npm run server`).
 */
type LoadStatus = 'loading' | 'ready' | 'error';

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const isLoadingRef = useRef(false);

  const loadProducts = useCallback(async () => {
    if (isLoadingRef.current) return; // evita pedir la lista dos veces a la vez
    isLoadingRef.current = true;
    setStatus('loading');
    try {
      setProducts(await getProducts());
      setStatus('ready');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setStatus('error');
    } finally {
      isLoadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  useIonViewWillEnter(() => {
    void loadProducts();
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Productos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {status === 'loading' && <p className="ion-padding">Cargando productos…</p>}
        {status === 'error' && (
          <EmptyState
            title="No se pudo cargar"
            message={errorMessage}
            actionLabel="Reintentar"
            onAction={() => void loadProducts()}
          />
        )}
        {status === 'ready' && (
          <IonList>
            {products.map((product) => (
              <IonItem key={product.id}>
                <IonLabel>{product.name}</IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
        <IonButton routerLink="/productos/nuevo" className="ion-margin">
          Nuevo producto
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ProductListPage;
