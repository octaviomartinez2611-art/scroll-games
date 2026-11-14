# Ayuda corta de cada juego: se lee en 3 segundos.
# Tres líneas: [cómo se mueve, qué tenés que hacer, cuándo perdés]. Pocas palabras, sin títulos.
import json, sys

ids = [r[0] for r in json.load(open('cat.json'))]
H = {}

def fam(pre, move, goals, lose, loses=None):
    loses = loses or {}
    for k, g in goals.items():
        H[pre + k] = [move, g, loses.get(k, lose)]

# Atrapar
fam('c_', "Arrastrá la canasta", {
    'onlygrn': "Atrapá solo lo verde", 'onlyred': "Atrapá solo lo rojo", 'notred': "Atrapá todo menos lo rojo",
    'fruit': "Atrapá las frutas", 'drop': "Atrapá todas las gotas", 'stars': "Atrapá las estrellas",
    'eggs': "Atrapá todos los huevos", 'rmb': "Atrapá solo los rombos", 'onlystar': "Atrapá solo las estrellas",
    'pizza': "Atrapá todas las pizzas", 'coins': "Atrapá las monedas", 'notsq': "Atrapá todo menos cuadrados",
    'tri': "Atrapá solo los triángulos", 'sq': "Atrapá solo los cuadrados", 'circ': "Atrapá solo los círculos",
    'fast': "Atrapá las estrellas"},
    "Perdés si atrapás otra cosa",
    {'fruit': "Perdés si atrapás una bomba", 'drop': "Perdés si cae una", 'eggs': "Perdés si cae uno",
     'stars': "Perdés si atrapás un pincho", 'pizza': "Perdés si cae una pizza", 'coins': "Perdés si atrapás una piedra",
     'fast': "Perdés si atrapás una roca", 'notred': "Perdés si atrapás algo rojo", 'notsq': "Perdés si atrapás un cuadrado"})

# Esquivar
g = {'brk': "Esquivá los ladrillos", 'saw': "Esquivá las sierras", 'wind': "Esquivá las piedras", 'acid': "Esquivá las gotas",
     'ufo': "Esquivá los platillos", 'hail': "Esquivá el granizo", 'leaf': "Esquivá las hojas", 'snow': "Esquivá los copos",
     'big': "Esquivá las piedras gigantes", 'met': "Esquivá las rocas", 'arr': "Esquivá las flechas", 'mis': "Esquivá los misiles",
     'cnn': "Esquivá las balas", 'cube': "Esquivá los cubos", 'bub': "Esquivá las burbujas", 'ninja': "Esquivá las estrellas ninja",
     'fire': "Esquivá el fuego", 'need': "Esquivá las agujas", 'bar': "Esquivá las vigas", 'spk': "Esquivá los pinchos", 'rkt2': "Esquivá los cohetes"}
g.update({'laser': "Salí de la línea roja", 'ray': "Salí de la línea roja", 'col': "Metete entre las columnas",
          'aval': "Buscá el hueco", 'mix': "Esquivá todo"})
fam('d_', "Arrastrá para moverte", g, "Perdés si algo te toca")

# Volar
fam('f_', "Mantené para subir", {
    'glide': "Pasá por los aros", 'drone': "Pasá por los aros", 'ringm': "Pasá por los aros",
    'comet': "Esquivá las minas", 'sub': "Esquivá las minas", 'bal': "Pasá por los huecos", 'night': "Pasá por los huecos",
    'tight': "Pasá por los huecos chicos", 'heli': "Pasá por los huecos", 'jet': "Juntá monedas, esquivá minas",
    'coins': "Juntá las monedas", 'cave': "No toques la cueva"}, "Perdés si chocás")

# Tocar en el momento
fam('g_', "Tocá la pantalla", {
    'grn': "Tocá cuando sale el verde", 'big': "Tocá cuando sale el grande", 'sml': "Tocá cuando sale el chico",
    'tri': "Tocá cuando sale un triángulo", 'star': "Tocá cuando sale una estrella", 'yel': "Tocá cuando sale amarillo",
    'x': "Tocá cuando sale la X", 'nost': "Tocá siempre, menos la estrella", 'red': "Tocá siempre, menos el rojo"},
    "Perdés si te equivocás")

