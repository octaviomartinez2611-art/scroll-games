# Toki (antes Swipe Arcade): memoria del proyecto

Feed vertical de minijuegos, estilo TikTok: deslizás y en vez de videos hay juegos que arrancan solos. Lo usan los compañeros del dueño del repo.

## Cómo trabajar con el dueño
- Hablarle en español rioplatense (voseo), corto y simple. Él escribe rápido y con errores: interpretar con buena fe.
- Quiere ver el resultado publicado, no explicaciones largas. Avisar qué se probó y qué no.
- Gustos de diseño ya decididos (no volver atrás sin que lo pida):
  - Interfaz negra, estética TikTok. Nada de azul en la interfaz.
  - Cada juego tiene su propio fondo de color plano y oscuro (un tono por juego, `themeFor` en build5.py) y los paneles del juego en el mismo tono. Lo pidió: "más colores, que enganche más". Después pidió que no sea "tan plano": todo lo que dibuja un juego tiene una base sólida más oscura corrida 4 px (volumen tipo juguete, render en capas en build5.py) y el fondo lleva formas grandes quietas en un tono apenas más claro. El puntaje late un poco al sumar. Cada juego tiene un escenario dibujado relacionado con lo que se juega (espacio, cielo, mar, ciudad, desierto, cancha, pizarrón, mesa, etc.): `src/scenes.js`, `SCENE_OF` asigna juego → escenario y `SCENE_PREFIX` da el escenario por familia. Algunos personajes tienen cara (`face`). Los objetos tienen dibujos con detalle (`src/sprites.js`): monedas, frutas, huevos, bombas, rocas con cráteres, fuego, copos, ladrillos, cajas, sierras, hojas, misiles, flechas, naves, platillos, tanques, globos, insectos, tubos; la pista es una mano. `src/sprites2.js` cubre el resto: bolas de pool con número, paleta de madera, pelotas con costura, pelota de playa, autos con ventanilla y ruedas, plataformas con pasto, cañón con rueda, blanco con soporte, diana de dardos con gajos, dorso de carta, topos con cara, semáforo; preguntas con cartel y letras A/B/C, cartas de deslizar blancas con flechas, caminos con cordón rojo y blanco, tabla de madera en equilibrio. Sigue sin degradados ni sombras difuminadas.
  - MÁS COLOR (15/11 23:30, pidió "mucho más colores, más vibrante"; 23:38 dijo que me pasé: bajado un poco): build5 ok22. `hsl()` de scenes.js sube saturación (×1,4+10) y luz (×1,08+1) de todos los escenarios; los canvas llevan `filter: saturate(1.15)`; la pestaña activa siempre en rojo (16/11, lo pidió); el puntaje cambia de color a cada punto (`SCOL`). NO quiso: Perfil de colores (volvió a como estaba), botones de la derecha en círculos de color (volvieron a como estaban) ni la tira de 4 colores arriba de la barra. No subir más la saturación sin que lo pida.
  - Que NO parezca hecho con IA: formas planas, sin degradados, sin sombras, sin brillos, sin animaciones de más (sin aritos al tocar, sin partículas, sin "+1" flotando, sin temblor, sin parpadeo al perder: el jugador se pone semitransparente).
  - Sin carteles para leer: nada de instrucciones al empezar, nada de cartel de "perdiste", nada de avisos tipo "guardado". La ayuda está solo en el botón "?".
  - Sin monedas. Sin emojis en la interfaz.
  - Sin juegos de apuestas (se sacaron Veintiuna, Dados y Ruleta).
  - SOLO DOPAMINA, nada de juegos para pensar (lo pidió a los gritos): sin preguntas, sin cuentas, sin números, sin letras, sin memoria, sin estrategia (se sacaron todas las preguntas, posiciones, secuencias, parejas, Ta-Te-Ti, Cuatro seguidas, Minas, Palitos, Apagá las luces, Mayor o menor, Verdad, Colores, Piedra papel o tijera, y las variantes de pares/múltiplos/primos/vocales/categorías). Quedan solo acción y reflejos. Después pidió 200 más "todo dopamina, sin repetir": total 412. Después se quejó de "30 juegos iguales" y se dejaron 3 por tipo (137), se agregaron 30 mecánicas nuevas y 100 copias de juegos conocidos; el 15/11 a las 11:38 pidió VOLVER ATRÁS: "como estaba antes, con un montón de repetidos, no me importa, era mucho más divertido". Quedan los 412 de antes (código de d1e143a); se borraron los 30 y los 100 (f9.js…f18.js). No volver a recortar repetidos ni agregar tandas sin que lo pida. La lista de quitados es `MENOS` en build5.py (ok5). No agregar juegos de pensar. 15/11 19:21 se enojó al ver "Triángulo o círculo" (cartas para clasificar): se sacaron las 8 de deslizar según figura/color (k_tc, k_cc, k_gc, k_yp, k_rv, k_rnd, k_arr, k_arv) → 404 juegos. Clasificar = pensar. Ya no queda ningún juego con el pizarrón de cuentas. 16/11 01:39: sacó también los de filtrar por color o forma ("atrapá solo lo verde", "todo menos lo rojo", "tocá solo los triángulos", "tocá cuando aparezca la X", "dispará solo a los rojos"): 28 juegos c_/t_/g_/s_frd2 en `MENOS`. Quedan los de esquivar bombas (t_bomb, c_fruit). Cronómetros: le gustan ("era benigno"); `src/fclock.js` (8 nuevos `cl_`: veloz, largo, a ciegas, al centésimo, barra escondida, barra a ciegas, túnel, túnel largo; build5 ok24, ayuda en help_short.py/help.js). Tienen `noRamp` (no se aceleran). Total 384 juegos.
  - Sin nombres de marcas registradas (Tetris se sacó; Plinko=Bolitas, Simón=Secuencia, Buscaminas=Minas, etc.).
  - No todo tiene que ser tocar: usar arrastrar, mantener apretado o deslizar cuando el juego lo pide.
  - Nada de azar puro en el feed: solo el algoritmo (lo pidió explícitamente).
  - Máximo espacio de juego: el nombre del juego va abajo a la izquierda, sin tira detrás y sin bloquear toques (se juega encima y al lado); HUD compacto; barra de navegación fina.
  - Link directo a un juego: `sitio/#id` con guiones en vez de guion bajo (ej. `#snake`, `#c-eggs`, `#f-sub`).
  - Al elegir un juego para mandar hay un buscador (por nombre y por descripción, sin importar tildes).
  - Botones de la derecha (like, guardar, enviar, ayuda, 2×) siempre visibles: ya NO se esconden al jugar (lo pidió). Los espacios entre botones dejan pasar los toques al juego (`.rail { pointer-events: none }`, botones `auto`). El botón 2× (velocidad doble) está arriba del corazón.
  - Ayuda del "?": CORTA, se lee en 3 segundos (lo pidió: "tiene que ser dopamina rápido"). Tres líneas sin títulos: cómo se mueve (grande), qué hacer, "Perdés si…" (rosa). Pocas palabras, sin "igual que…". Textos en `src/help_short.py` → `help.js` (`HELP[id]`); al agregar un juego, agregarle su ayuda ahí (avisa si falta alguno). `src/help.py` es la versión larga anterior, ya no se usa.

