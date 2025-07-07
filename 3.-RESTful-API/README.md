# API de Procesamiento de Imágenes Médicas

API RESTful desarrollada en Django que gestiona resultados de procesamiento de imágenes médicas, con funcionalidades completas de CRUD y almacenamiento en PostgreSQL.

## 📋 Características

-  **CRUD completo** para resultados de imágenes médicas
-  **Procesamiento por lotes** de datos JSON
-  **Normalización automática** de datos (0-1)
-  **Cálculo de promedios** antes y después de normalización
-  **Filtrado avanzado** por fechas, promedios y tamaño de datos
-  **Validación robusta** de datos de entrada
-  **Logging completo** de peticiones y respuestas
-  **Panel de administración** Django
-  **Soporte para PostgreSQL**

## 🛠️ Tecnologías Utilizadas

- **Backend**: Django 5.0+ con Django REST Framework
- **Base de datos**: PostgreSQL
- **Filtrado**: django-filters
- **Logging**: Sistema de logging integrado
- **Validación**: Serializers de DRF

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/strangerdante/imexhs.git
cd imexhs/2.-File-Handling-and-Array-Operations
```

### 2. Crear entorno virtual

```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

### 3. Instalar dependencias

```bash
pip install django djangorestframework django-filter psycopg2-binary
```

### 4. Configurar PostgreSQL

Crea una base de datos PostgreSQL y actualiza la configuración en `medical_api/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'prueba',
        'USER': 'postgres',
        'PASSWORD': '1234567',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### 5. Ejecutar migraciones

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Crear superusuario

```bash
python manage.py createsuperuser
```

### 7. Ejecutar el servidor

```bash
python manage.py runserver
```

## 🚀 Uso de la API

### URL Base

```
http://127.0.0.1:8000/api/
```

### Panel de Administración

```
http://127.0.0.1:8000/admin/
```

## 📍 Endpoints Disponibles

| Método   | Endpoint              | Descripción                    |
| -------- | --------------------- | ------------------------------ |
| `GET`    | `/api/elements/`      | Listar todos los resultados    |
| `POST`   | `/api/elements/`      | Crear nuevos resultados (lote) |
| `GET`    | `/api/elements/{id}/` | Obtener resultado específico   |
| `PUT`    | `/api/elements/{id}/` | Actualizar resultado completo  |
| `PATCH`  | `/api/elements/{id}/` | Actualizar resultado parcial   |
| `DELETE` | `/api/elements/{id}/` | Eliminar resultado             |

## 🔍 Parámetros de Filtrado

Para `GET /api/elements/`:

| Parámetro                          | Tipo     | Descripción                                  |
| ---------------------------------- | -------- | -------------------------------------------- |
| `created_date_before`              | DateTime | Filtrar por fecha de creación (antes)        |
| `created_date_after`               | DateTime | Filtrar por fecha de creación (después)      |
| `updated_date_before`              | DateTime | Filtrar por fecha de actualización (antes)   |
| `updated_date_after`               | DateTime | Filtrar por fecha de actualización (después) |
| `average_before_normalization_min` | Float    | Promedio antes normalización (mínimo)        |
| `average_before_normalization_max` | Float    | Promedio antes normalización (máximo)        |
| `average_after_normalization_min`  | Float    | Promedio después normalización (mínimo)      |
| `average_after_normalization_max`  | Float    | Promedio después normalización (máximo)      |
| `data_size_min`                    | Integer  | Tamaño de datos (mínimo)                     |
| `data_size_max`                    | Integer  | Tamaño de datos (máximo)                     |

## 📝 Ejemplos de Uso

### 1. Crear resultados por lotes

```bash
POST /api/elements/
Content-Type: application/json

{
  "batch1": {
    "id": "resultado-001",
    "data": [
      "10 20 30 40 50",
      "60 70 80 90 100"
    ],
    "deviceName": "CT SCAN"
  },
  "batch2": {
    "id": "resultado-002",
    "data": [
      "15 25 35 45 55",
      "65 75 85 95 105"
    ],
    "deviceName": "RX Scanner"
  }
}
```

### 2. Listar con filtros

```bash
GET /api/elements/?created_date_after=2024-01-01&data_size_min=50
```

### 3. Obtener resultado específico

```bash
GET /api/elements/resultado-001/
```

### 4. Actualizar ID y dispositivo

```bash
PATCH /api/elements/resultado-001/
Content-Type: application/json

{
  "id": "nuevo-id-123",
  "device_name": "MRI Scanner"
}
```

### 5. Eliminar resultado

```bash
DELETE /api/elements/resultado-001/
```

## 🗂️ Estructura del Proyecto

```
medical_api/
├── api/
│   ├── __init__.py
│   ├── admin.py          # Configuración del panel admin
│   ├── apps.py
│   ├── filters.py        # Filtros personalizados
│   ├── middleware.py     # Middleware de logging
│   ├── models.py         # Modelos Device e ImageResult
│   ├── serializers.py    # Serializadores DRF
│   ├── tests.py          # Tests unitarios
│   ├── urls.py           # URLs de la API
│   └── views.py          # Vistas de la API
├── medical_api/
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py       # Configuración Django
│   ├── urls.py           # URLs principales
│   └── wsgi.py
├── manage.py
├── api.log               # Archivo de logs
└── README.md
```

## 🔧 Funcionalidades Técnicas

### Procesamiento de Datos

- **Validación**: Verifica que todos los elementos de `data` sean números
- **Normalización**: Escala los valores al rango 0-1 usando el máximo como referencia
- **Cálculo de promedios**: Antes y después de la normalización
- **Transacciones atómicas**: Garantiza consistencia en operaciones por lotes

### Logging

- Registra todas las peticiones HTTP (método, ruta, usuario, duración)
- Captura errores y excepciones
- Archivo de log: `api.log`

### Validaciones

- IDs únicos por registro
- Datos numéricos válidos
- Manejo de errores HTTP apropiado (400, 404, 500)

## 📊 Modelo de Datos

### Device (Dispositivo)

```python
{
  "id": 1,
  "device_name": "CT SCAN"
}
```

### ImageResult (Resultado de Imagen)

```python
{
  "id": "resultado-001",
  "device": 1,
  "average_before_normalization": 55.5,
  "average_after_normalization": 0.555,
  "data_size": 100,
  "created_date": "2024-01-01T10:00:00Z",
  "updated_date": "2024-01-01T10:00:00Z"
}
```

## 📋 Requisitos del Sistema

- Python 3.8+
- PostgreSQL 12+
- Django 5.0+
- Django REST Framework 3.14+

## 🔐 Seguridad

- Validación de entrada robusta
- Transacciones atómicas
- Manejo seguro de errores
- Logging de actividad

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---
