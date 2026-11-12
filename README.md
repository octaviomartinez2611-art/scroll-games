# Swipe Arcade

Feed de minijuegos para deslizar, estilo TikTok.

- `public/index.html`: la app entera (juegos, feed con algoritmo, amigos, chat, perfil).
- `netlify/functions/api.mjs`: servidor (cuentas con usuario y PIN, estado del jugador, amigos, mensajes, reportes). Guarda todo en Netlify Blobs.
- Variable de entorno `ADMIN_CODE` en Netlify: código para activar el panel de administrador (no va en el repo).