# Caminos
fam('h_', "Arrastrá la bolita", {k: "Quedate en el camino" for k in ['mount', 'belt', 'zig', 'riv', 'ice', 'lab', 'nar', 'wide', 'ser', 'tur']}, "Perdés si te salís")

# Deslizar a un lado
fam('k_', "Deslizá a un costado", {
    'arr': "Hacia donde apunta la flecha", 'arv': "Al revés de la flecha",
    'tc': "Triángulo →  ·  círculo ←", 'cc': "Círculo →  ·  cuadrado ←", 'gc': "Grande →  ·  chico ←",
    'yp': "Amarillo →  ·  violeta ←", 'rnd': "Redondo →  ·  con puntas ←", 'rv': "Rojo →  ·  verde ←"},
    "Perdés si te equivocás o tardás")

# Lanzamientos
fam('l_', "Mantené y soltá", {
    'can': "Que caiga en el blanco", 'bow': "Que caiga en el blanco", 'hi': "Que caiga en el blanco", 'moon': "Poca fuerza: que caiga en el blanco",
    'golf': "Que frene en el hoyo", 'golf2': "Que frene en el hoyo", 'mini': "Poca fuerza: que frene en el hoyo"},
    "Perdés si no acertás")

# Momento justo
pg = {}
for k in ['bar', 'barf', 'barw', 'ease']: pg[k] = "Tocá con la raya en lo verde"
for k in ['cup', 'cupf']: pg[k] = "Tocá con el agua en la zona"
for k in ['needle', 'secs', 'prec']: pg[k] = "Tocá con la aguja en lo verde"
for k in ['pend', 'pendf']: pg[k] = "Tocá con la bola en lo verde"
for k in ['shr', 'shrf', 'shrs']: pg[k] = "Tocá cuando el círculo toca el aro"
pg.update({'lift': "Tocá con el ascensor en lo verde", 'swing': "Tocá con la hamaca en lo verde",
           'snip': "Tocá con la mira en la zona", 'therm': "Tocá con la línea en lo verde"})
fam("p_", "Tocá la pantalla", pg, "Perdés si fallás")

# Corredores
rg = {k: "Saltá los obstáculos" for k in ['moon', 'turbo', 'mix', 'float']}
rg.update({'pit': "Saltá los pozos", 'spk': "Saltá los pinchos", 'box': "Saltá las cajas", 'sprint': "Saltá las cajas",
           'hurd': "Saltá las vallas", 'dbl': "Tocá otra vez en el aire", 'dturbo': "Tocá otra vez en el aire",
           'wall': "Mantené para saltar alto", 'giant': "Mantené para saltar alto",
           'low': "Saltá cajas, no las barras", 'pitfly': "Saltá pozos, no las barras", 'mara': "Saltá todo menos las barras"})
fam('r_', "Tocá para saltar", rg, "Perdés si chocás")

# Naves que disparan
sg = {k: "Rompé a los enemigos" for k in ['fast', 'swm', 'ufo', 'zz', 'bom', 'fort', 'bug', 'rkt']}
sg.update({'bal': "Reventá los globos", 'met': "Rompé las rocas", 'rain': "Rompé las rocas", 'hard': "Rompé los bloques",
           'tank': "Rompé los tanques", 'boss': "Rompé a los gigantes", 'frd': "Rompé solo los rojos", 'frd2': "Rompé solo los rojos"})
fam('s_', "Arrastrá la nave", sg, "Perdés si te pegan o llegan abajo",
    {'frd': "Perdés si le pegás a un verde", 'frd2': "Perdés si le pegás a un verde"})

# Tocar objetos
fam('t_', "Tocá con el dedo", {
    'big': "Tocá solo los grandes", 'sml': "Tocá solo los chicos", 'cir': "Tocá solo los círculos", 'sq': "Tocá solo los cuadrados",
    'tri': "Tocá solo los triángulos", 'st': "Tocá solo las estrellas", 'pur': "Tocá solo los violetas", 'yel': "Tocá solo los amarillos",
    'rdrop': "Tocá solo las gotas rojas", 'gr': "Tocá solo los verdes", 'gfast': "Tocá los verdes, rápido", 'gry': "Tocá los de color",
    'face': "Tocá las caras contentas", 'bomb': "Tocá todo menos las bombas", 'dots': "Tocá cada punto",
    'fast': "Tocalos rápido", 'fly': "Tocá las moscas", 'bub': "Reventá las burbujas"},
    "Perdés si tocás otro",
    {'gr': "Perdés si tocás un rojo", 'gfast': "Perdés si tocás un rojo", 'gry': "Perdés si tocás un gris", 'face': "Perdés si tocás una triste",
     'bomb': "Perdés si tocás una bomba", 'dots': "Perdés si se te escapa uno", 'fast': "Perdés si se te escapa uno",
     'fly': "Perdés si se te escapa una", 'bub': "Perdés si se te escapa una"})

