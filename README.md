# PUNK GARDEN

Videojuego 2D de defensa por carriles, estética Punk Cartoon Underground.

## Fase 2 — Nivel 1 programado (prototipo)

El repositorio ya contiene una escena jugable en **Phaser 3.90.0** y **TypeScript**, con gráficos geométricos provisionales. **La compilación y la jugabilidad todavía requieren validación real.**

### Implementado
- Tablero de 5 carriles x 9 columnas y colocación de unidades con clic o toque.
- Planta básica generadora: coste 50, produce 25 hojas cada 8 segundos. Recolección manual; las hojas caducan tras 10 segundos.
- Punks: piedrero (50 hojas, doble disparo), molotov (100 hojas, daño en área), escudo (75 hojas, bloqueo).
- Zombis Secta K: básico, rápido, cono y policía (estadísticas de prototipo).
- Cinco oleadas temporizadas, victoria al eliminar todos los enemigos, derrota si un zombi atraviesa un carril sin barricada.
- Una barricada de emergencia de un uso por carril.
- Pausa, reanudación, reinicio y guardado local de victoria.
- Botón **RADIO KLANDESTINA** con controles de reproducción y carga de archivos de audio desde el dispositivo.

### Iniciar el proyecto

Requiere Node.js 20.19+ o 22.12+.

```bash
npm install
npm run dev
```

Abre la URL local indicada por Vite. Para compilar: `npm run build`. Se ha añadido un flujo de GitHub Actions que intenta compilar tras cambios en `main`.

### Controles
1. Pulsa **EMPEZAR NIVEL 1**.
2. Selecciona una unidad en las cartas inferiores.
3. Haz clic en una casilla libre del tablero para colocarla.
4. Haz clic en las hojas que aparecen sobre las plantas para recoger el recurso.
5. Utiliza **PAUSA** para detener o reanudar el combate.
6. Abre **RADIO KLANDESTINA** para escuchar música en paralelo.

### Estructura

- `src/GameScene.ts`: escena Phaser y simulación del nivel 1.
- `src/main.ts`: arranque Phaser y montaje de la radio.
- `src/radioKlandestina.ts`: reproductor.
- `src/style.css`: interfaz HUD y reproductor.
- `docs/`: documentos originales del diseño del juego.

### Alcance y pendientes

- Los personajes y escenarios finales todavía no están integrados: se representan mediante formas provisionales.
- Las reglas de balance y los valores de combate no fijados en la documentación se han propuesto provisionalmente en el código.
- Añadir la selección previa de equipo, animaciones individuales de zombis, pistolas y escopetas de goma para los polis, ratas ambientales, efectos, sonidos y el resto de los niveles.
- Ajustar oleadas y tiempos con pruebas de juego reales.

### Derechos musicales

El repositorio es público. **No contiene archivos MP3 de Eskorbuto** ni otros audios comerciales; no deben distribuirse sin los permisos correspondientes. El reproductor permite cargar archivos personales desde el navegador para pruebas privadas.
