# Swipe Arcade: memoria del proyecto

Feed vertical de minijuegos, estilo TikTok: deslizás y en vez de videos hay juegos que arrancan solos. Lo usan los compañeros del dueño del repo.

## Cómo trabajar con el dueño
- Hablarle en español rioplatense (voseo), corto y simple. Él escribe rápido y con errores: interpretar con buena fe.
- Quiere ver el resultado publicado, no explicaciones largas. Avisar qué se probó y qué no.
- Gustos de diseño ya decididos (no volver atrás sin que lo pida):
  - Interfaz negra, estética TikTok. Nada de azul en la interfaz.
  - Cada juego tiene su propio fondo de color plano y oscuro (un tono por juego, `themeFor` en build5.py) y los paneles del juego en el mismo tono. Lo pidió: "más colores, que enganche más". Después pidió que no sea "tan plano": todo lo que dibuja un juego tiene una base sólida más oscura corrida 4 px (volumen tipo juguete, render en capas en build5.py) y el fondo lleva formas grandes quietas en un tono apenas más claro. El puntaje late un poco al sumar. Cada juego tiene un escenario dibujado relacionado con lo que se juega (espacio, cielo, mar, ciudad, desierto, cancha, pizarrón, mesa, etc.): `src/scenes.js`, `SCENE_OF` asigna juego → escenario y `SCENE_PREFIX` da el escenario por familia. Algunos personajes tienen cara (`face`). Los objetos tienen dibujos con detalle (`src/sprites.js`): monedas, frutas, huevos, bombas, rocas con cráteres, fuego, copos, ladrillos, cajas, sierras, hojas, misiles, flechas, naves, platillos, tanques, globos, insectos, tubos; la pista es una mano. `src/sprites2.js` cubre el resto: bolas de pool con número, paleta de madera, pelotas con costura, pelota de playa, autos con ventanilla y ruedas, plataformas con pasto, cañón con rueda, blanco con soporte, diana de dardos con gajos, dorso de carta, topos con cara, semáforo; preguntas con cartel y letras A/B/C, cartas de deslizar blancas con flechas, caminos con cordón rojo y blanco, tabla de madera en equilibrio. Sigue sin degradados ni sombras difuminadas.
  - Que NO parezca hecho con IA: formas planas, sin degradados, sin sombras, sin brillos, sin animaciones de más (sin aritos al tocar, sin partículas, sin "+1" flotando, sin temblor, sin parpadeo al perder: el jugador se pone semitransparente).
  - Sin carteles para leer: nada de instrucciones al empezar, nada de cartel de "perdiste", nada de avisos tipo "guardado". La ayuda está solo en el botón "?".
  - Sin monedas. Sin emojis en la interfaz.
  - Sin juegos de apuestas (se sacaron Veintiuna, Dados y Ruleta).
  - SOLO DOPAMINA, nada de juegos para pensar (lo pidió a los gritos): sin preguntas, sin cuentas, sin números, sin letras, sin memoria, sin estrategia (se sacaron todas las preguntas, posiciones, secuencias, parejas, Ta-Te-Ti, Cuatro seguidas, Minas, Palitos, Apagá las luces, Mayor o menor, Verdad, Colores, Piedra papel o tijera, y las variantes de pares/múltiplos/primos/vocales/categorías). Quedan solo acción y reflejos. Después pidió 200 más "todo dopamina, sin repetir": total 412. La lista de quitados es `MENOS` en build5.py (ok5). No agregar juegos de pensar.
  - Sin nombres de marcas registradas (Tetris se sacó; Plinko=Bolitas, Simón=Secuencia, Buscaminas=Minas, etc.).
  - No todo tiene que ser tocar: usar arrastrar, mantener apretado o deslizar cuando el juego lo pide.
  - Nada de azar puro en el feed: solo el algoritmo (lo pidió explícitamente).
  - Máximo espacio de juego: el nombre del juego va abajo a la izquierda, sin tira detrás y sin bloquear toques (se juega encima y al lado); HUD compacto; barra de navegación fina.
  - Link directo a un juego: `sitio/#id` con guiones en vez de guion bajo (ej. `#snake`, `#c-eggs`, `#f-sub`).
  - Al elegir un juego para mandar hay un buscador (por nombre y por descripción, sin importar tildes).
  - Botones de la derecha (like, guardar, enviar, ayuda) se esconden mientras jugás y vuelven 1 s después de soltar. El botón 2× (velocidad doble) está arriba del corazón y nunca se esconde.

## Dónde está todo
- Sitio: https://swipe-arcade-juegos.netlify.app (proyecto Netlify `swipe-arcade-juegos`, id `85725297-3520-4e3e-bce8-bc5afee3d1d1`). Se publica solo con cada push a `main`.
- El cartel "Powered by Netlify" (plan gratis) va abajo a la derecha: por eso la barra deja libres ~200 px a la derecha en pantallas angostas.
- Versión sin servidor como Artifact de Claude: https://claude.ai/artifact/1Fm8HHioxx9KuSJ8m9dL3U (amigos y chat solo locales ahí).
- `public/index.html`: la app generada (no editar a mano).
- `netlify/functions/api.mjs`: servidor. Cuentas con usuario + PIN (scrypt), sesiones, estado del jugador, amigos, mensajes, reportes y panel de admin. Guarda en Netlify Blobs (store `arcade`), una clave por mensaje y por amistad para no pisar datos. La sesión se guarda en `localStorage` (`sa-token`) y además en una cookie HttpOnly de un año (`sa`), así el sitio recuerda al usuario sin pedir el PIN otra vez.
- Código de admin: variable de entorno `ADMIN_CODE` en Netlify. NUNCA ponerlo en el repo (es público). Se usa una sola vez por cuenta desde Perfil → "Soy el administrador".

