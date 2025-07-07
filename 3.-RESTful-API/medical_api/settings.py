from pathlib import Path

# Construir rutas dentro del proyecto de esta forma: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Configuración de inicio rápido para desarrollo - no apta para producción
# Ver https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# ADVERTENCIA DE SEGURIDAD: mantén en secreto la clave secreta usada en producción!
SECRET_KEY = 'django-insecure-your-secret-key'

# ADVERTENCIA DE SEGURIDAD: no ejecutar con debug activado en producción!
DEBUG = True

ALLOWED_HOSTS = []


# Definición de aplicaciones

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'django_filters',
    'api',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'api.middleware.LoggingMiddleware',  # Movido después de AuthenticationMiddleware
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'medical_api.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'medical_api.wsgi.application'


# Base de datos
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'prueba',
        'USER': 'postgres',
        'PASSWORD': '1234567',
        'HOST': 'localhost',
        'PORT': '5432',
        'OPTIONS': {
            'client_encoding': 'UTF8'
        }
    }
}


# Validación de contraseñas
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internacionalización
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Archivos estáticos (CSS, JavaScript, Imágenes)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'

# Tipo de campo de clave primaria por defecto
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': 'api.log',
        },
    },
    'loggers': {
        'api': { # Cambiado de 'django' a 'api' para ser más específico
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}