# Ayuda completa de cada juego: [cómo se mueve, qué tenés que hacer, cuándo perdés una vida]
# Cada texto se entiende solo, sin haber jugado antes ni haber leído otro juego.
import json, sys

ids = [r[0] for r in json.load(open('cat.json'))]
H = {}

# ---------- frases de control ----------
DRAG = "Apoyá el dedo en cualquier parte de la pantalla y movelo a la izquierda o a la derecha"
TAPANY = "Tocá en cualquier parte de la pantalla"
HOLD = "Mantené el dedo apoyado en cualquier parte de la pantalla"
SWIPE = "Deslizá el dedo hacia la izquierda o hacia la derecha, o tocá ese lado de la pantalla"

# ---------- Atrapar (c_) ----------
cC = DRAG + ": la canasta de abajo sigue a tu dedo."
catch_ = {
 'circ': ("Caen figuras de distintas formas. Atrapá con la canasta solamente los círculos. Cada uno suma 1.", "Si atrapás una figura que no es un círculo."),
 'coins': ("Caen monedas doradas y piedras grises. Atrapá las monedas. Cada una suma 1.", "Si atrapás una piedra gris."),
 'drop': ("Caen gotas de agua. Atrapalas todas con la canasta. Cada una suma 1.", "Si una gota llega al piso sin que la atrapes."),
 'eggs': ("Caen huevos. Atrapalos todos con la canasta. Cada uno suma 1.", "Si un huevo llega al piso sin que lo atrapes."),
 'fast': ("Caen estrellas muy rápido, mezcladas con rocas grises. Atrapá las estrellas. Cada una suma 1.", "Si atrapás una roca gris."),
 'fruit': ("Caen frutas y bombas. Atrapá las frutas. Cada una suma 1.", "Si atrapás una bomba."),
 'notred': ("Caen cosas de muchos colores. Atrapá todo lo que no sea rojo. Cada una suma 1.", "Si atrapás algo rojo."),
 'notsq': ("Caen figuras de distintas formas. Atrapá todo lo que no sea un cuadrado. Cada una suma 1.", "Si atrapás un cuadrado."),
 'onlygrn': ("Caen cosas de muchos colores. Atrapá solamente las verdes. Cada una suma 1.", "Si atrapás algo que no es verde."),
 'onlyred': ("Caen cosas de muchos colores. Atrapá solamente las rojas. Cada una suma 1.", "Si atrapás algo que no es rojo."),
 'onlystar': ("Caen figuras de distintas formas. Atrapá solamente las estrellas. Cada una suma 1.", "Si atrapás una figura que no es una estrella."),
 'pizza': ("Caen cajas de pizza y bolsas negras. Atrapá todas las pizzas. Cada una suma 1.", "Si una pizza llega al piso o si atrapás una bolsa negra."),
 'rmb': ("Caen figuras de distintas formas. Atrapá solamente los rombos (los cuadrados parados en punta). Cada uno suma 1.", "Si atrapás una figura que no es un rombo."),
 'sq': ("Caen figuras de distintas formas. Atrapá solamente los cuadrados. Cada uno suma 1.", "Si atrapás una figura que no es un cuadrado."),
 'stars': ("Caen estrellas y pinchos. Atrapá las estrellas. Cada una suma 1.", "Si atrapás un pincho."),
 'tri': ("Caen figuras de distintas formas. Atrapá solamente los triángulos. Cada uno suma 1.", "Si atrapás una figura que no es un triángulo."),
}
for k, (g, l) in catch_.items(): H['c_' + k] = [cC, g, l]

# ---------- Esquivar (d_) ----------
dC = DRAG + ": tu bolita de abajo sigue a tu dedo."
dG = " Cada cosa que pasa sin tocarte suma 1."
dodge_ = {
 'acid': "Llueven muchas gotas verdes chiquitas. Buscá los espacios entre las gotas.",
 'arr': "Caen flechas muy rápido. Esquivalas.",
 'aval': "Caen grupos de piedras todas juntas. Ponete en el hueco que dejan.",
 'bar': "Caen vigas anchas. Ponete donde no hay viga.",
 'big': "Caen pocas piedras, pero enormes. Ponete en el espacio libre.",
 'brk': "Caen ladrillos. Esquivalos.",
 'bub': "Bajan burbujas enormes y lentas que se mueven de costado. Esquivalas.",
 'cnn': "Caen muchas balas chiquitas y rápidas. Esquivalas.",
 'col': "Caen columnas largas. Metete en el espacio entre ellas.",
 'cube': "Caen cubos que giran. Esquivalos.",
 'fire': "Caen bolas de fuego rápidas. Esquivalas.",
 'hail': "Cae granizo en grupos. Buscá por dónde pasar.",
 'leaf': "Caen hojas que se mueven de costado. Esquivalas.",
 'met': "Caen rocas del espacio. Esquivalas.",
 'mis': "Caen misiles que doblan hacia donde estás. Movete a último momento para que no te alcancen.",
 'mix': "Cae de todo: piedras, ladrillos, fuego y más. Esquivá todo.",
 'need': "Caen agujas finitas y muy rápidas. Esquivalas.",
 'ninja': "Caen estrellas ninja que giran. Esquivalas.",
 'rkt2': "Caen cohetes rápidos con la punta para abajo. Esquivalos.",
 'saw': "Caen sierras que giran. Esquivalas.",
 'snow': "Caen muchos copos de nieve. Esquivalos.",
 'spk': "Caen pinchos. Esquivalos.",
 'ufo': "Bajan platillos voladores que van de un lado al otro. Esquivalos.",
 'wind': "Caen piedras que el viento empuja de costado. Esquivalas.",
}
for k, g in dodge_.items(): H['d_' + k] = [dC, g + dG, "Si algo te toca."]
for k, w in (('laser', 'un láser'), ('ray', 'un rayo')):
  H['d_' + k] = [dC, "Aparece una línea roja que marca dónde va a caer " + w + ". Salí de esa línea antes de que caiga. Cada " + w.split()[1] + " que esquivás suma 1.", "Si " + ('el láser' if k == 'laser' else 'el rayo') + " cae donde estás."]

# ---------- Volar (f_) ----------
fC = HOLD + " para subir. Cuando lo soltás, bajás."
fly_ = {
 'bal': ("Manejás un globo que sube despacio. Pasá por los huecos entre los obstáculos. Cada uno que pasás suma 1.", "Si chocás un obstáculo o tocás el piso."),
 'cave': ("Volás por una cueva. Pasá por el túnel sin tocar las paredes. Cada obstáculo que pasás suma 1.", "Si chocás una pared de la cueva o tocás el piso."),
 'coins': ("Juntá las monedas que aparecen en el aire. Cada una suma 1. También hay algunas minas.", "Si chocás una mina o tocás el piso."),
 'comet': ("Vienen minas rápido. Esquivalas subiendo y bajando. Cada una que pasás suma 1.", "Si chocás una mina o tocás el piso."),
 'drone': ("Manejás un dron. Pasá por el medio de cada aro. Cada aro suma 1.", "Si pasás por afuera de un aro, chocás algo o tocás el piso."),
 'glide': ("Manejás un planeador. Pasá por el medio de cada aro. Cada aro suma 1.", "Si pasás por afuera de un aro, chocás algo o tocás el piso."),
 'heli': ("Manejás un helicóptero. Pasá por los huecos angostos entre los tubos. Cada uno suma 1.", "Si chocás un tubo o tocás el piso."),
 'jet': ("Volás con una mochila cohete. Juntá monedas y esquivá las minas. Cada moneda y cada mina que pasás suman 1.", "Si chocás una mina o tocás el piso."),
 'night': ("Volás de noche entre tubos y minas. Pasá por los huecos. Cada obstáculo que pasás suma 1.", "Si chocás un tubo o una mina, o tocás el piso."),
 'ringm': ("Pasá por el medio de los aros y esquivá las minas. Cada aro suma 1.", "Si pasás por afuera de un aro, chocás una mina o tocás el piso."),
 'sub': ("Manejás un submarino. Esquivá las minas. Cada una que pasás suma 1.", "Si chocás una mina o tocás el fondo."),
 'tight': ("Vienen tubos con huecos chicos y rápidos. Pasá por el hueco. Cada uno suma 1.", "Si chocás un tubo o tocás el piso."),
}
for k, (g, l) in fly_.items(): H['f_' + k] = [fC, g, l]

