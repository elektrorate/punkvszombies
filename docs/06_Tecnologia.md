# PUNK GARDEN · Tecnología y arquitectura

## Plataforma y herramientas

- **Motor**: Phaser **3.90.0**, con la versión fijada en el proyecto. La familia Phaser 3 ya estaba elegida en la ficha y cubre el alcance del prototipo. Phaser 4 está disponible. Cualquier migración se puede evaluar una vez jugable el primer nivel.
- **Lenguaje y compilación**: TypeScript en modo estricto y Vite. El juego se distribuye como una compilación web estática. El prototipo funciona sin servidor propio, cuenta de usuario ni instalación.
- **Pantalla**: resolución lógica de **1280 × 720** y orientación horizontal. Phaser escala el tablero con `FIT` y `CENTER_BOTH`. Las pruebas del prototipo incluyen Safari en iPhone, Chrome en Android y navegadores de escritorio.
- **Interfaz**: Phaser dibuja la azotea, el tablero, las unidades, los proyectiles y los efectos. HTML y CSS gestionan el menú, las cartas de punks, las hojas, el indicador de oleada y la pausa. En pantallas pequeñas, el HUD adapta su distribución y conserva botones de tamaño táctil.
- **Controles**: seleccionar una carta y tocar o hacer clic en una celda. Los botones de interfaz consumen su interacción y las posiciones de entrada se traducen a coordenadas lógicas del tablero.
- **Progreso local**: guardar niveles desbloqueados y ajustes en el navegador con `localStorage` cuando esté disponible. La partida puede iniciarse aunque el guardado esté deshabilitado.

Phaser concentra escenas, entrada, animación y renderizado en una misma API. PixiJS cubriría el renderizado y exigiría implementar o integrar más piezas del ciclo de juego. Pygame y Arcade encajan mejor en un prototipo de escritorio.

## Simulación del tablero

- **Cuadrícula**: matriz de 5 carriles por un número configurable de columnas. Cada celda registra su terreno y su ocupante. Las plantas generadoras y los punks se gestionan como ocupantes según la ficha de combate. Cada carril mantiene el estado de su barricada de emergencia, de un solo uso.
- **Combate**: los enemigos entran por la derecha y se indexan por carril, ordenados por posición horizontal. Un atacante busca un enemigo vivo dentro de su alcance y en la dirección de ataque. Los proyectiles comprueban el tramo recorrido desde la posición anterior para detectar el primer objetivo que cruzan. Los ataques de área consultan solo los carriles y posiciones afectados.
- **Cruce del límite**: la barricada se activa una vez al llegar un enemigo al extremo izquierdo de su carril. Cuando ese carril ya ha consumido su barricada, un nuevo cruce provoca la derrota.
- **Reloj**: la simulación avanza en pasos fijos de 1/60 s. Oleadas, recargas, estados temporales y generación y caducidad de hojas usan ese mismo reloj. Pausar el juego o pasar la pestaña a segundo plano detiene el avance. Al reanudar, se descarta el tiempo transcurrido fuera de la partida.
- **Estados**: separar la acción de cada enemigo (avanzar, atacar, caer) de sus efectos temporales (por ejemplo, aturdimiento o aceleración) y de su equipo. Un casco, un escudo o un carrito pueden tener su propia resistencia y cambiar el comportamiento cuando se rompen.
- **Datos**: unidades, oleadas y niveles viven en configuraciones tipadas independientes de Phaser. La campaña tiene 10 niveles y partidas de referencia de 5 a 10 minutos. Las reglas de la simulación viven en TypeScript y la escena representa su estado.

## Escenas e interfaz

| Escena | Función |
|--------|---------|
| BootScene | Carga inicial de recursos. |
| MenuScene | Entrada al juego y selección de nivel. |
| SelectionScene | Selección de punks antes del combate. |
| GameScene | Representación del combate y conexión del HUD con la simulación. |
| GameOverScene | Resultado de victoria o derrota y opciones para reintentar o continuar. |

Cada nivel recibe su configuración y el equipo elegido mediante `scene.start()`. Los ajustes compartidos pueden pasar por `this.registry`. La partida en curso pertenece a la simulación del nivel. Las transiciones pueden usar tinta, papel rasgado, spray o glitch.

## Animación y efectos

Usar atlas de texturas con ciclos cortos para caminar, atacar y caer. Montar accesorios como cono, casco y escudo en piezas independientes para cambiar su aspecto o desprenderlos sin reiniciar el ciclo del personaje. Usar partículas y tweens para impactos y transiciones. Probar una animación articulada completa con un jefe cuando el combate ya esté validado y decidir entonces si merece un flujo de producción específico.

## Audio

Primera prueba con una pista musical en bucle, efectos de combate y control de silencio. El audio se habilita tras una interacción del jugador. Para el audio por capas, preparar dos pistas con el mismo tempo y bucle, programarlas con el mismo instante de inicio del `AudioContext` y subir la ganancia de la pista intensa durante la oleada.

## Primer nivel jugable

Probar un tablero de cinco carriles con una planta que genera hojas, un punk a distancia, un defensor de bloqueo, el Zombi K básico y el Zombi K del cono. El nivel debe permitir colocar unidades con toque o ratón, recoger hojas, combatir varias oleadas, consumir una barricada por carril y mostrar victoria o derrota. Probar también pausa, reanudación y repetición del nivel antes de extender la campaña y añadir a Renovación Medieval y a los jefes.

## Referencias

- [Phaser 3.90.0](https://www.phaser.io/download/release/v3.90.0)
- [Escalado de Phaser](https://docs.phaser.io/phaser/concepts/scale-manager)
- [Audio de Phaser](https://docs.phaser.io/phaser/concepts/audio)
- [Programación de audio con Web Audio](https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode/start)