# CP2 · Navegación y tokens de ICA

Se conservan tres destinos frecuentes: Helados, Carrito y Mis pedidos. Una barra
inferior permite cambiar de sección sin abrir menús. Personalizar se abre desde
un sabor y ofrece regreso al catálogo. El prototipo usa datos demo de ICA;
no envía pedidos ni cobra. El catálogo conectado utilizará `GET /api/products`.

Los seis sabores, sus categorías y los suplementos de tamaño y topping proceden
de `ica.app/frontend/lib/models.dart`. Aquí los importes están en pesos COP,
mientras Flutter representa internamente centavos: 250000 centavos = 2500 COP.

Tokens definidos en `app/src/app/theme/ica.css`. La tipografía usa rem y
los espacios son .5rem, 1rem y 1.5rem. La paleta conserva el tono fresa de ICA.

| Uso | Texto | Fondo | Contraste WCAG calculado |
|---|---|---|---|
| Primario | #ffffff | #94334d | 7.39:1 |
| Secundario | #ffffff | #405c36 | 7.49:1 |
| Éxito | #ffffff | #28603b | 7.43:1 |
| Error | #ffffff | #a4262c | 7.26:1 |
| Cuerpo | #302526 | #fffaf4 | 14.27:1 |
| Nota | #65575a | #fffaf4 | 6.60:1 |
| Precio | #94334d | #ffffff | 7.39:1 |

Se calcula luminancia sRGB lineal y `(Lclaro + .05) / (Loscuro + .05)`;
el umbral para texto normal es 4.5:1.
