# PUNK GARDEN · Análisis de los siete documentos

Revisión del archivo `Punk_Garden_Documentos.zip` · 21 de noviembre de 2026.

## 00 · Índice de documentos

El índice cubre los seis documentos temáticos y distingue el estado del diseño, el prototipo geométrico y los sprites. El estado del prototipo es el que declara el índice. El ZIP contiene documentación en Markdown. Para verificar la implementación hacen falta el código o una versión jugable.

El índice propone trabajar en los sprites, el nivel 1, la selección y la facción R. Para validar el diseño, conviene probar primero una partida completa con arte provisional y un ciclo de selección, combate y resultado. La integración de R puede avanzar cuando estén definidos sus niveles de entrada.

## 01 · Visión general

Define una defensa por carriles en 2D para navegador con Phaser 3, TypeScript y 1280 × 720. La identidad Punk Cartoon Underground, la economía de hojas y las facciones Secta K y Renovación Medieval dan una base común a diseño, arte y programación.

La visión debería recoger el alcance ya acordado fuera del ZIP: campaña de 10 niveles, partidas de 5 a 10 minutos y una barricada de emergencia por carril. Falta definir las reglas de esa barricada y precisar qué diferencias de control, composición de oleadas y comportamiento hacen reconocible a PUNK GARDEN como juego propio.

## 02 · Mecánicas de combate

Se definen cinco carriles, recolección manual de hojas, aviso visual a los 8 s y desaparición a los 10 s. Hay tres plantas generadoras, siete defensores con costes y habilidades, y una rata explosiva con 10 s de preparación.

| Planta | Coste | Producción | Media teórica por segundo |
|---|---:|---:|---:|
| Básica | 50 | 25 cada 8 s | 3,125 |
| Rápida | 75 | 25 cada 6 s | 4,167 |
| Grande | 100 | 50 cada 10 s | 5 |

Con primera producción tras el intervalo indicado, recogida total y sin pérdidas, las plantas recuperan su coste a los 16, 18 y 20 s respectivamente. Para ajustar la apertura faltan las hojas iniciales, el tiempo hasta el primer enemigo, las columnas jugables y las reglas de ocupación. En el nivel 1 solo está documentada la planta básica. Si la partida empieza sin hojas ni fuentes adicionales, el jugador no puede comprarla.

Los defensores aún necesitan vida, daño, cadencia, alcance, recarga de colocación y parámetros de sus poderes. La rata requiere definir qué significa «radio de 6 cuadrantes» con un patrón de casillas, el daño y el tratamiento de los bordes. El cambio de carril necesita reglas para carriles extremos y para objetivos junto a una barricada. La derrota al llegar al extremo izquierdo debe sincronizarse con la barricada de emergencia acordada. Faltan su activación, efecto, condición de consumo y comportamiento ante varios enemigos simultáneos.

## 03 · Enemigos

La Secta K tiene un básico de 100 PV, un rápido de 70 PV y un jefe especial con 300–1200 PV y cinco habilidades listadas. Renovación Medieval tiene diez perfiles, con un Jefe Supremo R de 1500 PV y unidades de apoyo, control y ataque. La velocidad aparece como un número sin unidad. Hace falta fijar si representa un multiplicador o una velocidad absoluta, así como el valor base. También faltan daños, cadencias, alcances y duraciones.

La jefa suprema de la Secta K, según la decisión previa, es la **Señora K**. El ZIP usa el nombre «Zombie K» para un jefe y para la variante débil del nivel 1. Queda pendiente aclarar si esa variante es una aparición de la Señora K o un enemigo distinto. **La Descerebrada R es una unidad regular** con habilidad de apoyo. Los niveles de aparición de las jefaturas siguen pendientes. Las cinco habilidades de K aparecen como una lista sin asignación por nivel.

Antes de programar la IA de niveles altos, hay que definir qué hace débil a un carril, cómo se resuelven empates y qué señales anticipan la coordinación al jugador. «Reduce moral» también requiere un efecto concreto sobre el juego o una revisión de la descripción.

## 04 · Progresión y niveles

El documento define tres defensores disponibles en niveles 1–2, añade Cadena en 3–4 y deja el catálogo completo a partir del 5. La fila «10+» conviene concretarla como «10» al documentar la campaña acordada de diez niveles. Con tres defensores desbloqueados al inicio, tres es el único tamaño documentado de selección que permite jugar esos niveles. El cuarto espacio necesita una regla de desbloqueo o selección.

El nivel 1 es un ejemplo con cinco oleadas, básicos K y un Zombie K débil anunciado para la última. La frase «solo zombies básicos» necesita indicar expresamente la excepción de la oleada final. Quedan por fijar los tiempos y la composición de cada oleada, los encuentros de los otros nueve niveles, la entrada de Renovación Medieval y las apariciones de jefes.

Las botellas de trivia y los cuatro poderes están enumerados. Faltan frecuencia, requisitos de activación, respuesta correcta o incorrecta, duración, límite de uso y comportamiento del combate durante la pregunta. Se pueden probar después de medir la duración y la dificultad de un nivel sin trivia.

## 05 · Dirección artística

El documento define contornos gruesos, siluetas exageradas, colores ácidos y una interfaz inspirada en fanzines. Las facciones se distinguen por naranja y K frente a azul y R. Conviene conservar también una diferencia de forma para reconocerlas en movimiento. Los indicadores de hojas, oleada y selección necesitan legibilidad a la escala real de partida.

Están recogidos reposo, ataque, daño y muerte. Para producir las primeras fichas de sprites falta contemplar el avance de los zombis, definir anclajes, escala, orientación, duración de fotogramas y relación entre cuadro visible y zona de impacto. Las referencias visuales se mencionan en el Markdown y no vienen incluidas en este ZIP. Queda pendiente contrastar los sprites con ellas.

## 06 · Tecnología y arquitectura

Las cinco escenas cubren arranque, menú, selección, combate y resultado. Phaser 3, TypeScript, resolución base de 1280 × 720 y escalado FIT + Center son decisiones documentadas. La UI menciona «paquetes», un término cuyo contenido debe aclararse para que diseño e implementación usen el mismo nombre.

Conviene modelar niveles, defensores, enemigos y oleadas como datos editables. Para la partida inicial, el paso explícito del nivel y del equipo elegido entre escenas simplifica el reinicio. Faltan la versión exacta de Phaser, la estructura del proyecto, el formato de oleadas, las unidades de movimiento, las reglas de detección entre carriles y el comportamiento con ratón y toque. Se debe probar que reiniciar o cambiar de escena limpia los temporizadores de hojas, ataques y oleadas.

## Orden propuesto para el prototipo

1. Completar la ficha del nivel 1 con economía inicial, cinco oleadas, datos de combate, barricadas y condición exacta de victoria.
2. Resolver la identidad del Zombie K de la última oleada y programar el bucle desde selección hasta victoria o derrota con sprites provisionales.
3. Probar que el arranque permite desplegar defensas, que cada barricada se comporta según la regla acordada y que la partida se mantiene entre 5 y 10 minutos.
4. Completar la matriz de los diez niveles con desbloqueos, facciones y jefaturas. Validar las referencias visuales e incorporar los sprites definitivos conforme se estabilicen las escalas y animaciones.