# ---------- Tocar en el momento (g_) ----------
gC = TAPANY + ". No importa dónde."
def go(show, rule, bad):
  return [gC, "En el centro aparecen " + show + " de a una, una atrás de otra. " + rule + " Cada acierto suma 1.", bad]
H['g_big'] = go("círculos grandes y chicos", "Tocá solamente cuando aparece un círculo grande.", "Si tocás cuando el círculo es chico, o si dejás pasar uno grande sin tocar.")
H['g_sml'] = go("círculos grandes y chicos", "Tocá solamente cuando aparece un círculo chico.", "Si tocás cuando el círculo es grande, o si dejás pasar uno chico sin tocar.")
H['g_grn'] = go("círculos de colores", "Tocá solamente cuando aparece el círculo verde.", "Si tocás cuando el círculo no es verde, o si dejás pasar el verde sin tocar.")
H['g_yel'] = go("figuras de colores", "Tocá solamente cuando aparece una amarilla.", "Si tocás cuando la figura no es amarilla, o si dejás pasar una amarilla sin tocar.")
H['g_star'] = go("figuras", "Tocá solamente cuando aparece una estrella.", "Si tocás cuando no es una estrella, o si dejás pasar una estrella sin tocar.")
H['g_tri'] = go("figuras", "Tocá solamente cuando aparece un triángulo.", "Si tocás cuando no es un triángulo, o si dejás pasar un triángulo sin tocar.")
H['g_x'] = go("figuras", "Tocá solamente cuando aparece una X.", "Si tocás cuando no es una X, o si dejás pasar una X sin tocar.")
H['g_nost'] = go("figuras", "Tocá cada vez que aparece una figura, menos cuando es una estrella.", "Si tocás la estrella, o si dejás pasar otra figura sin tocar.")
H['g_red'] = go("figuras de colores", "Tocá cada vez que aparece una, menos cuando es roja.", "Si tocás la roja, o si dejás pasar una de otro color sin tocar.")

# ---------- Caminos (h_) ----------
hC = DRAG + ": tu bolita sigue a tu dedo."
hG = " Mantené la bolita adentro del camino. Mientras sigas adentro, vas sumando puntos."
path_ = {
 'belt': "El camino es una cinta que baja haciendo curvas y en algunas partes se pone muy angosta.",
 'ice': "El camino es una pista de hielo ancha que baja muy rápido.",
 'lab': "El camino baja con curvas cerradas y es angosto.",
 'mount': "El camino baja con curvas largas que van de un lado al otro.",
 'nar': "El camino que baja es finito.",
 'riv': "Bajás por un río que se ensancha y se angosta.",
 'ser': "El camino baja con curvas largas y suaves.",
 'tur': "Bajás por una autopista muy rápida.",
 'wide': "El camino que baja es ancho.",
 'zig': "El camino baja y cambia de lado muy seguido.",
}
for k, g in path_.items(): H['h_' + k] = [hC, g + hG, "Si la bolita se queda afuera del camino un ratito."]

# ---------- Deslizar a un lado (k_) ----------
kC = SWIPE + "."
kL = "Si elegís el lado equivocado o si tardás demasiado."
H['k_arr'] = [kC, "En el centro aparece una flecha. Deslizá hacia el lado al que apunta. Cada acierto suma 1.", kL]
H['k_arv'] = [kC, "En el centro aparece una flecha. Deslizá hacia el lado CONTRARIO al que apunta. Cada acierto suma 1.", kL]
for k, a, b in (('cc', 'un círculo', 'un cuadrado'), ('tc', 'un triángulo', 'un círculo'), ('gc', 'una figura grande', 'una figura chica'), ('rnd', 'una figura redonda', 'una figura con puntas'), ('rv', 'algo rojo', 'algo verde'), ('yp', 'algo amarillo', 'algo violeta')):
  H['k_' + k] = [kC, "En el centro aparece una figura. Si es " + a + ", deslizá a la derecha. Si es " + b + ", deslizá a la izquierda. Cada acierto suma 1.", kL]

# ---------- Lanzamientos (l_) ----------
lC = HOLD + ": la barra amarilla de abajo se llena y se vacía. Soltá el dedo para tirar con la fuerza que marca la barra."
H['l_can'] = [lC, "Disparás una bala de cañón. Tiene que caer en el blanco rojo del piso. Cada acierto suma 1 y el blanco cambia de lugar.", "Si la bala cae corta o larga, afuera del blanco."]
H['l_bow'] = [lC, "Tirás una flecha rápida y casi recta. Tiene que caer en el blanco rojo del piso. Cada acierto suma 1 y el blanco cambia de lugar.", "Si la flecha cae afuera del blanco."]
H['l_hi'] = [lC, "Tirás una pelota que sube muy alto y cae. Tiene que caer en el blanco rojo del piso. Cada acierto suma 1 y el blanco cambia de lugar.", "Si la pelota cae afuera del blanco."]
H['l_moon'] = [lC, "Estás en la luna: hay poca gravedad y la pelota vuela muy lejos, así que soltá con poca fuerza. Tiene que caer en el blanco rojo. Cada acierto suma 1.", "Si la pelota cae afuera del blanco."]
H['l_golf'] = [lC, "Golpeás una bocha de golf que rueda por el piso. Tiene que frenar adentro del hoyo de la bandera. Cada hoyo suma 1 y el hoyo cambia de lugar.", "Si la bocha frena antes o después del hoyo."]
H['l_golf2'] = [lC, "Golpeás una bocha de golf que rueda por el piso. Los hoyos están lejos y son chicos: tiene que frenar justo adentro. Cada hoyo suma 1.", "Si la bocha frena antes o después del hoyo."]
H['l_mini'] = [lC, "Minigolf: golpeás una bocha que rueda por el piso. Los hoyos están cerca y son chiquitos, así que usá poca fuerza. Cada hoyo suma 1.", "Si la bocha frena antes o después del hoyo."]