## Nombre y logo
- La app se llama **Toki** (lo eligió entre opciones). Logo en `src/logo.py` (`svg()`): letras "toki" hechas con trazos gruesos redondos, cada una de un color de los juegos (rojo, amarillo, verde, violeta) con su base más oscura corrida hacia abajo. Sin depender de fuentes.
- Aparece en la pantalla de entrar, arriba del Perfil, en el título de la pestaña, en el manifest y en los íconos (`src/logo_png.js` genera `public/icon-192.png` y `icon-512.png`).
- No va en el feed (ahí todo el espacio es para jugar).

## Dónde está todo
- Sitio: https://swipe-arcade-juegos.netlify.app (proyecto Netlify `swipe-arcade-juegos`, id `85725297-3520-4e3e-bce8-bc5afee3d1d1`). Se publica solo con cada push a `main`. OJO: el 14/11 dejó de publicarse solo (el último deploy fue el commit f5f80f0, 00:29 hora argentina); los pushes siguientes llegaron a GitHub pero Netlify no los tomó. Desde esta sesión no se puede publicar directo (el proxy bloquea api.netlify.com y netlify-mcp.netlify.app). Para ver qué se publicó: herramienta Netlify `get-project` → `currentDeploy` → `get-deploy-for-site` (mirar `commit_ref`). Si no coincide con `git log -1`, pedirle al dueño "Trigger deploy" en el panel. CAUSA (15/11): "Skipped due to account credit usage exceeded": el plan gratis da 300 créditos/mes y cada deploy de producción gasta ~15 (≈20 deploys por mes). REGLA DESDE AHORA: no hacer push a `main` por cada cambio. Commitear local y pushear todo junto SOLO cuando el dueño diga "subilo" (o pushear a otra rama, que no publica). Avisarle cuántos deploys van. (15/11 01:00: el dueño pagó un plan y el deploy de `09555d8` salió bien; igual seguir juntando cambios para no gastar créditos.)
- El cartel "Powered by Netlify" era del plan gratis. Con el plan pago (15/11) se sacó el arreglo que le dejaba 200 px libres a la derecha: la barra volvió a ser como antes, con los tres botones (Jugar, Amigos, Perfil) repartidos a lo ancho. No volver a correrlos.
- Versión sin servidor como Artifact de Claude: https://claude.ai/artifact/1Fm8HHioxx9KuSJ8m9dL3U (amigos y chat solo locales ahí).
- `public/index.html`: la app generada (no editar a mano).
- `netlify/functions/api.mjs`: servidor. Cuentas con usuario + PIN (scrypt), sesiones, estado del jugador, amigos, mensajes, reportes y panel de admin. Guarda en Netlify Blobs (store `arcade`), una clave por mensaje y por amistad para no pisar datos. La sesión se guarda en `localStorage` (`sa-token`) y además en una cookie HttpOnly de un año (`sa`), así el sitio recuerda al usuario sin pedir el PIN otra vez.
- Panel de admin → "Juegos (datos de N jugadores)" (16/11, eligió la opción 3): `GET /api/gamestats` (solo admin, `computeGameStats` en api.mjs, sin nombres de jugadores): "Los que más se saltean" (veces que lo pasaron sin tocar en <3 s / veces que apareció, mínimo 3 veces) y "Los que más enganchan" (enganche medio por persona, sin los que se saltean más de la mitad). Tocar uno abre el juego. Prueba `ntest/gstats.js`.
- Panel de admin (Perfil, solo admin): "Cuentas (N)" con cada usuario, cuándo jugó por última vez y cuándo se creó (endpoint `GET /api/users`, solo admin, nunca devuelve PINs); y "Mensajes reportados". Desde acá no se pueden leer las cuentas de Netlify: hay que mirarlas en ese panel.
- Código de admin: variable de entorno `ADMIN_CODE` en Netlify. NUNCA ponerlo en el repo (es público). Se usa una sola vez por cuenta desde Perfil → "Soy el administrador".

