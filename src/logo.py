# Logo de Toki: letras hechas con trazos gruesos y redondos, cada una de un color de los juegos,
# con su base sólida más oscura corrida hacia abajo (el mismo volumen tipo juguete de la app). Sin degradados ni sombras.
L = [("#ff4d6d", "#a3203c", '<path d="M24 12V50Q24 64 40 64"/><path d="M10 30H40"/>'),
     ("#ffd23f", "#a37f0e", '<circle cx="76" cy="45" r="18"/>'),
     ("#3ddc84", "#1d8a4e", '<path d="M114 10V64"/><path d="M140 28L117 47L142 64"/>'),
     ("#c77dff", "#7a3fb0", '<path d="M168 34V64"/><circle cx="168" cy="13" r="8.5" stroke="none" fill="currentColor"/>')]
def svg(cls="logo", label="Toki"):
    base = "".join('<g color="%s" stroke="%s" transform="translate(0 6)">%s</g>' % (d, d, p) for c, d, p in L)
    top = "".join('<g color="%s" stroke="%s">%s</g>' % (c, c, p) for c, d, p in L)
    return ('<svg class="%s" viewBox="0 0 186 82" role="img" aria-label="%s"><g fill="none" stroke-width="16" stroke-linecap="round" stroke-linejoin="round">%s%s</g></svg>' % (cls, label, base, top))
if __name__ == "__main__":
    open("logo.svg", "w").write(svg().replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ', 1))
    print(svg())