# ---------- Momento justo (p_) ----------
pC = TAPANY + ". No importa dónde."
pS = " Si lo clavás en el medio suma 2, si no 1. Después de cada acierto la zona se achica un poquito."
time_ = {
 'bar': ("Una raya blanca va y viene por una barra. Tocá cuando la raya esté adentro de la zona verde.", "la raya está afuera de la zona verde"),
 'barf': ("Una raya blanca va y viene muy rápido por una barra. Tocá cuando esté adentro de la zona verde.", "la raya está afuera de la zona verde"),
 'barw': ("Una raya blanca va y viene despacio por una barra con una zona verde grande. Tocá cuando esté adentro de la zona.", "la raya está afuera de la zona verde"),
 'ease': ("Una raya blanca va y viene: frena en las puntas y acelera en el medio. Tocá cuando esté adentro de la zona verde.", "la raya está afuera de la zona verde"),
 'cup': ("Un vaso se llena y se vacía solo. Tocá cuando el nivel del agua esté adentro de la zona marcada.", "el agua está afuera de la zona"),
 'cupf': ("Un vaso se llena y se vacía muy rápido. Tocá cuando el nivel del agua esté adentro de la zona marcada.", "el agua está afuera de la zona"),
 'lift': ("Un ascensor sube y baja. Tocá cuando esté pasando por la franja verde.", "el ascensor está afuera de la franja verde"),
 'needle': ("Una aguja gira en un círculo. Tocá cuando pase por el tramo verde del círculo.", "la aguja está afuera del tramo verde"),
 'secs': ("Una aguja gira rápido en un círculo, como un segundero. Tocá cuando pase por el tramo verde.", "la aguja está afuera del tramo verde"),
 'prec': ("Una aguja gira despacio en un círculo, pero el tramo verde es muy chiquito. Tocá cuando la aguja esté adentro.", "la aguja está afuera del tramo verde"),
 'pend': ("Una bola se balancea como un péndulo. Tocá cuando pase por el tramo verde.", "la bola está afuera del tramo verde"),
 'pendf': ("Una bola se balancea rápido como un péndulo y el tramo verde es chico. Tocá cuando pase por el tramo verde.", "la bola está afuera del tramo verde"),
 'swing': ("Una hamaca va y viene. Tocá cuando pase por el tramo verde.", "la hamaca está afuera del tramo verde"),
 'snip': ("Una mira se mueve y la zona para acertar es chiquita. Esperá a que la mira esté adentro y tocá.", "la mira está afuera de la zona"),
 'therm': ("La línea de un termómetro sube y baja. Tocá cuando llegue a la zona verde.", "la línea está afuera de la zona verde"),
 'shr': ("Un círculo blanco se achica hacia un aro verde. Tocá cuando el círculo y el aro coincidan.", "el círculo no coincide con el aro"),
 'shrf': ("Un círculo blanco se achica rápido hacia un aro verde. Tocá cuando coincidan.", "el círculo no coincide con el aro"),
 'shrs': ("Un círculo blanco se achica despacio hacia un aro verde. Tocá cuando coincidan.", "el círculo no coincide con el aro"),
}
for k, (g, w) in time_.items(): H['p_' + k] = [pC, g + pS, "Si tocás cuando " + w + "."]

# ---------- Corredores (r_) ----------
rC = "Tocá en cualquier parte de la pantalla para saltar. Si mantenés el dedo apoyado, saltás más alto."
rG = " Tu personaje corre solo. Cada obstáculo que pasás suma 1."
run_ = {
 'box': ("Vienen cajas. Saltalas.", "Si chocás una caja."),
 'dbl': ("Vienen obstáculos altos. Tocá otra vez en el aire para dar un segundo salto.", "Si chocás un obstáculo."),
 'dturbo': ("Corrés muy rápido. Tocá otra vez en el aire para dar un segundo salto.", "Si chocás un obstáculo."),
 'float': ("Hay poca gravedad: saltás alto y caés despacio. Vienen murallas altas.", "Si chocás una muralla."),
 'giant': ("Vienen murallas altas y cajas bajas. Para las altas, mantené el dedo apoyado.", "Si chocás una muralla o una caja."),
 'hurd': ("Vienen muchas vallas bajitas. Saltalas.", "Si chocás una valla."),
 'low': ("Vienen cajas en el piso y barras en el aire. Saltá las cajas, pero cuando viene una barra no saltes: pasás por abajo.", "Si chocás una caja o si saltás contra una barra."),
 'mara': ("Viene de todo: cajas, pinchos, pozos y barras en el aire. Saltá lo que está en el piso y no saltes cuando viene una barra.", "Si chocás algo o caés en un pozo."),
 'mix': ("Vienen cajas, pinchos y pozos. Saltalos.", "Si chocás algo o caés en un pozo."),
 'moon': ("Estás en la luna: hay poca gravedad, saltás alto y flotás. Saltá los obstáculos.", "Si chocás un obstáculo."),
 'pit': ("Vienen pozos en el piso. Saltalos. Si mantenés el dedo, llegás más lejos.", "Si caés en un pozo."),
 'pitfly': ("Vienen pozos y barras en el aire. Saltá los pozos, pero cuando viene una barra no saltes: pasás por abajo.", "Si caés en un pozo o si saltás contra una barra."),
 'spk': ("Vienen pinchos en el piso. Saltalos.", "Si tocás un pincho."),
 'sprint': ("Corrés muy rápido y solo vienen cajas. Saltalas.", "Si chocás una caja."),
 'turbo': ("Corrés rápido desde el principio. Saltá los obstáculos.", "Si chocás un obstáculo."),
 'wall': ("Vienen murallas altas. Mantené el dedo apoyado para saltar bien alto.", "Si chocás una muralla."),
}
for k, (g, l) in run_.items(): H['r_' + k] = [rC, g + rG, l]

# ---------- Naves que disparan (s_) ----------
sC = DRAG + ": tu nave de abajo sigue a tu dedo y dispara sola todo el tiempo."
sL = "Si un enemigo llega abajo, si te choca o si te pega un disparo."
shoot_ = {
 'bal': "Bajan globos. Reventalos con tus disparos antes de que lleguen abajo.",
 'bom': "Bajan enemigos que tiran bombas. Esquivá las bombas y rompelos.",
 'boss': "Aparecen enemigos enormes que necesitan muchos disparos. Rompelos.",
 'bug': "Bajan insectos chiquitos y rápidos. Rompelos.",
 'fast': "Bajan enemigos chicos y muy rápidos. Rompelos.",
 'fort': "Bajan gigantes que disparan. Esquivá sus disparos y rompelos.",
 'hard': "Bajan bloques que necesitan cinco disparos cada uno. Rompelos.",
 'met': "Caen rocas. Rompelas antes de que lleguen abajo.",
 'rain': "Caen rocas en grupo. Movete para romperlas todas.",
 'rkt': "Caen cohetes finos y rápidos. Rompelos.",
 'swm': "Vienen muchos enemigos juntos. Barré de un lado al otro para romperlos.",
 'tank': "Bajan tanques que necesitan varios disparos. Rompelos.",
 'ufo': "Bajan platillos que van de un lado al otro y te disparan. Esquivá y rompelos.",
 'zz': "Bajan naves que van en zigzag y te disparan. Esquivá y rompelas.",
}
for k, g in shoot_.items(): H['s_' + k] = [sC, g + " Cada enemigo roto suma 1.", sL]
H['s_frd'] = [sC, "Bajan enemigos rojos y amigos verdes. Rompé los rojos, cada uno suma 1. A los verdes no les dispares: corré tu nave para que pasen.", "Si le pegás a un verde, o si un rojo llega abajo o te choca."]
H['s_frd2'] = [sC, "Bajan muchos amigos verdes y algunos enemigos rojos. Rompé solo los rojos, cada uno suma 1. Corré tu nave para no pegarle a los verdes.", "Si le pegás a un verde, o si un rojo llega abajo o te choca."]

# ---------- Tocar objetos (t_) ----------
tC = "Tocá con el dedo los objetos que aparecen en la pantalla."
def tap(show, rule, bad, miss=False):
  l = bad if not miss else bad
  return [tC, "Aparecen " + show + " por toda la pantalla y después se van. " + rule + " Cada acierto suma 1.", l]