## Sin internet (pedido: "que se pueda jugar sin internet ni datos")
- `public/sw.js` (service worker, se registra desde build6): guarda la app en el teléfono. La página se abre al toque con la versión guardada (aunque haya mala señal) y la nueva se baja en segundo plano: las novedades aparecen la vez siguiente que abrís (antes esperaba la red hasta 3 s cada vez). `/api/*` nunca se guarda. Al cambiar sw.js, subir `CACHE` (va por sa-v5) para tirar lo viejo. Se actualiza sola (15/11, preguntó cómo actualizar la app agregada al inicio): si la página nueva es distinta, sw.js le avisa a la app (`{update:true}`); si todavía no tocaste nada recarga al toque, si estás jugando recarga cuando salís de la app (build6, "se actualiza sola"). Prueba `ntest/upd.js` en el scratchpad. Prueba: `ntest/swup.js` en el scratchpad (abre en ~85 ms con lo guardado, la segunda vez ve lo nuevo). `netlify.toml` le pone `no-cache` a `/` y `/sw.js`.
- `manifest.webmanifest` + `icon-192.png`/`icon-512.png`: se puede agregar a la pantalla de inicio como app.
- Sin internet se juega igual y el algoritmo aprende (todo en localStorage). `save()` pone `P.ts`; al reconectar, `applyState` se queda con lo del teléfono si es más nuevo que lo del servidor y es el mismo usuario (`P.owner`), y lo sube.
- Se guardan en el teléfono: nombre (`sa-me`), amigos (`sa-fr`), últimos 60 mensajes por chat (`sa-ms`), datos colectivos del algoritmo (`sa-tr`).
- Mensajes y juegos enviados sin internet quedan en `sa-out` (burbuja gris + "Se manda cuando haya internet") y se mandan solos al volver (evento `online` y cada 15 s). Errores que no son de conexión no quedan esperando.
- Sin cuenta y sin internet no aparece el cartel de entrar. Pruebas: `src/t_offline.js` y `src/t_offline2.js` con el servidor de prueba.

