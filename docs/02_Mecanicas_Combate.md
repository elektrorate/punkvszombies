# Punk Garden - Mecánicas de Combate

## Grid
- 5 carriles horizontales
- Zombies avanzan desde la derecha
- Punks y plantas se colocan en el lado izquierdo/centro

## Recurso: Hojas
- Se generan mediante plantas colocadas en el grid
- Recolección manual (clic)
- Si no se recolectan en 10 segundos, desaparecen (parpadean a los 8s)

### Plantas
| Tipo | Costo | Producción | Tiempo |
|------|-------|------------|--------|
| Básica | 50 | 25 hojas | cada 8s |
| Rápida | 75 | 25 hojas | cada 6s |
| Grande | 100 | 50 hojas | cada 10s |

## Punks (defensores)
Se seleccionan antes de cada nivel. Más opciones se desbloquean según el nivel.

| Punk | Costo | Poder único |
|------|-------|-------------|
| Lanzador de piedras | 50 | Doble disparo |
| Lanzador de molotovs | 100 | Explosión grande |
| Punk cuerpo a cuerpo | 75 | Escudo |
| Punk con cadena | 125 | Barrido |
| Punk con lanzallamas | 150 | Llama continua |
| Punk de las medias | 100 | Medias fétidas (cambia carril de zombies) |
| Punk borracho | 125 | Movimiento loco y ataques aleatorios |

## Unidades especiales
- **Rata explosiva**: Se coloca, crece 10 segundos y explota en radio de 6 cuadrantes.

## Condiciones
- **Victoria**: Sobrevivir todas las oleadas del nivel
- **Derrota**: Un zombie llega al final del carril (lado izquierdo)