H['t_big'] = tap("círculos grandes y chicos", "Tocá solamente los grandes.", "Si tocás uno chico.")
H['t_sml'] = tap("círculos grandes y chicos", "Tocá solamente los chicos.", "Si tocás uno grande.")
H['t_cir'] = tap("figuras", "Tocá solamente los círculos.", "Si tocás una figura que no es un círculo.")
H['t_sq'] = tap("figuras", "Tocá solamente los cuadrados.", "Si tocás una figura que no es un cuadrado.")
H['t_tri'] = tap("figuras", "Tocá solamente los triángulos.", "Si tocás una figura que no es un triángulo.")
H['t_st'] = tap("figuras", "Tocá solamente las estrellas.", "Si tocás una figura que no es una estrella.")
H['t_pur'] = tap("círculos de colores", "Tocá solamente los violetas.", "Si tocás uno de otro color.")
H['t_yel'] = tap("círculos de colores", "Tocá solamente los amarillos.", "Si tocás uno de otro color.")
H['t_rdrop'] = tap("gotas de colores", "Tocá solamente las rojas.", "Si tocás una gota de otro color.")
H['t_gr'] = tap("círculos verdes y rojos", "Tocá los verdes.", "Si tocás uno rojo.")
H['t_gfast'] = tap("círculos verdes y rojos", "Tocá los verdes: duran muy poco, así que rápido.", "Si tocás uno rojo.")
H['t_gry'] = tap("círculos de colores y grises", "Tocá los de color.", "Si tocás uno gris.")
H['t_face'] = tap("caras contentas y tristes", "Tocá las contentas.", "Si tocás una cara triste.")
H['t_bomb'] = tap("círculos y bombas", "Tocá todo menos las bombas.", "Si tocás una bomba.")
H['t_dots'] = tap("puntos amarillos", "Tocá cada punto antes de que desaparezca.", "Si un punto desaparece sin que lo toques.")
H['t_fast'] = tap("círculos que duran muy poco", "Tocalos antes de que se vayan.", "Si uno se va sin que lo toques.")
H['t_fly'] = tap("moscas que se mueven", "Tocalas antes de que se vayan volando.", "Si una mosca se va sin que la toques.")
H['t_bub'] = tap("burbujas que flotan", "Reventalas tocándolas antes de que se vayan.", "Si una burbuja se va sin que la revientes.")

# ---------- Paletas (w_) ----------
wC = DRAG + ": la paleta de abajo sigue a tu dedo."
pad_ = {
 'acc': "Hacé rebotar la pelota con la paleta. En cada golpe la pelota va más rápido.",
 'gr': "La pelota cae con gravedad, como en un frontón. Devolvela hacia arriba con la paleta.",
 'mini': "Tu paleta es chiquita y la pelota es rápida. Hacela rebotar.",
 'shr': "Hacé rebotar la pelota con la paleta. En cada golpe la paleta se achica; si perdés la pelota, vuelve a su tamaño.",
 'two': "Hay dos pelotas al mismo tiempo. Hacé rebotar las dos con la paleta.",
 'wild': "La pelota rebota para cualquier lado. Seguila con la paleta.",
}
for k, g in pad_.items(): H['w_' + k] = [wC, g + " Cada golpe suma 1.", "Si una pelota se te cae abajo."]

# ---------- Platos (z_) ----------
zC = TAPANY + " para disparar."
for k, g in (('a', "Cruzan platos volando de un lado al otro."), ('b', "Cruzan platos chicos y muy rápidos de un lado al otro."), ('g', "Cruzan platos grandes y lentos de un lado al otro.")):
  H['z_' + k] = [zC, g + " Tocá justo cuando un plato pasa por la línea blanca del medio. Cada plato roto suma 1.", "Si tocás cuando no hay ningún plato sobre la línea blanca."]

# ---------- Dardos (a_) ----------
aC = TAPANY + " para tirar el dardo."
for k, g in (('d1', "Una mira se mueve sola sobre la diana."), ('d2', "Una mira se mueve rápido y para todos lados sobre la diana."), ('d3', "Una mira se mueve despacio sobre la diana.")):
  H['a_' + k] = [aC, g + " Tocá cuando esté cerca del centro: el centro rojo suma 3, el anillo del medio 2 y el de afuera 1.", "Si tocás cuando la mira está afuera de la diana."]
H['a_bowl'] = ["Apoyá el dedo y movelo a la izquierda o a la derecha para apuntar. Soltá el dedo para tirar la bocha.", "Tirá la bocha hacia los pinos. Si pega en el medio suma 3, si pega cerca suma 2.", "Si la bocha pasa muy lejos de los pinos."]

# ---------- Equilibrio (b_) ----------
bC = HOLD + " y movelo a la izquierda o a la derecha para inclinar la tabla."
bal_ = {
 'a': "Hay una bola arriba de una tabla. Inclinala para que la bola no se caiga.",
 'f': "Hay una bola arriba de una tabla corta y resbalosa, y hay viento. Inclinala para que la bola no se caiga.",
 'i': "Hay una bola arriba de una tabla resbalosa: la bola casi no frena. Inclinala con cuidado para que no se caiga.",
 's': "Hay una bola arriba de una tabla cortita. Inclinala para que la bola no se caiga.",
 't': "Hay dos bolas arriba de la misma tabla. Inclinala para que no se caiga ninguna.",
 'w': "Hay una bola arriba de una tabla y el viento la empuja. Inclinala para compensar y que no se caiga.",
}
for k, g in bal_.items(): H['b_' + k] = [bC, g + " Cada segundo que aguantás suma 1.", "Si una bola se cae de la tabla."]