fam('w_', "Arrastrá la paleta", {'shr': "Que la pelota no caiga", 'wild': "Que la pelota no caiga", 'acc': "Que la pelota no caiga",
    'mini': "Que la pelota no caiga", 'gr': "Devolvé la pelota", 'two': "Que no caiga ninguna"}, "Perdés si se te cae")
fam('z_', "Tocá para disparar", {k: "Tocá con el plato en la línea" for k in 'abg'}, "Perdés si tocás sin plato")
fam('a_', "Tocá para tirar", {k: "Tocá con la mira en el centro" for k in ['d1', 'd2', 'd3']}, "Perdés si tocás afuera")
H['a_bowl'] = ["Arrastrá y soltá", "Tirá a los pinos", "Perdés si no les pegás"]
fam('b_', "Mantené y arrastrá", {k: "Que la bola no se caiga" for k in 'aiswf'}, "Perdés si se cae")
H['b_t'] = ["Mantené y arrastrá", "Que no se caiga ninguna", "Perdés si se cae una"]

S = {
 'keep': ("Tocá la pelota", "No la dejes caer", "Perdés si se cae"),
 'jump': ("Arrastrá a los costados", "Subí por las plataformas", "Perdés si caés"),
 'brick': ("Arrastrá la paleta", "Rompé los ladrillos", "Perdés si se te cae la pelota"),
 'hoop': ("Arrastrá y soltá", "Embocá en el aro", "Perdés si no entra"),
 'rocket': ("Mantené para subir", "Pasá por los huecos", "Perdés si chocás"),
 'follow': ("Arrastrá la bolita", "Quedate en lo amarillo", "Perdés si te salís"),
 'boat': ("Arrastrá y mantené", "Pescá los peces", "Perdés si enganchás un erizo"),
 'cups': ("Seguí la bolita", "Tocá su cubilete", "Perdés si fallás"),
 'grav': ("Tocá para dar vuelta", "Esquivá los pinchos", "Perdés si chocás"),
 'land': ("Mantené y arrastrá", "Aterrizá suave en lo verde", "Perdés si caés fuerte o afuera"),
 'fish': ("Tocá para tirar el anzuelo", "Pescá los peces", "Perdés si enganchás un erizo"),
 'cross': ("Tocá para avanzar", "Cruzá sin que te pisen", "Perdés si te pisa un auto"),
 'ship': ("Tocá donde querés ir", "Rompé a los enemigos", "Perdés si te chocan"),
 'timing': ("Tocá en el momento justo", "Con la barra en lo amarillo", "Perdés si tocás afuera"),
 'clock': ("Tocá la pantalla", "Cuando llega al tiempo pedido", "Perdés si errás por mucho"),
 'plink': ("Tocá arriba para soltar", "Que no caiga en el 0", "Perdés si cae en el 0"),
 'pong': ("Tocá donde querés ir", "Devolvé la pelota", "Perdés si se te cae"),
 'slice': ("Pasá el dedo", "Cortá las frutas", "Perdés si cortás una bomba"),
 'aster': ("Mantené un lado para girar", "Rompé las rocas", "Perdés si una te toca"),
 'light': ("Tocá la pantalla", "Apenas se pone verde", "Perdés si tocás en rojo"),
 'bub': ("Arrastrá y soltá", "Juntá tres del mismo color", "Perdés si llegan abajo"),
 'catch': ("Tocá donde querés ir", "Atrapá lo bueno", "Perdés si atrapás lo rojo"),
 'pop': ("Tocá los círculos", "Antes de que el aro llegue", "Perdés si el aro llega"),
 'snake': ("Mantené un lado para girar", "Comé sin chocar", "Perdés si chocás"),
 'cata': ("Mantené y soltá", "Que caiga en el blanco", "Perdés si no acertás"),
 'rhythm': ("Tocá la columna", "Cuando la nota llega al marco", "Perdés si se te pasa una"),
 'hop': ("Tocá para saltar", "Pasá entre los tubos", "Perdés si chocás"),
 'ceil': ("Mantené para ir al techo", "Esquivá los pinchos", "Perdés si chocás"),
 'aim': ("Tocá la pantalla", "Con la mira en el centro", "Perdés si tocás lejos"),
 'run': ("Tocá para saltar", "Saltá los obstáculos", "Perdés si chocás"),
 'inv': ("Arrastrá la nave", "Rompé a los invasores", "Perdés si te pegan"),
 'hold': ("Tocá para inflar", "Quedate entre los aros", "Perdés si te pasás"),
 'dodge': ("Arrastrá para moverte", "Pasá por el hueco", "Perdés si chocás"),
 'stack': ("Tocá para soltar", "Justo arriba del anterior", "Perdés si cae afuera"),
 'orbit': ("Tocá para girar al revés", "Esquivá los cuadrados", "Perdés si chocás"),
 'balloon': ("Mantené para inflar", "Quedate entre los aros", "Perdés si te pasás"),
 'moles': ("Tocá los topos", "Antes de que se escondan", "Perdés si tocás una bomba"),
}
for k, v in S.items(): H[k] = list(v)