## Ahorro de datos (preguntó si se le iban a gastar los datos)
- Primera vez: ~130 KB (la página comprimida). Después, cada vez que abre: ~1 KB para chequear si hay versión nueva (si la hay, otros ~130 KB).
- Jugando una hora: ~0,5 MB. Antes podía llegar a ~13 MB/h porque subía el estado entero cada 20 s.
- Cómo: el estado se sube cada 90 s (y al salir), con números redondeados y comprimido con gzip (`CompressionStream`; el servidor lo descomprime si empieza con 1f 8b). Respuestas GET con ETag: si no cambió, el servidor contesta 304 sin cuerpo. Récords de amigos cada 10 min, datos colectivos cada 30 min (top 8 parecidos por juego).
- Prueba: `src/t_datos.js` con el servidor de prueba.

## Cómo se arma la app (src/)
`sh src/build.sh` corre en orden:
1. `build.py`: parte de `swipe-arcade.bak.html` (base) y toma de `pat.html` los controles de arrastrar/mantener y algunos juegos.
2. `build2.py`: estilo plano + los 18 juegos clásicos de `ng1.js`/`ng2.js`.
3. `build3.py`: las fábricas de variantes `f1.js`…`f6.js` (atrapar, esquivar, tocar, preguntas, tiempos, corredores, tiradores, paletas, vuelo, memoria, deslizar, reflejos, lanzamientos, equilibrio, caminos, mesa, parejas).
4. `build4.py`: algoritmo del feed, estadísticas por juego, nombre sobre fondo negro, rail que se esconde, sin parpadeo.
5. `build5.py`: sonido (desbloqueo en iPhone), botón 2×, sin monedas, más espacio de juego, filtro de juegos de apuestas.
6. `build6.py`: versión Netlify (documento completo, login, amigos y chat contra `/api`, reportes, admin) → `public/index.html`.
7. `minify.py`: achica el JavaScript de la versión Netlify con terser (`npx terser@5.31.6`; 513 KB → 382 KB, comprimido 130 → 114 KB). Si no hay internet, deja la página sin achicar. La versión de Claude no se achica (para poder leerla).
Para cambiar algo, editar la fuente que corresponde y volver a correr `build.sh`. Probar con Playwright (Chromium ya instalado) antes de hacer push.

