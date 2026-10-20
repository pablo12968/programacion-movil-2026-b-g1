// Ejercicio Kotlin · Parte 4 del TODO.md
//
// Alcance: solo lo visto en la semana 7 (val/var, funciones, clases, tipos que admiten null,
// `?.`, `?:`, if/when, plantillas de cadena). No exige proyecto Android.
// Cómo ejecutarlo: pegue el archivo en https://play.kotlinlang.org o compílelo con `kotlinc`.

// TODO(Parte 4): defina la clase Product con id (Int), name (String), price (Double),
// category (String) y un campo OPCIONAL: stock (Int?) que puede ser null.
// Use `val` para lo que no cambia y `var` solo para lo que sí cambia.


// TODO(Parte 4): stockLabel(stock: Int?): String
//   null → "Sin dato" · 0 → "Agotado" · menos de 5 → "Pocas unidades" · otro caso → "Disponible"
//   (use `?:`, `?.` o `if` para tratar el null).


// TODO(Parte 4): applyDiscount(price: Double, percent: Int): Double
//   Devuelve el precio con el descuento aplicado (p. ej. 10000.0 con 15 % → 8500.0).


fun main() {
    // TODO(Parte 4): cree 3 productos (uno con stock null y uno agotado) e imprima, por cada uno,
    // su nombre, la etiqueta de stock y su precio con un 10 % de descuento.
}
