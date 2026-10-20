import type { ProductView } from '../domain/product';

export interface ProductCardProps {
  product: ProductView;
  /** Se invoca con el id del producto cuando la persona toca la tarjeta. */
  onSelect?: (id: number) => void;
}

/**
 * Tarjeta reutilizable de un producto (se usa en la lista).
 *
 * TODO(Parte 3): derivarla de `EmptyState.tsx` (mismo estilo de props tipadas) y construirla con
 * componentes de Ionic (IonItem, IonLabel...), mostrando nombre, categoría, precio y la etiqueta
 * de stock (`stockLabel`), con un aviso visible cuando hay pocas unidades o está agotado.
 * Hoy solo muestra el nombre.
 */
const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => (
  <div onClick={() => onSelect?.(product.id)}>{product.name}</div>
);

export default ProductCard;
