# PUNK GARDEN

Videojuego de defensa por carriles 2D, con estética Punk Cartoon Underground, la Secta K y Renovación Medieval.

## Estado (21 de noviembre de 2026)

Este repositorio contiene la documentación de diseño recuperada del proyecto, una **demo funcional de la interfaz de RADIO KLANDESTINA** y la configuración básica TypeScript/Vite. **Todavía no contiene el juego completo en Phaser**, que deberá desarrollarse a partir de la documentación.

## Prueba local

1. Instala Node.js 20 o superior.
2. Ejecuta `npm install` y `npm run dev`.
3. Abre la dirección que muestra Vite.
4. Pulsa **RADIO KLANDESTINA** para abrir el reproductor.
5. Puedes elegir archivos de audio del dispositivo sin subirlos a ningún servidor.

El botón abre y cierra el panel sin detener la reproducción. Incluye pista siguiente/anterior, aleatorio, volumen y selección de canción.

## Estructura

- `docs/`: diseño, personajes, reglas, dirección artística, arquitectura y análisis.
- `src/radioKlandestina.ts`: reproductor autónomo reutilizable para el futuro HUD de Phaser.
- `src/main.ts`: entrada de la demo de interfaz.
- `src/style.css`: estilo visual provisional.
- `public/audio/punk-radio/`: directorio para audios locales permitidos.

## Derechos y licencias

Los MP3 de **Eskorbuto** no están incluidos: se necesitan derechos de uso musical para distribuirlos con el juego. El repositorio es **público** actualmente. No publiques audios sin autorización.

## Próximas tareas

- Construir la escena de tablero del nivel 1 con Phaser 3.
- Integrar el HUD y RADIO KLANDESTINA con la escena real.
- Importar o producir recursos gráficos definitivos.
- Incorporar únicamente música que pueda distribuirse legalmente.