# ---------- Juegos sueltos ----------
H.update({
 'aim': [TAPANY + ".", "Una mira se mueve sola por la pantalla. Tocá cuando pase por el centro del blanco: el centro suma 3, cerca 2 y un poco más lejos 1.", "Si tocás cuando la mira está lejos del blanco."],
 'aster': ["Mantené el dedo apoyado del lado izquierdo de la pantalla para girar tu nave a la izquierda, o del lado derecho para girarla a la derecha. La nave dispara sola.", "Rompé las rocas que se acercan desde todos lados. Cada roca suma 1.", "Si una roca toca tu nave."],
 'balloon': [HOLD + " para inflar el globo. Cuando lo soltás, se desinfla.", "Mantené el tamaño del globo entre los dos aros. Mientras esté entre los aros, vas sumando puntos.", "Si el globo se desinfla o se infla demasiado."],
 'boat': ["Apoyá el dedo y movelo a la izquierda o a la derecha para mover el bote. Dejá el dedo apoyado para bajar el anzuelo y soltalo para subirlo.", "Enganchá un pez con el anzuelo y subilo hasta el bote. Cada pez suma 1.", "Si enganchás un erizo."],
 'brick': [DRAG + ": la paleta de abajo sigue a tu dedo.", "Hacé rebotar la pelota para romper los ladrillos de arriba. Cada ladrillo suma 1.", "Si la pelota se te cae abajo."],
 'bub': ["Apoyá el dedo y movelo para apuntar el cañón de abajo. Soltá el dedo para disparar la burbuja.", "Arriba hay burbujas de colores. Pegale a un grupo del mismo color que tu burbuja: si se juntan tres o más, explotan. Cada burbuja que explota suma 1.", "Si las burbujas bajan hasta la línea de abajo."],
 'cata': [lC, "Tirás una piedra con la catapulta. Tiene que caer en el blanco rojo. Cada acierto suma 1 y el blanco cambia de lugar.", "Si la piedra cae afuera del blanco."],
 'catch': ["Tocá la pantalla donde quieras que vaya la canasta de abajo.", "Caen cosas buenas y cosas rojas. Atrapá las buenas. Cada una suma 1.", "Si atrapás algo rojo."],
 'ceil': [HOLD + ": tu personaje sube al techo. Soltá el dedo y vuelve al piso.", "Tu personaje corre solo. Vienen pinchos en el piso y en el techo: pasá por donde no hay. Cada pincho que pasás suma 1.", "Si chocás un pincho."],
 'clock': [TAPANY + ".", "Arriba dice un tiempo, por ejemplo 3 segundos. Un cronómetro empieza a correr y después se esconde. Tocá cuando creas que llegó a ese tiempo. Si estás cerca suma 1, y si es casi justo, 2.", "Si tocás muy antes o muy después del tiempo pedido."],
 'cross': ["Tocá la pantalla para avanzar una fila hacia arriba. Deslizá el dedo a la izquierda o a la derecha para moverte de costado.", "Cruzá las calles sin que te pise un auto. Cada fila nueva que alcanzás suma 1.", "Si te pisa un auto."],
 'cups': ["Tocá el cubilete que elegís.", "Mirá debajo de qué cubilete está la bolita. Los cubiletes se mezclan; seguí con la vista el que la tiene y tocalo cuando paren. Cada acierto suma 1.", "Si tocás un cubilete que no tiene la bolita."],
 'dodge': [DRAG + ": tu bolita sigue a tu dedo.", "Bajan paredes con un hueco. Ponete justo en el hueco para pasar. Cada pared que pasás suma 1.", "Si chocás una pared."],
 'fish': [TAPANY + " para tirar el anzuelo hacia abajo.", "Nadan peces y erizos. Tirá el anzuelo cuando un pez pase por debajo. Cada pez que enganchás suma 1.", "Si enganchás un erizo."],
 'follow': [DRAG + ": tu bolita sigue a tu dedo.", "Hay una zona amarilla que se mueve de un lado al otro. Mantené tu bolita adentro de la zona. Mientras estés adentro, vas sumando puntos.", "Si te quedás afuera de la zona amarilla un ratito."],
 'grav': [TAPANY + " para dar vuelta la gravedad: tu personaje pasa del piso al techo, o del techo al piso.", "Tu personaje corre solo. Vienen pinchos en el piso y en el techo: cambiá de lado para no chocarlos. Cada pincho que pasás suma 1.", "Si chocás un pincho."],
 'hold': [TAPANY + ": cada toque infla un poco el círculo. Si no tocás, se desinfla solo.", "Mantené el tamaño del círculo entre los dos aros. Mientras esté entre los aros, vas sumando puntos.", "Si el círculo se achica o se agranda demasiado."],
 'hoop': ["Apoyá el dedo y movelo a la izquierda o a la derecha para elegir dónde tirar. Soltá el dedo para lanzar la pelota.", "Embocá la pelota en el aro. El aro se mueve, así que apuntá un poco adelante de donde está. Cada canasta suma 1, y por el medio suma 2.", "Si la pelota no entra en el aro."],
 'hop': [TAPANY + " para saltar. Si no tocás, caés.", "Pasá por los huecos entre los tubos. Cada tubo que pasás suma 1.", "Si chocás un tubo o tocás el piso."],
 'inv': [DRAG + ": tu nave de abajo sigue a tu dedo y dispara sola.", "Arriba hay filas de invasores que bajan de a poco y te disparan. Rompelos a todos. Cada invasor suma 1.", "Si te pega un disparo o si los invasores llegan abajo."],
 'jump': [DRAG + " para mover a tu personaje. Salta solo cada vez que cae sobre una plataforma.", "Subí de plataforma en plataforma. Las naranjas se mueven. Mientras más alto llegás, más puntos sumás.", "Si te caés por abajo de la pantalla."],
 'keep': ["Tocá la pelota con el dedo.", "Cada toque hace saltar la pelota para arriba. No la dejes caer. Cada toque suma 1.", "Si la pelota se cae abajo."],
 'land': ["Mantené el dedo apoyado para prender el motor de la nave: frena la caída y la empuja hacia donde está tu dedo.", "Aterrizá despacio arriba de la zona verde del piso. Cada aterrizaje bueno suma 1.", "Si aterrizás afuera de la zona verde o muy rápido."],
 'light': [TAPANY + ".", "Hay un semáforo en rojo. Tocá apenas se ponga verde. Cada acierto suma 1, y si sos rapidísimo, 2.", "Si tocás cuando está en rojo, o si tardás mucho cuando está en verde."],
 'moles': ["Tocá los topos con el dedo.", "Asoman topos de los pozos. Tocalos antes de que se escondan. Cada topo suma 1. A veces asoman bombas: esas no.", "Si tocás una bomba o si un topo se esconde sin que lo toques."],
 'orbit': [TAPANY + " para cambiar el sentido de giro de tu bolita.", "Tu bolita gira alrededor del centro. Vienen cuadrados: cambiá de sentido para no chocarlos. Cada cuadrado que pasa suma 1.", "Si te choca un cuadrado."],
 'plink': ["Tocá arriba de la pantalla, en el lugar donde quieras soltar la bola.", "La bola cae rebotando entre clavos hasta una casilla de abajo. Sumás lo que dice esa casilla.", "Si la bola cae en la casilla del 0."],
 'pong': ["Tocá la pantalla donde quieras que vaya la paleta de abajo.", "Hacé rebotar la pelota con la paleta. Cada golpe suma 1.", "Si la pelota se te cae abajo."],
 'pop': ["Tocá los círculos con el dedo.", "Aparecen círculos con un aro blanco que crece. Tocá cada círculo antes de que el aro llegue al borde. Cada uno suma 1.", "Si un aro llega al borde sin que toques su círculo."],
 'rhythm': ["Tocá la columna donde está la nota.", "Bajan notas por tres columnas. Tocá la columna de cada nota justo cuando la nota llega al marco de abajo. Cada nota suma 1, y si es justo, 2.", "Si una nota pasa el marco sin que la toques."],
 'rocket': [fC, "Manejás un cohete. Pasá por los huecos entre los tubos. Cada tubo que pasás suma 1.", "Si chocás un tubo o tocás el piso."],
 'run': [TAPANY + " para saltar.", "Tu personaje corre solo. Saltá los obstáculos que vienen. Cada uno que pasás suma 1.", "Si chocás un obstáculo."],
 'ship': ["Tocá la pantalla donde quieras que vaya tu nave. Dispara sola todo el tiempo.", "Bajan enemigos. Rompelos con tus disparos. Cada enemigo roto suma 1.", "Si un enemigo te choca o llega abajo."],
 'slice': ["Pasá el dedo por arriba de las frutas, como un cuchillo.", "Saltan frutas y bombas desde abajo. Cortá las frutas. Cada fruta suma 1.", "Si cortás una bomba, o si una fruta se cae sin que la cortes."],
 'snake': ["Mantené el dedo apoyado del lado izquierdo de la pantalla para girar a la izquierda, o del lado derecho para girar a la derecha.", "Tu culebrita avanza sola. Comé la comida: cada una suma 1 y te hace más larga.", "Si chocás contra el borde o contra tu propia cola."],
 'stack': [TAPANY + " para soltar el bloque.", "Un bloque va y viene arriba de la torre. Soltalo cuando esté justo arriba del anterior. Lo que sobresale se corta. Cada bloque suma 1, y si lo clavás justo, 2.", "Si soltás el bloque completamente afuera de la torre."],
 'timing': [TAPANY + ".", "Una barra blanca se mueve de un lado al otro. Tocá cuando pase por la zona amarilla. Cada acierto suma 1, y en el medio, 2.", "Si tocás cuando la barra está afuera de la zona amarilla."],
})

# ================= Tanda dopamina =================
def fam(prefix, control, goal, lose, extra):
  for k, e in extra.items():
    g2 = goal if not e.get('g') else e['g']
    l2 = lose if not e.get('l') else e['l']
    H[prefix + k] = [e.get('c', control), (e.get('pre', '') + ' ' + g2 + (' ' + e['x'] if e.get('x') else '')).strip(), l2]

