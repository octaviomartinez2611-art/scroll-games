# Achica el JavaScript de la página (terser) para que baje y arranque más rápido.
# Si no hay internet o terser falla, deja la página como estaba.
import subprocess, sys, os, tempfile
def mini(path):
    s = open(path, encoding='utf-8').read()
    a = s.index('<script>') + 8; b = s.rindex('</script>')
    d = tempfile.mkdtemp(); src = os.path.join(d, 'in.js'); out = os.path.join(d, 'out.js')
    open(src, 'w', encoding='utf-8').write(s[a:b])
    try:
        subprocess.run(['npx', '--yes', 'terser@5.31.6', src, '-c', 'passes=2', '-m', '-o', out], check=True, capture_output=True, timeout=300)
        js = open(out, encoding='utf-8').read()
    except Exception as e:
        print('minify: no se pudo achicar', path, str(e)[:120]); return
    js = js.replace('</script', '<\\/script')
    open(path, 'w', encoding='utf-8').write(s[:a] + js + s[b:])
    print('minify:', path, len(s), '->', len(s[:a] + js + s[b:]))
for p in sys.argv[1:]: mini(p)
