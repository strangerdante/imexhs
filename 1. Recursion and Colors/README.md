# Torres de Hanoi con Colores

## Descripción del Problema

Este proyecto resuelve una variación del clásico problema de las Torres de Hanoi, donde se agrega la restricción de **colores** a los discos. Los discos no solo deben seguir la regla de tamaño tradicional, sino que también deben cumplir con restricciones de color.

## Reglas del Juego

1. **Regla de Tamaño**: Un disco solo puede colocarse sobre otro disco de mayor tamaño
2. **Regla de Color**: Un disco NO puede colocarse sobre otro disco del mismo color
3. **Objetivo**: Mover todos los discos de la torre A a la torre C
4. **Restricción**: Solo se puede mover un disco a la vez, y solo el disco superior de cada torre

## Estructura del Código

### Funciones Principales

- `hanoi_con_colores(numero_discos, lista_discos)`: **Función principal** que resuelve el problema de Torres de Hanoi con colores (interfaz pública)
- `verificar_solucion(discos_iniciales, lista_movimientos)`: **Función principal** independiente que verifica la validez de una secuencia de movimientos

### Funciones Auxiliares

- `resolver_torres_hanoi(torres, objetivo, movimientos_hechos, visitados)`: Motor del algoritmo recursivo con backtracking (corazón del algoritmo)
- `probar_movimiento(torres, objetivo, movimientos_hechos, visitados, torre_origen, torre_destino)`: Prueba un movimiento específico y continúa la recursión
- `puede_mover_disco(disco, torre_destino)`: Valida si un movimiento es válido según las reglas del juego
- `hacer_movimiento(torres, torre_origen, torre_destino)`: Ejecuta un movimiento entre torres
- `deshacer_movimiento(torres, torre_origen, torre_destino, disco)`: Deshace un movimiento (backtracking)

## Formato de Entrada

Los discos se representan como tuplas `(tamaño, color)`:
- `tamaño`: Número entero (1 = más pequeño, números mayores = más grandes)
- `color`: String que representa el color del disco

## Formato de Salida

- **Éxito**: Lista de movimientos en formato `(tamaño_disco, torre_origen, torre_destino)`
- **Imposible**: Retorna `-1` si no hay solución

## Cómo Ejecutar

```bash
python Ejercicio.py
```

El programa incluye ejemplos predefinidos que se ejecutan automáticamente y muestran:
- Los discos iniciales
- La secuencia de movimientos necesaria
- Verificación de que la solución es correcta

## Uso Detallado

### 1. Uso Básico - Función Principal

```python
from Ejercicio import hanoi_con_colores

# Definir los discos: (tamaño, color)
discos = [(3, 'verde'), (2, 'rojo'), (1, 'azul')]

# Resolver el problema
resultado = hanoi_con_colores(3, discos)

# Verificar el resultado
if resultado == -1:
    print("❌ Imposible resolver")
else:
    print(f"✅ Solución encontrada: {resultado}")
```

### 2. Interpretación de Resultados

Los movimientos se representan como tuplas `(tamaño_disco, torre_origen, torre_destino)`:

```python
# Ejemplo de resultado:
resultado = [(1, 'A', 'C'), (2, 'A', 'B'), (1, 'C', 'B'), (3, 'A', 'C'), (1, 'B', 'A'), (2, 'B', 'C'), (1, 'A', 'C')]

# Interpretación:
# (1, 'A', 'C') = Mover disco de tamaño 1 desde torre A hacia torre C
# (2, 'A', 'B') = Mover disco de tamaño 2 desde torre A hacia torre B
# ... y así sucesivamente
```

### 3. Casos de Uso Comunes

#### Caso 1: Problema Sencillo (2 discos)
```python
discos = [(2, 'rojo'), (1, 'azul')]
resultado = hanoi_con_colores(2, discos)
# Resultado: [(1, 'A', 'B'), (2, 'A', 'C'), (1, 'B', 'C')]
```

#### Caso 2: Problema Complejo (3 discos)
```python
discos = [(3, 'verde'), (2, 'rojo'), (1, 'azul')]
resultado = hanoi_con_colores(3, discos)
# Resultado: Lista más larga de movimientos
```

#### Caso 3: Problema Imposible
```python
discos = [(2, 'rojo'), (1, 'rojo')]  # Mismo color
resultado = hanoi_con_colores(2, discos)
# Resultado: -1 (imposible)
```

### 4. Verificación de Soluciones

```python
from Ejercicio import verificar_solucion

discos_iniciales = [(2, 'rojo'), (1, 'azul')]
movimientos = [(1, 'A', 'B'), (2, 'A', 'C'), (1, 'B', 'C')]

if verificar_solucion(discos_iniciales, movimientos):
    print("✅ Solución válida")
else:
    print("❌ Solución inválida")
```