## Tanda dopamina (f7.js y f8.js, 200 juegos)
20 mecánicas nuevas × 10 versiones, cada una con su escenario (`regD` asigna `SCENE_BY[id]`): carriles `ln_`, flechas a la rueda `kn_`, aros giratorios `ri_` (huecos enfrentados, si no es imposible pasar), caída por la torre `tw_`, rompe pisos `sm_`, diagonal `zz_`, pila de saltos `sj_`, ganchos `hk_`, volcadas `dk_`, puente `br_`, teclas `pt_`, hockey de mesa `ah_`, arquero `gk_`, escudo `sh_`, paredes `wj_`, pila de comida `bg_`, bomberos `fh_`, cama elástica `tr_`, torreta `tu_`, soltá `rp_`.
- OJO al escribir juegos: no usar como propiedad nombres que ya usa el motor (`th` es el tema, `rings`/`parts`/`pops` son efectos, `state`, `score`, `best`, `cfg`, `el`...). Pasó con `th` y `rings` y rompía el juego.
- Arrastrar solo en horizontal: un arrastre vertical hace scroll del feed.
- `t28.js` juega los 200 con su control; `t30.js` tiene bots que demuestran que se puede ganar.

## Tandas quitadas
Los 30 (f9/f10) y los 100 conocidos (f11…f18) existieron en los commits 1065d0a y ea26043; se sacaron a pedido del dueño. Si alguna vez los quiere de vuelta, están en el historial de git.

## Funcionamiento
- Arranca al toque (16/11, build5 ok23): mientras jugás se arma y se dibuja el juego siguiente (y el anterior), así al deslizar ya está listo. Prueba `sweep/pre.js` en el scratchpad.
- Cada partida se pone más intensa (16/11, ok23): `Game.prototype.ramp()` acelera todo el juego con el tiempo jugado (`_pt`) y los puntos, hasta ×1,45 (`step(dt * ramp())`). Prueba `sweep/ramp.js`.
- Barrido con bots (16/11): `sweep/sweep.js` (los 403 juegos, tiempo simulado sin dibujar, bots al azar según el control) y `sweep2.js` (más estrategias: soltar, arrastrar y tirar, mantener largo). Se arregló: Invasores se colgaba al terminar una oleada con balas en el aire; Alunizaje más fácil (plataforma 140, aterrizaje blando hasta 200/110, arranca más abajo); Soltá (rp_) vasos 1,5× más anchos. Cronómetro se sacó y se volvió a poner: el dueño dijo que "era benigno" y pidió varios así (16/11 01:39). Los que el bot al azar no puede (Soltá, Puente, Semáforo, Culebrita) se comprobaron con bots inteligentes (`smart.js`, `t30.js`).
- Gracia al llegar: en los primeros 3 s de una partida no se pierde vida si todavía no tocaste la pantalla (`this.inp`, en `hurt`). Antes había juegos que te sacaban 1 o 2 vidas antes de entender qué hacer (Peloteo, Seguime, Cajas, Flotador, Cinta).
- Diagnóstico: `t25.js` (vidas perdidas sin tocar en 3 s y puntaje con toques al azar) y `t11.js` (barrido completo: errores y pantalla vacía).