fam('ln_', SWIPE + ": te pasás un carril para ese lado.",
    "Vas avanzando por carriles y te vienen cosas de frente. Cambiá de carril para esquivarlas. Cada obstáculo que pasás suma 1 y cada premio que agarrás también.",
    "Si chocás un obstáculo.", {
 'car': {'pre': "Manejás un auto rojo.", 'x': "Esquivá los otros autos y agarrá las estrellas."},
 'night': {'pre': "Manejás de noche y bastante rápido.", 'x': "Esquivá los autos y agarrá las estrellas."},
 'ski': {'pre': "Bajás esquiando una montaña.", 'x': "Esquivá árboles y piedras y agarrá las estrellas."},
 'surf': {'pre': "Surfeás en el mar y las olas te hacen ir más rápido y más lento.", 'x': "Esquivá las rocas y agarrá las estrellas."},
 'city': {'pre': "Corrés por la ciudad.", 'x': "Algunas vallas se cruzan de carril a último momento: mirá bien hacia dónde van."},
 'space': {'pre': "Volás en una nave por cinco carriles a toda velocidad.", 'x': "Esquivá las rocas y agarrá las gemas."},
 'lava': {'pre': "Navegás por un río de lava.", 'x': "Casi siempre hay fuego en todos los carriles menos uno: buscá el libre. Agarrá las gemas."},
 'gate': {'pre': "Bajás esquiando entre banderas.", 'g': "Cambiá de carril para pasar por todas las banderas rojas y esquivar árboles y piedras. Cada bandera y cada obstáculo esquivado suman 1.", 'l': "Si chocás un árbol o una piedra, o si dejás pasar una bandera sin agarrarla."},
 'farm': {'pre': "Manejás un carrito en la granja.", 'x': "Esquivá las cajas y agarrá las frutas."},
 'turbo': {'pre': "Manejás por cuatro carriles y vas cada vez más rápido.", 'x': "Esquivá los autos y agarrá las estrellas."},
})

fam('kn_', TAPANY + " para tirar una flecha hacia la rueda.",
    "Arriba gira una rueda. Clavá tus flechas en ella sin pegarle a las que ya están clavadas. Cada flecha suma 1. Cuando clavás todas (las rayitas blancas de abajo a la izquierda), la rueda se rompe, suma 3 y viene otra más rápida.",
    "Si tu flecha choca contra una flecha que ya estaba clavada.", {
 'log': {},
 'wob': {'x': "Esta rueda frena y acelera de golpe."},
 'flip': {'x': "Esta rueda cambia de sentido cada tanto."},
 'app': {'x': "En el borde hay manzanas: si clavás una flecha en una manzana, suma 2."},
 'pre': {'x': "La rueda ya arranca con flechas clavadas: buscá los huecos libres."},
 'fast': {'x': "Esta rueda gira muy rápido."},
 'small': {'x': "Esta rueda es chiquita y hay poco lugar."},
 'pizza': {'x': "La rueda es una pizza. En el borde hay manzanas que suman 2 si les clavás una flecha."},
 'target': {'x': "La rueda es un blanco enorme que gira despacio y necesita diez flechas."},
 'gold': {'x': "Esta rueda frena, acelera, cambia de sentido, tiene manzanas que suman 2 y ya trae una flecha clavada."},
})

fam('ri_', TAPANY + " para que la pelota salte hacia arriba. Si no tocás, se cae.",
    "Subí pasando por adentro de los aros que giran. Cada aro tiene huecos: esperá a que los huecos queden arriba y abajo de la pelota y pasá por ahí. Cada aro que pasás suma 1.",
    "Si la pelota toca la parte de color de un aro, o si se cae abajo de la pantalla.", {
 'one': {},
 'fast': {'x': "Estos aros giran muy rápido."},
 'two': {'x': "Estos aros tienen cuatro huecos más chicos."},
 'dbl': {'x': "Adentro de cada aro hay otro aro blanco que gira al revés: tenés que pasar por los huecos de los dos."},
 'wob': {'x': "Estos aros giran, frenan y vuelven a girar."},
 'alt': {'x': "Un aro gira para un lado y el siguiente para el otro."},
 'tiny': {'x': "Los huecos son chiquitos."},
 'star': {'x': "Entre aro y aro hay estrellas: agarralas, suman 1."},
 'moon': {'x': "Estás en la luna: la pelota sube alto y cae despacio."},
 'mix': {'x': "Cada aro es distinto: algunos tienen cuatro huecos y otros un aro adentro."},
})

fam('tw_', DRAG + ": todos los pisos se corren para ese lado.",
    "Tu pelota rebota sola arriba de un piso. Mové los pisos para que el hueco quede debajo de la pelota: así cae al piso siguiente. Cada piso que pasás suma 1. Si caés tres pisos seguidos sin rebotar, rompés el siguiente.",
    "Si la pelota rebota sobre una parte roja de un piso.", {
 'base': {},
 'red': {'x': "En esta torre hay mucho rojo."},
 'move': {'x': "En esta torre los pisos se mueven solos."},
 'thin': {'x': "Los huecos son angostos."},
 'fast': {'x': "La pelota cae rápido y rebota poco."},
 'wide': {'x': "Los huecos son grandes, pero hay mucho rojo."},
 'two': {'x': "Cada piso tiene dos huecos: podés caer por cualquiera."},
 'ice': {'x': "Los pisos son resbalosos: siguen moviéndose un poco después de que levantás el dedo."},
 'fire': {'g': "Tu pelota rebota sola arriba de un piso. Mové los pisos para que el hueco quede debajo de la pelota: así cae al piso siguiente. Cada piso que pasás suma 1. Si caés dos pisos seguidos sin rebotar, rompés el siguiente."},
 'storm': {'x': "Los pisos se mueven solos, hay rojo y la pelota cae rápido."},
})

fam('sm_', HOLD + ": la pelota rompe pisos hacia abajo. Levantá el dedo para que frene y rebote quieta.",
    "Los pisos giran de costado y tienen partes negras. Rompé pisos mientras abajo de la pelota haya color, y levantá el dedo cuando venga lo negro. Cada piso roto suma 1. Si rompés doce seguidos sin levantar el dedo, te prendés fuego: por un ratito rompés todo, hasta lo negro, y cada piso suma 2.",
    "Si la pelota rompe hacia abajo justo sobre una parte negra.", {
 'base': {},
 'fast': {'x': "Los pisos giran rápido."},
 'dark': {'x': "Casi medio piso es negro."},
 'rev': {'x': "Cada piso gira para el lado contrario del anterior."},
 'fire': {'g': "Los pisos giran de costado y tienen partes negras. Rompé pisos mientras abajo de la pelota haya color, y levantá el dedo cuando venga lo negro. Cada piso roto suma 1. Si rompés seis seguidos sin levantar el dedo, te prendés fuego: por un ratito rompés todo y cada piso suma 2."},
 'slow': {'x': "La pelota rompe despacio, pero los pisos giran rápido."},
 'stripe': {'x': "Los pisos tienen rayas negras: pasá por las de color."},
 'wave': {'x': "Los pisos van y vienen como una ola."},
 'big': {'x': "Los pisos tienen pocos bloques, grandes y gruesos."},
 'mix': {'x': "Cada piso gira a su propia velocidad."},
})

fam('zz_', TAPANY + " para que tu bolita doble hacia el otro lado.",
    "Tu bolita avanza sola por un camino en zigzag. Tocá en cada esquina para doblar y seguir el camino. Cada esquina suma 1 y cada gema que agarrás también.",
    "Si la bolita se sale del camino.", {
 'base': {}, 'fast': {'x': "La bolita va rápido."}, 'thin': {'x': "El camino es angosto."},
 'short': {'x': "Las esquinas vienen una atrás de otra."}, 'gem': {'x': "El camino está lleno de gemas."},
 'turbo': {'x': "Arranca despacio y acelera sin parar."}, 'snow': {'x': "Es una pista de nieve."},
 'long': {'x': "Hay rectas largas y la bolita va muy rápido."}, 'lava': {'x': "El camino pasa sobre lava."},
 'mix': {'x': "Hay esquinas seguidas y rectas largas mezcladas."},
})