# Tanda dopamina
fam('ln_', "Deslizá para cambiar de carril", {
    'car': "Esquivá autos, juntá estrellas", 'night': "Esquivá los autos", 'ski': "Esquivá árboles y piedras",
    'surf': "Esquivá las rocas", 'city': "Esquivá las vallas", 'space': "Esquivá rocas, juntá gemas", 'lava': "Esquivá el fuego",
    'gate': "Pasá por cada bandera", 'farm': "Esquivá cajas, juntá frutas", 'turbo': "Esquivá los autos"},
    "Perdés si chocás", {'gate': "Perdés si te salteás una"})
fam('kn_', "Tocá para tirar", {k: "Clavá en la rueda" for k in ['log', 'wob', 'flip', 'pre', 'fast', 'small', 'target']}, "Perdés si chocás otra flecha")
for k in ['app', 'pizza', 'gold']: H['kn_' + k] = ["Tocá para tirar", "Clavá y pegale a las manzanas" if k != 'pizza' else "Clavá en la pizza", "Perdés si chocás otra flecha"]
fam('ri_', "Tocá para subir", {k: "Pasá por los huecos" for k in ['one', 'fast', 'two', 'dbl', 'wob', 'alt', 'tiny', 'moon', 'mix']}, "Perdés si tocás el aro")
H['ri_star'] = ["Tocá para subir", "Pasá los aros, juntá estrellas", "Perdés si tocás el aro"]
fam('tw_', "Arrastrá los pisos", {k: "Caé por los huecos" for k in ['base', 'red', 'move', 'thin', 'fast', 'wide', 'two', 'ice', 'fire', 'storm']}, "Perdés si caés en lo rojo")
fam('sm_', "Mantené para romper", {k: "Soltá antes de lo negro" for k in ['base', 'fast', 'dark', 'rev', 'fire', 'slow', 'stripe', 'wave', 'big', 'mix']}, "Perdés si rompés negro")
fam('zz_', "Tocá para doblar", {k: "No te salgas del camino" for k in ['base', 'fast', 'thin', 'short', 'gem', 'turbo', 'snow', 'long', 'lava', 'mix']}, "Perdés si te caés")
H['zz_gem'][1] = "Doblá y juntá gemas"
fam('sj_', "Tocá para saltar", {k: "Caé arriba del bloque" for k in ['base', 'fast', 'both', 'rush', 'var', 'tall', 'cake', 'box', 'cloud', 'crazy']}, "Perdés si el bloque te choca")
fam('hk_', "Mantené y soltá", {k: "De gancho en gancho" for k in ['base', 'far', 'star', 'saw', 'move', 'moon', 'fast', 'short', 'vine', 'mix']}, "Perdés si tocás el piso",
    {'saw': "Perdés si tocás piso o sierra", 'mix': "Perdés si tocás piso o sierra"})
