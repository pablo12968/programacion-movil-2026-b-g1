import { IonButton, IonText } from '@ionic/react';

export interface EmptyStateProps {
  /** Título corto, p. ej. «No hay productos». */
  title: string;
  /** Explicación opcional debajo del título. */
  message?: string;
  /** Texto del botón; si no se envía, no se muestra botón. */
  actionLabel?: string;
  /** Se invoca al tocar el botón. */
  onAction?: () => void;
}

/**
 * YA DADO. Componente pequeño con props tipadas: sirve de MODELO para `ProductCard`.
 *
 * Puntos para fijarse: (1) las props se declaran en una `interface` con nombre `<Componente>Props`;
 * (2) las opcionales llevan `?`; (3) el componente solo muestra datos y avisa con una función
 * (`onAction`), sin saber de dónde vienen los datos. Úselo para los estados vacío, sin resultados y error.
 */
const EmptyState: React.FC<EmptyStateProps> = ({ title, message, actionLabel, onAction }) => (
  <div className="ion-text-center ion-padding">
    <IonText>
      <h2>{title}</h2>
    </IonText>
    {message && <p>{message}</p>}
    {actionLabel && onAction && <IonButton onClick={onAction}>{actionLabel}</IonButton>}
  </div>
);

export default EmptyState;
