# Analizador de imagenes binarias

Aplicación web desarrollada en Angular que utiliza el **método Monte Carlo** para calcular el área de manchas en imágenes binarias de manera precisa y eficiente.

## 🌐 Demo en vivo

**[🚀 Ver aplicación desplegada](https://prueba-ejercicio-4.netlify.app/)**

## 📋 Descripción

Esta aplicación permite analizar imágenes binarias (blanco y negro) para calcular el área ocupada por las manchas oscuras utilizando técnicas de simulación Monte Carlo. Es especialmente útil para análisis científicos, investigación médica, control de calidad industrial y estudios de materiales.

### ✨ Características principales

-  **Carga de imágenes**: Soporte para múltiples formatos de imagen
-  **Método Monte Carlo**: Algoritmo preciso para cálculo de áreas
-  **Configuración flexible**: Ajuste del número de puntos para mayor precisión
-  **Visualización en tiempo real**: Vista previa de puntos generados y resultados
-  **Historial de cálculos**: Registro completo de análisis realizados
-  **Diseño responsivo**: Interfaz optimizada para dispositivos móviles y desktop
-  **Interfaz moderna**: Diseñada con Tailwind CSS

## 🛠️ Tecnologías utilizadas

- **Angular 20**: Framework principal
- **TypeScript**: Lenguaje de programación
- **Tailwind CSS**: Framework de estilos
- **Swiper**: Carrusel para metodología
- **RxJS**: Programación reactiva

## 📋 Requisitos del sistema

### Requisitos previos
- **Node.js** (versión 18 o superior)
- **npm** (incluido con Node.js)
- **Angular CLI** (se instala globalmente)

### Verificar requisitos
```bash
node --version  # Debe ser 18+
npm --version   # Cualquier versión reciente
```

## 🚀 Instalación

### 1. Clonar o descargar el proyecto
```bash
# Si tienes git instalado
git clone https://github.com/strangerdante/imexhs.git
cd imexhs/4.-Create-Angular-App

```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Instalar Angular CLI (si no lo tienes)
```bash
npm install -g @angular/cli
```

## ▶️ Ejecución

### Modo desarrollo
```bash
npm start
# o alternativamente
ng serve
```

La aplicación estará disponible en: **http://localhost:4200**

### Construcción para producción
```bash
npm run build
# o alternativamente
ng build
```
