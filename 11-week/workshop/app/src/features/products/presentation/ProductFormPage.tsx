import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

/**
 * Pantalla: formulario de producto. La misma pantalla sirve para dos rutas:
 *  - /productos/nuevo          → crear (no hay `id` en la ruta)
 *  - /productos/:id/editar     → editar (hay `id`; precargar los campos con `getProduct`)
 *
 * El campo «Nombre» de abajo es un EJEMPLO YA DADO de campo controlado: el valor vive en una
 * variable de estado (`useState`) y `onIonInput` la actualiza cada vez que la persona escribe.
 *
 * TODO(Parte 3): agregar precio, categoría y stock. Para la categoría use un `IonButton` por
 * cada elemento de CATEGORIES y una variable de estado. Al guardar, valide con `validateProduct()`
 * y muestre el mensaje junto a cada campo (validación en línea). Si es válido, llame a
 * `createProduct` o `updateProduct`. Si el servidor rechaza (ApiError 400), muestre su mensaje y sus
 * `details`. Si guarda bien, regrese a la lista (`useHistory`).
 */
const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditing = id !== undefined;
  const [name, setName] = useState('');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/productos" />
          </IonButtons>
          <IonTitle>{isEditing ? 'Editar producto' : 'Nuevo producto'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonInput
          label="Nombre"
          labelPlacement="floating"
          fill="outline"
          value={name}
          onIonInput={(event) => setName(String(event.detail.value ?? ''))}
        />
        <p>TODO(Parte 3): resto del formulario con validación en línea.</p>
      </IonContent>
    </IonPage>
  );
};

export default ProductFormPage;
