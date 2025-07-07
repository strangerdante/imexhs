# FileProcessor - Procesador de Archivos en Python

## Descripción

`FileProcessor` es una clase de Python diseñada para manejar operaciones de procesamiento de archivos y datos. Incluye funcionalidades para trabajar con archivos CSV, DICOM y operaciones de directorio, con un sistema completo de logging y manejo de errores.

## Características Principales

- **Listado de Directorios**: Lista contenidos de carpetas con información detallada
- **Análisis de CSV**: Lee archivos CSV y genera estadísticas completas
- **Procesamiento DICOM**: Lee archivos médicos DICOM y extrae imágenes
- **Sistema de Logging**: Registra todas las operaciones y errores
- **Manejo de Errores**: Control robusto de excepciones

## Instalación de Dependencias

```bash
pip install -r requirements.txt
```

## Uso Básico

```python
from Ejemplo import FileProcessor

# Crear instancia del procesador
processor = FileProcessor(".", "mi_log.log")

# Listar contenido de directorio
processor.list_folder_contents("mi_carpeta", details=True)

# Analizar archivo CSV
processor.read_csv("datos.csv", report_path="reporte.txt", summary=True)

# Leer archivo DICOM
processor.read_dicom("imagen.dcm", extract_image=True)
```

## Métodos Disponibles

### `__init__(self, base_path: str, log_file: str)`
Inicializa el procesador con una ruta base y archivo de log.

**Parámetros:**
- `base_path`: Ruta base para operaciones de archivos
- `log_file`: Archivo donde se escriben los logs

### `list_folder_contents(self, folder_name: str, details: bool = False)`
Lista el contenido de una carpeta.

**Parámetros:**
- `folder_name`: Nombre de la carpeta relativa a base_path
- `details`: Si es True, incluye tamaños y fechas de modificación

**Funcionalidades:**
- Cuenta elementos en la carpeta
- Muestra tipos (archivo/carpeta)
- Información detallada opcional
- Logging de errores

### `read_csv(self, filename: str, report_path: Optional[str] = None, summary: bool = False)`
Lee y analiza archivos CSV.

**Parámetros:**
- `filename`: Nombre del archivo CSV
- `report_path`: Ruta opcional para guardar reporte
- `summary`: Si es True, muestra resumen de columnas no numéricas

**Funcionalidades:**
- Muestra número de columnas y filas
- Calcula estadísticas (media, desviación estándar)
- Genera reportes en formato TXT
- Análisis de frecuencias para datos no numéricos

### `read_dicom(self, filename: str, tags: Optional[List[Tuple[int, int]]] = None, extract_image: bool = False)`
Lee archivos médicos DICOM.

**Parámetros:**
- `filename`: Nombre del archivo DICOM
- `tags`: Lista opcional de tags DICOM a extraer
- `extract_image`: Si es True, extrae la imagen como PNG

**Funcionalidades:**
- Extrae información del paciente
- Lee tags DICOM personalizados
- Convierte imágenes médicas a PNG
- Manejo de diferentes formatos de píxeles

## Ejemplos de Salida

### Análisis CSV
```
=== Análisis del archivo CSV: datos.csv ===
Número de columnas: 6
Nombres de columnas: ['PatientID', 'Age', 'Weight', 'Height', 'Cholesterol', 'HeartRate']
Número de filas: 52

=== Estadísticas de columnas numéricas ===
Age: Media = 31.08, Desviación estándar = 7.41
Weight: Media = 75.96, Desviación estándar = 4.49
```

### Información DICOM
```
=== Información del archivo DICOM: imagen.dcm ===
Nombre del paciente: Juan Pérez
Fecha del estudio: 20240101
Modalidad: MRI

Imagen extraída y guardada como: imagen_imagen.png
```

## Archivos Incluidos

- `Solucion.py`: Implementación principal de la clase FileProcessor
- `requirements.txt`: Dependencias necesarias

## Manejo de Errores

La clase incluye manejo completo de errores para:
- Archivos inexistentes
- Formatos de archivo incorrectos
- Datos corruptos o no válidos
- Permisos de archivo
- Errores de conversión de datos

Todos los errores se registran en el archivo de log especificado.

## Dependencias

- `pandas`: Análisis de datos CSV
- `pydicom`: Procesamiento de archivos DICOM
- `numpy`: Operaciones numéricas
- `Pillow`: Procesamiento de imágenes
- `logging`: Sistema de logs (incluido en Python)

## Notas Técnicas

- Compatible con Python 3.7+
- Maneja archivos DICOM según estándar DICOM
- Convierte automáticamente formatos de píxeles para PNG
- Sistema de logging configurable
- Diseño orientado a objetos para fácil extensión