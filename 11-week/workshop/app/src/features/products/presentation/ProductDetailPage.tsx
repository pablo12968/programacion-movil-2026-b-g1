import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useParams } from 'react-router-dom';

/**
 * Pantalla: detalle de un producto (ruta /productos/:id).
 *
 * `useParams` lee el `:id` de la ruta; llega como TEXTO, así que se convierte con `Number(id)`.
 *
 * TODO(Parte 3): cargar el producto con `getProduct(Number(id))` (patrón de la lista: `useState` +
 * `useEffect`) y mostrar nombre, categoría, precio, stock y la etiqueta de stock (`toProductView`).
 * Maneje carga y error (incluido «no encontrado», que llega como ApiError 404 y se traduce con
 * `getErrorMessage`). Agregue el botón «Editar» (/productos/:id/editar) y el botón «Eliminar» con
 * una confirmación simple en pantalla (una variable booleana que muestra «¿Eliminar este
 * producto?» con los botones Confirmar y Cancelar); al confirmar, llame a `deleteProduct(id)` y
 * regrese a la lista (`useHistory`).
 */
const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/productos" />
          </IonButtons>
          <IonTitle>Detalle del producto</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p>TODO(Parte 3): detalle del producto con id {id}.</p>
        <IonButton routerLink={`/productos/${id}/editar`}>Editar (ejemplo)</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ProductDetailPage;