## El algoritmo del feed (v3, `src/algo2.js` + `/api/trends`)
Pidió que sea "tan bueno como el de Instagram". Mismos principios (sin sus millones de datos):
- E_g = t/40 + 0,8·r + 1,2·cerca + 0,8·récords − 1,5·k + 4·like + 6·guardado (t segundos, r siguió jugando tras perder, cerca = terminó a 75 % o más de su récord, k = lo pasó sin tocar en menos de 3 s).
- gusto_g = (E_g + 2·previo_g)/(vistas_g + 2); previo = 0,4·familia + 0,2·control + 0,25·colectivo + 0,15·popularidad. −0,4 si morís siempre en menos de 6 s, −0,3 si nunca perdés.
- Colectivo (`/api/trends` en api.mjs, `computeTrends`, se recalcula cada 10 min y se guarda en `agg/trends`, sin nombres): `pop` = cuánto engancha cada juego a todos; `nb` = juegos que les gustan a las mismas personas (coocurrencia normalizada, mínimo 2 personas). El cliente lo baja en `TR` (`loadTrends` en build6, cada 10 min). Un jugador nuevo arranca con los juegos que más enganchan.
- Elección: con probabilidad ε (35 % al principio, baja 0,6 puntos por juego visto, mínimo 10 %) descubre un juego no visto según el previo; si no, P(g) ∝ e^(gusto/T). T = 0,28 si venís pasando todo rápido, si no 0,38. Penalidades: 0,5^(misma familia en últimos 6), 0,6 si los últimos 3 tienen el mismo control; 1,3 favorito no visto hace un día; 1,25 si lo jugaron amigos. Sin los últimos 15.
- Memoria entre visitas (se quejó: "siempre que entro me aparecen exactamente los mismos juegos"): `P.hist` guarda los últimos 60 juegos mostrados (se anota al aparecer, viaja con la cuenta). No repite los últimos 40 aunque hayas cerrado la app; la penalidad de familia cuenta los últimos 6 vistos (incluye la visita anterior) con 0,5^n; y un juego visto hace poco pesa menos: <30 min ×0,12, <3 h ×0,5, <12 h ×0,8. Prueba `t39.js`: 5 entradas seguidas, 0 repetidos y primer juego distinto cada vez.
- Al pasar de juego se recalculan los que vienen (`trimAfter(act+1)`). Cada día lo aprendido se achica 3 % (`P.decayAt`).
- Datos por juego en `P.st[id]`: t, l, h, r, k, n (vistas), ls (última vez), q (muertes rápidas), nb (cerca del récord), rec (récords).
- Simulación `t37.js` (30 jugadores falsos en 3 grupos de gusto + uno nuevo): aciertos 20 % / 38 % / 64 % / 67 % / 75 % en los juegos 1-10 / 11-20 / 21-40 / 41-60 / 61-80 (azar = 10 %). La v2 llegaba a 36–56 %.
- Récord nuevo: suena un arpegio una vez y "Récord nuevo" se pone dorado.

## Pasa solo al siguiente (15/11, pidió "más pasivo, como TikTok")
- Al perder, a los 1,8 s (`AUTO_MS`) el feed pasa solo al juego siguiente; mientras tanto una rayita blanca abajo se va llenando. Tocar antes = reintentar el mismo. Si volvés atrás a un juego perdido, arranca de nuevo. Botón "Pasar solo al perder" en el Perfil (`P.auto`, por defecto sí). build5 ok21. Prueba `auto.js` en el scratchpad.

## Vibración y sonido (15/11)
- `vib()` en build5 ok20: Android con `navigator.vibrate`; iPhone (iOS 18+) con el truco del `<input type=checkbox switch>` escondido, que solo vibra si viene de un toque. Vibra cortito al sumar, un poco más en perfecto, al perder vida, al terminar y patrón en récord nuevo. Botón "Vibración" en el Perfil (`P.vib`, por defecto sí).
- Cada familia de juegos tiene su "voz" (`voiceFor`: nota base y tipo de onda), y los puntos seguidos suben por una escala pentatónica.
- 16/11 dijo "la vibración nunca anda". Arreglo (build5 ok25): Android: pulsos de 8–16 ms eran muy cortos para el motor → mínimo 30 ms (×1,4). iPhone: el `<input switch>` solo vibra dentro de una activación de usuario (levantar el dedo: touchend/pointerup), no al apoyarlo ni desde el juego; si no hay `navigator.userActivation.isActive`, queda pendiente y vibra al levantar el dedo (hasta 700 ms después). Se crea un `<label>` nuevo en `<head>` cada vez (como la librería ios-haptics); golpes fuertes = 2 toques. OJO: ok25 reemplaza desde `function vib` hasta `var PENTA` y conserva `AUTO_MS` y `SCOL` que viven ahí (se borraron una vez por error). Prueba `ntest/vibt.js` (emula Pixel 7 e iPhone 14).
- No probado en teléfono real (Chromium de compu no vibra).

