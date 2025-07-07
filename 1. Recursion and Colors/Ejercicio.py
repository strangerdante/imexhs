def puede_mover_disco(disco, torre_destino):
    """    
    Reglas:
    - Se puede poner en una torre vacía
    - Debe ser más pequeño que el disco de arriba
    - No puede ser del mismo color que el disco de arriba
    """
    if len(torre_destino) == 0:  # Torre vacía
        return True
    
    tamano_disco, color_disco = disco
    tamano_arriba, color_arriba = torre_destino[-1]  # Último disco (arriba)
    
    # Verificar tamano y color
    if tamano_disco <= tamano_arriba and color_disco != color_arriba:
        return True
    
    return False


def hacer_movimiento(torres, torre_origen, torre_destino):
    """Ejecuta un movimiento de disco entre torres."""
    disco = torres[torre_origen].pop()
    torres[torre_destino].append(disco)
    return disco


def deshacer_movimiento(torres, torre_origen, torre_destino, disco):
    """Deshace un movimiento de disco (backtrack)."""
    torres[torre_destino].pop()
    torres[torre_origen].append(disco)


def probar_movimiento(torres, objetivo, movimientos_hechos, visitados, torre_origen, torre_destino):
    """Prueba un movimiento específico y continúa recursivamente."""
    disco_a_mover = torres[torre_origen][-1]
    
    if not puede_mover_disco(disco_a_mover, torres[torre_destino]):
        return None
    
    # Hacer el movimiento
    disco = hacer_movimiento(torres, torre_origen, torre_destino)
    
    # Crear nuevo movimiento
    tamano_disco = disco[0]
    nuevo_movimiento = (tamano_disco, torre_origen, torre_destino)
    nuevos_movimientos = movimientos_hechos + [nuevo_movimiento]
    
    # Llamada recursiva
    resultado = resolver_torres_hanoi(torres, objetivo, nuevos_movimientos, visitados)
    
    # Deshacer el movimiento
    deshacer_movimiento(torres, torre_origen, torre_destino, disco)
    
    return resultado


def resolver_torres_hanoi(torres, objetivo, movimientos_hechos, visitados=None):
    """
    Función recursiva que resuelve las Torres de Hanoi.
    
    torres: diccionario con torres A, B, C
    movimientos_hechos: lista de movimientos realizados hasta ahora
    visitados: set de estados ya visitados para evitar ciclos
    """
    
    if visitados is None:
        visitados = set()
    
    # CASO BASE: Si llegamos al objetivo, devolver los movimientos
    if torres == objetivo:
        return movimientos_hechos
    
    # Evitar ciclos infinitos
    estado_actual = str(torres)
    if estado_actual in visitados:
        return None
    visitados.add(estado_actual)
    
    # CASO RECURSIVO: Probar todos los movimientos posibles
    for torre_origen in ['A', 'B', 'C']:
        if len(torres[torre_origen]) == 0:
            continue
            
        for torre_destino in ['A', 'B', 'C']:
            if torre_origen == torre_destino:
                continue
            
            resultado = probar_movimiento(torres, objetivo, movimientos_hechos, visitados, torre_origen, torre_destino)
            if resultado is not None:
                visitados.remove(estado_actual)
                return resultado
    
    # Remover estado de visitados
    visitados.remove(estado_actual)
    return None


def hanoi_con_colores(numero_discos, lista_discos):
    """
    Función principal que resuelve el problema de Torres de Hanoi con colores.
    
    numero_discos: cantidad de discos
    lista_discos: lista de tuplas (tamano, color)
    
    Retorna: lista de movimientos o -1 si es imposible
    """
    
    # Casos simples
    if numero_discos == 0:
        return []
    
    if numero_discos == 1:
        tamano = lista_discos[0][0]
        return [(tamano, 'A', 'C')]
    
    # Verificar si es imposible (todos los discos del mismo color)
    colores = []
    for disco in lista_discos:
        colores.append(disco[1])
    
    if numero_discos > 1 and len(set(colores)) == 1:
        return -1  # Imposible: todos los discos son del mismo color
    
    # Estado inicial: todos los discos en torre A
    torres_inicial = {
        'A': lista_discos[:],  # Copia de la lista
        'B': [],
        'C': []
    }
    
    # Estado objetivo: todos los discos en torre C
    torres_objetivo = {
        'A': [],
        'B': [],
        'C': lista_discos[:]  # Copia de la lista
    }
    
    # Resolver usando recursión
    resultado = resolver_torres_hanoi(torres_inicial, torres_objetivo, [], None)
    
    if resultado is None:
        return -1
    else:
        return resultado


def verificar_solucion(discos_iniciales, lista_movimientos):
    """
    Verifica si una secuencia de movimientos es correcta.
    """
    if lista_movimientos == -1:
        return False
    
    # Inicializar torres
    torres = {
        'A': discos_iniciales[:],
        'B': [],
        'C': []
    }
    
    # Ejecutar cada movimiento
    for movimiento in lista_movimientos:
        tamano, origen, destino = movimiento
        
        # Verificar que el disco esté en la torre de origen
        if len(torres[origen]) == 0:
            print(f"❌ Error: No hay discos en torre {origen}")
            return False
        
        if torres[origen][-1][0] != tamano:
            print(f"❌ Error: El disco de tamano {tamano} no está arriba en torre {origen}")
            return False
        
        # Tomar el disco
        disco = torres[origen].pop()
        
        # Verificar que el movimiento sea válido
        if not puede_mover_disco(disco, torres[destino]):
            print(f"❌ Error: No se puede mover disco {disco} a torre {destino}")
            return False
        
        # Colocar el disco
        torres[destino].append(disco)
    
    # Verificar que todos los discos estén en torre C
    if len(torres['C']) != len(discos_iniciales):
        print("❌ Error: No todos los discos están en torre C")
        return False
    
    return True