fam('sj_', TAPANY + " para saltar.",
    "Estás parado arriba de una torre. Viene un bloque deslizándose de costado. Saltá para que pase por debajo tuyo y caé arriba de él: la torre crece. Cada bloque suma 1, y si saltás justo a último momento, 2.",
    "Si el bloque te choca porque no saltaste o saltaste tarde.", {
 'base': {}, 'fast': {'x': "Los bloques vienen rápido."}, 'both': {'x': "Los bloques vienen de cualquier lado: mirá de dónde."},
 'rush': {'x': "Los bloques vienen uno atrás de otro, sin descanso."}, 'var': {'x': "Cada bloque viene a una velocidad distinta y de cualquier lado."},
 'tall': {'x': "Los bloques son altos: saltá un poquito antes."}, 'cake': {'x': "La torre es una torta y cada bloque es un piso."},
 'box': {'x': "Los bloques son cajas."}, 'cloud': {'x': "Saltás sobre nubes y hay poca gravedad: subís y caés despacio."},
 'crazy': {'x': "Vienen de cualquier lado, rápido y a velocidades distintas."},
})

fam('hk_', HOLD + ": tu personaje se agarra con una soga al gancho más cercano y se balancea. Levantá el dedo para soltarte y volar.",
    "Avanzá de gancho en gancho: soltate cuando vas hacia adelante y agarrate al gancho siguiente. Cada gancho nuevo suma 1.",
    "Si caés sobre los pinchos del piso.", {
 'base': {}, 'far': {'x': "Los ganchos están lejos entre sí."}, 'star': {'x': "Hay estrellas en el aire: agarralas, suman 1."},
 'saw': {'x': "Hay sierras flotando entre los ganchos.", 'l': "Si tocás una sierra o caés sobre los pinchos del piso."}, 'move': {'x': "Los ganchos suben y bajan."},
 'moon': {'x': "Hay poca gravedad: volás alto y lento."}, 'fast': {'x': "La gravedad es fuerte y te balanceás muy rápido."},
 'short': {'x': "La soga es cortita y los ganchos están cerca."}, 'vine': {'pre': "Estás en la selva y los ganchos son lianas."},
 'mix': {'x': "Los ganchos suben y bajan, hay estrellas y hay sierras.", 'l': "Si tocás una sierra o caés sobre los pinchos del piso."},
})

fam('dk_', TAPANY + " para que la pelota pique hacia arriba. Se mueve sola de costado y rebota en las paredes.",
    "Hacé que la pelota caiga adentro del aro desde arriba. Suma 1, o 2 si entra sin tocar el aro. Después el aro aparece del otro lado.",
    "Si la pelota toca el piso.", {
 'base': {}, 'small': {'x': "El aro es chico."}, 'move': {'x': "El aro sube y baja."}, 'slide': {'x': "El aro se corre de costado."},
 'fast': {'x': "La pelota cruza de lado a lado muy rápido."}, 'heavy': {'x': "La pelota cae rápido y salta fuerte."},
 'moon': {'x': "Estás en la luna: la pelota flota."}, 'wind': {'x': "Hay viento que empuja la pelota de un lado al otro."},
 'beach': {'x': "Es una pelota de playa liviana y el aro sube y baja."}, 'mix': {'x': "El aro es chico y se mueve para todos lados, y la pelota es rápida."},
})

fam('br_', HOLD + ": un palo crece hacia arriba. Levantá el dedo y el palo cae hacia adelante como un puente.",
    "Tu personaje está sobre una columna. El palo tiene que caer justo sobre la columna de enfrente para cruzar. Cada cruce suma 1, y si la punta cae en la marca roja del medio, 2.",
    "Si el palo queda corto o se pasa de la columna de enfrente.", {
 'base': {}, 'fast': {'x': "El palo crece muy rápido."}, 'thin': {'x': "Las columnas son angostas."},
 'far': {'x': "Las columnas están lejos y son chicas."}, 'move': {'x': "La columna de enfrente se mueve."},
 'osc': {'c': HOLD + ": un palo crece y después se achica, una y otra vez. Levantá el dedo y el palo cae hacia adelante como un puente."},
 'slow': {'x': "El palo crece despacio, pero las columnas son finitas."}, 'night': {'pre': "Cruzás edificios de noche."},
 'forest': {'pre': "Cruzás entre troncos del bosque."}, 'pro': {'x': "Las columnas son finitas y se mueven, y el palo crece rápido."},
})

fam('pt_', "Tocá la columna donde está la tecla.",
    "Bajan teclas de color por columnas. Tocá cada tecla antes de que llegue abajo. Cada tecla suma 1.",
    "Si una tecla llega abajo sin que la toques, o si tocás una columna donde no hay ninguna tecla.", {
 'base': {'x': "Hay cuatro columnas."}, 'fast': {'x': "Las teclas bajan muy rápido."}, 'three': {'x': "Hay tres columnas y las teclas bajan rápido."},
 'five': {'x': "Hay cinco columnas angostas."}, 'dbl': {'x': "A veces bajan dos teclas juntas: tocá las dos."},
 'acc': {'x': "Las teclas bajan cada vez más rápido."}, 'short': {'x': "Las teclas son chiquitas y vienen muchas."},
 'neon': {'x': "Las teclas son de colores sobre fondo negro."}, 'wave': {'x': "La velocidad sube y baja."},
 'pro': {'x': "Hay cinco columnas, teclas dobles y mucha velocidad."},
})

fam('ah_', DRAG + ": tu paleta roja de abajo sigue a tu dedo.",
    "Es hockey de mesa contra una paleta violeta. Pegale al disco negro para mandarlo al arco de arriba. Cada golpe suma 1 y cada gol suma 3.",
    "Si el disco entra en tu arco, abajo.", {
 'base': {}, 'fast': {'x': "El disco va muy rápido."}, 'wide': {'x': "Los dos arcos son enormes."}, 'hard': {'x': "El rival se mueve muy rápido."},
 'two': {'x': "Hay dos discos al mismo tiempo."}, 'small': {'x': "Tu paleta es chiquita."}, 'ice': {'x': "Es sobre hielo: el disco no frena nunca."},
 'easy': {'x': "El rival es lento: aprovechá para hacer goles."}, 'spin': {'x': "El disco dobla solo en el aire."}, 'mix': {'x': "Hay dos discos rápidos que doblan en el aire."},
})

fam('gk_', DRAG + ": el arquero sigue a tu dedo.",
    "Un jugador patea desde arriba hacia tu arco. Ponete delante de la pelota antes de que llegue. Cada atajada suma 1.",
    "Si la pelota entra en el arco.", {
 'base': {}, 'fast': {'x': "Los tiros son muy rápidos."}, 'curve': {'x': "La pelota dobla en el aire."}, 'rush': {'x': "Los tiros vienen uno atrás de otro."},
 'small': {'x': "Tu arquero es chico."}, 'wide': {'x': "El arco es enorme."}, 'defl': {'x': "Algunas pelotas cambian de dirección a mitad de camino."},
 'rain': {'x': "Vienen dos o tres pelotas juntas, más lentas."}, 'lob': {'x': "Los tiros van por arriba y caen de golpe."},
 'mix': {'x': "Hay tiros rápidos, que doblan y que cambian de dirección."},
})

fam('sh_', DRAG + ": el escudo blanco gira alrededor del planeta para ese lado.",
    "Llegan rocas desde todos lados hacia el planeta del medio. Girá el escudo para ponerlo en el camino de cada roca. Cada roca que frenás suma 1.",
    "Si una roca toca el planeta.", {
 'base': {}, 'two': {'x': "Tenés dos escudos más chicos, uno de cada lado."}, 'fast': {'x': "Las rocas llegan muy rápido."},
 'spin': {'x': "Las rocas giran alrededor mientras se acercan."}, 'small': {'x': "Tu escudo es cortito."}, 'swarm': {'x': "Vienen muchas rocas chiquitas, seguidas."},
 'wave': {'x': "Las rocas vienen en grupos."}, 'sun': {'pre': "En vez de rocas llegan bolas de fuego."},
 'big': {'x': "Tu escudo es enorme, pero las rocas son muy rápidas."}, 'mix': {'x': "Tenés dos escudos y las rocas vienen en grupos girando."},
})