## Enganche (pedido: "mucho más adictivo")
- Racha: 10 puntos seguidos sin perder vida → los puntos valen ×2 (puntaje en amarillo, "×2" al lado del récord) hasta perder una vida.
- Rival: debajo del puntaje dice "Superá a <amigo> · N" con el récord del amigo más cercano por encima; al pasarlo suena y pasa al siguiente; si no queda nadie, "1º entre amigos". Datos de `/api/bests` (`FB` en el cliente).
- Ranking del juego entre amigos dentro de la hoja del botón "?".
- Desafío de hoy: mismo juego para todos según la fecha; es el primer juego del día y hay un botón en Perfil.
- Decidido NO hacer: premios al azar ni castigos por no entrar. (Notificaciones sí: las pidió el 15/11, ver abajo.)
- No suponer la edad de los usuarios ni preguntarla: el dueño dijo que no es asunto nuestro.

## Avisos al teléfono (Web Push, 15/11)
- Pidió: mensajes de amigos (incluye "te mandó un juego") y uno por día "con voz del algoritmo" recomendando un juego nuevo. NO quiere aviso de "te superaron un récord".
- Servidor: `netlify/lib/push.mjs` (claves VAPID generadas solas y guardadas en Blobs `cfg/vapid`, nunca en el repo; suscripciones `p/<usuario>`, hasta 5 teléfonos; las vencidas 404/410 se borran solas). `api.mjs`: `GET /api/push/key`, `POST /api/push/sub`, `POST /api/push/unsub`, y avisa al mandar un mensaje. `netlify/functions/daily.mjs`: función programada `0 0,1,12,13,15,16,18,19,21,22 * * *` (10 por día: 9, 10, 12, 13, 15, 16, 18, 19, 21 y 22 h de Argentina; pidió "10 avisos"). Rota entre: juego nuevo para vos (`pickFor` + `recoText`, ej. "Como te enganchó Dardos, este te va a encantar: Bolos"), volver a tu favorito que no jugás hace 6 h (`favFor`/`favText`) y romper tu récord (`recFor`/`recText`, récords de 5 o más). No manda de noche, ni si estás jugando (estado de hace <20 min), ni con menos de 50 min del anterior, ni el mismo juego que los últimos 20 (`pr/<usuario>`). Todos usan la etiqueta `reco`: uno nuevo reemplaza al anterior sin leer, no se apilan. `web-push` va en `external_node_modules` (netlify.toml).
- Nombres de juegos para el servidor: `netlify/lib/catalog.mjs`, lo genera `src/mkcat.cjs` en cada build (usa `window.TOKI_CAT`).
- Cliente (build6, sección "avisos al teléfono"): botón "Avisos" en el Perfil; además pide permiso la primera vez que tocás la pestaña Amigos. Tocar el aviso abre el chat (`/?chat=nombre`) o el juego (`/#id`). `sw.js` muestra el aviso (CACHE sa-v5).
- iPhone: solo si Toki está agregada a la pantalla de inicio (iOS 16.4+); si no, el botón dice "Agregá Toki al inicio".
- Desde acá no se puede configurar el panel de Netlify (proxy 403), por eso la clave se genera sola en el servidor.
- Probado: `ntest/pushtest.mjs` en el scratchpad con un servicio de avisos falso (https local): llegan cifrados con VAPID, el texto se lee bien, el diario manda uno solo, las suscripciones vencidas se borran. No probado en teléfono real (el Chromium de prueba no deja suscribirse).

## Pendientes ofrecidos (no pedidos todavía)
- Aviso de descanso tras un rato largo, tiempo de juego del día en el Perfil, texto de privacidad y botón para borrar la cuenta.