H['hk_vine'][1] = "De liana en liana"
fam('dk_', "Tocá para picar", {k: "Metela en el aro" for k in ['base', 'small', 'move', 'slide', 'fast', 'heavy', 'moon', 'wind', 'beach', 'mix']}, "Perdés si toca el piso")
fam('br_', "Mantené y soltá", {k: "Que el palo llegue justo" for k in ['base', 'fast', 'thin', 'far', 'move', 'osc', 'slow', 'night', 'forest', 'pro']}, "Perdés si queda corto o largo")
fam('pt_', "Tocá las teclas", {k: "Tocalas antes de que bajen" for k in ['base', 'fast', 'three', 'five', 'dbl', 'acc', 'short', 'neon', 'wave', 'pro']}, "Perdés si se escapa una")
fam('ah_', "Arrastrá tu paleta", {k: "Hacé goles arriba" for k in ['base', 'fast', 'wide', 'hard', 'two', 'small', 'ice', 'easy', 'spin', 'mix']}, "Perdés si te hacen gol")
fam('gk_', "Arrastrá al arquero", {k: "Atajá todo" for k in ['base', 'fast', 'curve', 'rush', 'small', 'wide', 'defl', 'rain', 'lob', 'mix']}, "Perdés si te hacen gol")
fam('sh_', "Arrastrá para girar", {k: "Frená las rocas con el escudo" for k in ['base', 'two', 'fast', 'spin', 'small', 'swarm', 'wave', 'big', 'mix']}, "Perdés si tocan el planeta")
H['sh_sun'] = ["Arrastrá para girar", "Frená el fuego con el escudo", "Perdés si toca el planeta"]
fam('wj_', "Tocá para saltar", {k: "Esquivá los pinchos" for k in ['base', 'fast', 'gem', 'long', 'dense', 'ice', 'slow']}, "Perdés si chocás")
H['wj_mid'] = ["Tocá para saltar", "Esquivá pinchos y bichos", "Perdés si chocás"]
H['wj_mix'] = ["Tocá para saltar", "Esquivá pinchos y bichos", "Perdés si chocás"]
H['wj_lava'] = ["Tocá para saltar", "Esquivá el fuego", "Perdés si te quemás"]
fam('bg_', "Arrastrá el plato", {k: "Apilá lo que cae" for k in ['burger', 'pan', 'cake', 'ice', 'book', 'box', 'fast', 'wind', 'tall']}, "Perdés si se cae algo")
H['bg_bad'] = ["Arrastrá el plato", "Apilá y esquivá las bombas", "Perdés si atrapás una bomba"]
fam('fh_', "Arrastrá y mantené", {k: "Apagá el fuego" for k in ['base', 'big', 'fast', 'wind', 'deb', 'tree', 'weak', 'many', 'night', 'mix']}, "Perdés si un fuego crece mucho",
    {'deb': "Perdés si te pega un ladrillo", 'mix': "Perdés si te pega un ladrillo"})
fam('tr_', "Arrastrá la cama", {k: "Que reboten hasta la ambulancia" for k in ['base', 'many', 'fast', 'small', 'wind', 'heavy', 'moon', 'mix', 'circus']}, "Perdés si cae uno")
H['tr_ball'] = ["Arrastrá la cama", "Que reboten hasta la otra punta", "Perdés si cae una"]
fam('tu_', "Tocá para disparar", {k: "Disparales cuando apuntás" for k in ['base', 'fast', 'rev', 'tri', 'tank', 'swarm', 'slow', 'bug', 'ufo', 'rock']}, "Perdés si llegan al centro")
fam('rp_', "Tocá para soltar", {k: "Que caiga en el vaso" for k in ['base', 'fast', 'small', 'long', 'short', 'two', 'wind', 'moon', 'candy', 'mix']}, "Perdés si cae afuera")

missing = [i for i in ids if i not in H]
extra = [i for i in H if i not in ids]
longest = sorted(((sum(len(x.split()) for x in v), k) for k, v in H.items() if k in ids), reverse=True)[:5]
print('faltan', missing, 'sobran', len(extra), 'más largos', longest, file=sys.stderr)
open('help.js', 'w', encoding='utf-8').write('  var HELP = ' + json.dumps({k: v for k, v in H.items() if k in ids}, ensure_ascii=False) + ';\n')