fam('wj_', TAPANY + " para saltar a la otra pared.",
    "Tu personaje sube solo por una pared. Bajan pinchos pegados a las paredes: saltá a la otra pared para no quedar donde están. Cada tira de pinchos que pasás suma 1.",
    "Si quedás pegado a una pared justo donde hay pinchos.", {
 'base': {}, 'fast': {'x': "Subís muy rápido."}, 'mid': {'x': "En el medio vuelan bichos: saltá cuando no estén.", 'l': "Si quedás pegado a una pared donde hay pinchos, o si chocás un bicho en el aire."},
 'gem': {'x': "En las paredes hay gemas: agarralas, suman 1."}, 'long': {'x': "Las tiras de pinchos son larguísimas."},
 'dense': {'x': "Los pinchos vienen uno atrás de otro."}, 'ice': {'x': "Las paredes son de hielo y vas cada vez más rápido."},
 'lava': {'g': "Tu personaje sube solo por una pared. Bajan llamas pegadas a las paredes: saltá a la otra pared para no quedar donde están. Cada tira de llamas que pasás suma 1.", 'l': "Si quedás pegado a una pared justo donde hay fuego."},
 'slow': {'x': "El salto es lento: saltá con tiempo."}, 'mix': {'x': "Subís rápido, hay bichos en el medio y gemas.", 'l': "Si quedás pegado a una pared donde hay pinchos, o si chocás un bicho en el aire."},
})

PILE_G = "Atajá cada pieza que cae arriba de la pila. Cada pieza suma 1. Cuando la pila se completa (los puntitos de la izquierda), suma 3 y empezás otra."
PILE_L = "Si una pieza cae al piso, o si atajás una pieza muy en la punta y la pila se cae."
fam('bg_', DRAG + ": el plato de abajo sigue a tu dedo.", PILE_G, PILE_L, {
 'burger': {'pre': "Armá una hamburguesa: caen pan, carne, lechuga, queso y tomate."},
 'pan': {'pre': "Apilá panqueques con manteca."},
 'cake': {'pre': "Armá una torta de pisos."},
 'ice': {'pre': "Apilá bochas de helado arriba del cucurucho.", 'c': DRAG + ": el cucurucho de abajo sigue a tu dedo."},
 'book': {'pre': "Apilá libros."},
 'box': {'pre': "Apilá cajas de mudanza."},
 'fast': {'pre': "Armá una hamburguesa: los ingredientes caen rápido."},
 'bad': {'pre': "Armá una hamburguesa. Entre los ingredientes caen bombas: esas no las ataques.", 'l': "Si atajás una bomba, si un ingrediente cae al piso, o si la pila se cae."},
 'wind': {'pre': "Armá una hamburguesa: el viento mueve los ingredientes de costado mientras caen."},
 'tall': {'pre': "Armá una hamburguesa altísima de catorce pisos."},
})

fam('fh_', DRAG + " para mover al bombero. Mientras tenés el dedo apoyado, tira agua hacia arriba.",
    "Se prenden fuegos en las ventanas del edificio y van creciendo. Ponete debajo de cada fuego y apagalo con el agua. Cada fuego apagado suma 1.",
    "Si un fuego crece hasta el máximo.", {
 'base': {}, 'big': {'x': "El edificio tiene cinco pisos y cinco ventanas por piso."}, 'fast': {'x': "El fuego crece muy rápido."},
 'wind': {'x': "El viento tuerce el chorro de agua para los costados."}, 'deb': {'x': "Caen ladrillos: esquivalos.", 'l': "Si un fuego crece hasta el máximo o si te pega un ladrillo."},
 'tree': {'g': "Se prenden fuego los árboles del bosque y van creciendo. Ponete debajo de cada fuego y apagalo con el agua. Cada fuego apagado suma 1."},
 'weak': {'x': "Tu manguera tira poca agua: quedate quieto debajo del fuego."}, 'many': {'x': "Aparecen fuegos muy seguido."},
 'night': {'x': "Es de noche y las ventanas tienen luz."}, 'mix': {'x': "Hay viento, caen ladrillos y el fuego crece rápido.", 'l': "Si un fuego crece hasta el máximo o si te pega un ladrillo."},
})

fam('tr_', DRAG + ": la cama elástica de abajo sigue a tu dedo.",
    "Saltan personas desde el edificio de la izquierda. Ponete debajo para que reboten en la cama (suma 1) y así lleguen a la ambulancia de la derecha (suma 2).",
    "Si alguien cae al piso.", {
 'base': {}, 'many': {'x': "Saltan muchas personas seguidas."}, 'fast': {'x': "Saltan con más velocidad hacia la derecha."},
 'small': {'x': "La cama es cortita."}, 'ball': {'g': "Saltan pelotas desde el edificio de la izquierda. Ponete debajo para que reboten en la cama (suma 1) y lleguen a la derecha (suma 2).", 'l': "Si una pelota cae al piso."},
 'wind': {'x': "El viento las empuja para atrás y para adelante."}, 'heavy': {'x': "Caen rápido: movete ligero."},
 'moon': {'x': "Estás en la luna: caen despacito."}, 'mix': {'x': "Cada persona salta a su propia velocidad."}, 'circus': {'pre': "Es un circo.", 'x': "Los que saltan son acróbatas."},
})

fam('tu_', TAPANY + " para disparar. La torreta del medio gira sola.",
    "Se acercan enemigos desde todos lados. Disparale cuando la torreta apunta hacia uno (la línea punteada muestra hacia dónde apunta). Cada enemigo roto suma 1.",
    "Si un enemigo llega hasta la torreta.", {
 'base': {}, 'fast': {'x': "La torreta gira muy rápido."}, 'rev': {'x': "Cada vez que disparás, la torreta cambia el sentido del giro."},
 'tri': {'x': "Cada disparo tira tres balas en abanico."}, 'tank': {'x': "Los enemigos violetas necesitan dos disparos."},
 'swarm': {'x': "Vienen muchos enemigos chiquitos y rápidos."}, 'slow': {'x': "La torreta gira despacio y vienen muchos enemigos."},
 'bug': {'pre': "Defendé la huerta.", 'x': "Los enemigos son bichos."}, 'ufo': {'x': "Los enemigos son platillos voladores."},
 'rock': {'x': "Vienen rocas y cada disparo tira tres balas en abanico."},
})

fam('rp_', TAPANY + " para soltar lo que cuelga de la soga.",
    "Arriba hay algo colgado de una soga que se balancea de un lado al otro. Soltalo en el momento justo para que caiga adentro del vaso que se mueve abajo. Suma 1, o 2 si cae justo en el medio.",
    "Si cae afuera del vaso.", {
 'base': {}, 'fast': {'x': "El vaso se mueve rápido: pensá dónde va a estar."}, 'small': {'x': "El vaso es angosto."},
 'long': {'x': "La soga es larga y se balancea lento."}, 'short': {'x': "La soga es corta y se balancea rapidísimo."},
 'two': {'x': "Hay dos vasos que se cruzan: vale cualquiera."}, 'wind': {'x': "El viento desvía lo que cae."},
 'moon': {'x': "Estás en la luna: todo cae despacio."}, 'candy': {'pre': "Cuelga un caramelo y abajo hay un frasco que se mueve."},
 'mix': {'x': "El gancho de arriba también se mueve."},
})

missing = [i for i in ids if i not in H]
extra = [i for i in H if i not in ids]
print('faltan', missing, 'sobran', len(extra), file=sys.stderr)
open('help.js', 'w', encoding='utf-8').write('  var HELP = ' + json.dumps(H, ensure_ascii=False) + ';\n')