## Cómo se arma la app (src/)
`sh src/build.sh` corre en orden:
1. `build.py`: parte de `swipe-arcade.bak.html` (base) y toma de `pat.html` los controles de arrastrar/mantener y algunos juegos.
2. `build2.py`: estilo plano + los 18 juegos clásicos de `ng1.js`/`ng2.js`.
3. `build3.py`: las fábricas de variantes `f1.js`…`f6.js` (atrapar, esquivar, tocar, preguntas, tiempos, corredores, tiradores, paletas, vuelo, memoria, deslizar, reflejos, lanzamientos, equilibrio, caminos, mesa, parejas).
4. `build4.py`: algoritmo del feed, estadísticas por juego, nombre sobre fondo negro, rail que se esconde, sin parpadeo.
5. `build5.py`: sonido (desbloqueo en iPhone), botón 2×, sin monedas, más espacio de juego, filtro de juegos de apuestas.
6. `build6.py`: versión Netlify (documento completo, login, amigos y chat contra `/api`, reportes, admin) → `public/index.html`.
Para cambiar algo, editar la fuente que corresponde y volver a correr `build.sh`. Probar con Playwright (Chromium ya instalado) antes de hacer push.

## Tanda dopamina (f7.js y f8.js, 200 juegos)
20 mecánicas nuevas × 10 versiones, cada una con su escenario (`regD` asigna `SCENE_BY[id]`): carriles `ln_`, flechas a la rueda `kn_`, aros giratorios `ri_` (huecos enfrentados, si no es imposible pasar), caída por la torre `tw_`, rompe pisos `sm_`, diagonal `zz_`, pila de saltos `sj_`, ganchos `hk_`, volcadas `dk_`, puente `br_`, teclas `pt_`, hockey de mesa `ah_`, arquero `gk_`, escudo `sh_`, paredes `wj_`, pila de comida `bg_`, bomberos `fh_`, cama elástica `tr_`, torreta `tu_`, soltá `rp_`.
- OJO al escribir juegos: no usar como propiedad nombres que ya usa el motor (`th` es el tema, `rings`/`parts`/`pops` son efectos, `state`, `score`, `best`, `cfg`, `el`...). Pasó con `th` y `rings` y rompía el juego.
- Arrastrar solo en horizontal: un arrastre vertical hace scroll del feed.
- `t28.js` juega los 200 con su control; `t30.js` tiene bots que demuestran que se puede ganar.

## Funcionamiento
- Gracia al llegar: en los primeros 3 s de una partida no se pierde vida si todavía no tocaste la pantalla (`this.inp`, en `hurt`). Antes había juegos que te sacaban 1 o 2 vidas antes de entender qué hacer (Peloteo, Seguime, Cajas, Flotador, Cinta).
- Diagnóstico: `t25.js` (vidas perdidas sin tocar en 3 s y puntaje con toques al azar) y `t11.js` (barrido completo: errores y pantalla vacía).

## El algoritmo del feed
P(g) = w_g / Σw, sin contar los últimos 10 juegos mostrados.
w_g = [t<3 ? 1,6 : (0,5 + 0,35·ln(1+t/20) + 0,6·ln(1+r)) · (t/(h+1)>45 ? 0,5 : 1) · 0,7^min(k,6)] · (like ? 3 : 1) · (guardado ? 4 : 1)
- t = segundos jugados, r = veces que perdió y siguió jugando, h = vidas perdidas, k = veces que lo pasó en menos de 3 s sin tocar (baja 1 si después juega más de 10 s).
- Se guarda en `P.st` (en la cuenta del jugador en Netlify; en el navegador si juega sin cuenta).

## Enganche (pedido: "mucho más adictivo")
- Racha: 10 puntos seguidos sin perder vida → los puntos valen ×2 (puntaje en amarillo, "×2" al lado del récord) hasta perder una vida.
- Rival: debajo del puntaje dice "Superá a <amigo> · N" con el récord del amigo más cercano por encima; al pasarlo suena y pasa al siguiente; si no queda nadie, "1º entre amigos". Datos de `/api/bests` (`FB` en el cliente).
- Ranking del juego entre amigos dentro de la hoja del botón "?".
- Desafío de hoy: mismo juego para todos según la fecha; es el primer juego del día y hay un botón en Perfil.
- Decidido NO hacer: notificaciones, premios al azar, ni castigos por no entrar (los usuarios son menores).

## Pendientes ofrecidos (no pedidos todavía)
- Aviso de descanso tras un rato largo, tiempo de juego del día en el Perfil, texto de privacidad y botón para borrar la cuenta.
