import os
import logging
import pandas as pd
import pydicom
import numpy as np
from datetime import datetime
from typing import Optional, List, Tuple
from PIL import Image
import json

class FileProcessor:
    """
    Clase para procesar archivos y datos con funcionalidades de manejo de CSV, DICOM y directorios.
    """
    
    # Constante para valores no disponibles
    NOT_AVAILABLE = 'No disponible'
    
    def __init__(self, base_path: str, log_file: str):
        """
        Inicializa la ruta base y configura el logging.
        
        Args:
            base_path (str): Ruta base para las operaciones de archivos
            log_file (str): Archivo donde se escribirán los logs
        """
        self.base_path = base_path
        
        # Configurar logging
        logging.basicConfig(
            filename=log_file,
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            filemode='a'
        )
        self.logger = logging.getLogger(__name__)
        self.logger.info(f"FileProcessor inicializado con ruta base: {base_path}")
    
    def list_folder_contents(self, folder_name: str, details: bool = False) -> None:
        """
        Lista el contenido de una carpeta y muestra información detallada.
        
        Args:
            folder_name (str): Nombre de la carpeta relativa a base_path
            details (bool): Si es True, incluye tamaños de archivo y fecha de modificación
        """
        folder_path = os.path.join(self.base_path, folder_name)
        
        try:
            if not os.path.exists(folder_path):
                error_msg = f"La carpeta '{folder_path}' no existe"
                self.logger.error(error_msg)
                print(f"Error: {error_msg}")
                return
            
            if not os.path.isdir(folder_path):
                error_msg = f"'{folder_path}' no es una carpeta"
                self.logger.error(error_msg)
                print(f"Error: {error_msg}")
                return
            
            # Obtener lista de elementos
            elementos = os.listdir(folder_path)
            print(f"\n=== Contenido de la carpeta '{folder_name}' ===")
            print(f"Número total de elementos: {len(elementos)}")
            print()
            
            archivos = 0
            carpetas = 0
            
            for elemento in elementos:
                ruta_completa = os.path.join(folder_path, elemento)
                
                if os.path.isdir(ruta_completa):
                    tipo = "Carpeta"
                    carpetas += 1
                else:
                    tipo = "Archivo"
                    archivos += 1
                
                if details:
                    if os.path.isfile(ruta_completa):
                        # Obtener tamaño en MB
                        tamano_bytes = os.path.getsize(ruta_completa)
                        tamano_mb = tamano_bytes / (1024 * 1024)
                        
                        # Obtener fecha de modificación
                        timestamp = os.path.getmtime(ruta_completa)
                        fecha_mod = datetime.fromtimestamp(timestamp).strftime("%Y-%m-%d %H:%M:%S")
                        
                        print(f"{elemento} ({tipo}) - Tamaño: {tamano_mb:.2f} MB - Modificado: {fecha_mod}")
                    else:
                        print(f"{elemento} ({tipo})")
                else:
                    print(f"{elemento} ({tipo})")
            
            print(f"\nResumen: {archivos} archivos, {carpetas} carpetas")
            self.logger.info(f"Listado exitoso de '{folder_path}': {len(elementos)} elementos")
            
        except Exception as e:
            error_msg = f"Error al listar contenido de '{folder_path}': {str(e)}"
            self.logger.error(error_msg)
            print(f"Error: {error_msg}")
    
    def _load_csv_file(self, filename: str) -> Optional[pd.DataFrame]:
        """Carga y valida un archivo CSV."""
        file_path = os.path.join(self.base_path, filename)
        
        if not os.path.exists(file_path):
            error_msg = f"El archivo '{file_path}' no existe"
            self.logger.error(error_msg)
            print(f"Error: {error_msg}")
            return None
        
        try:
            return pd.read_csv(file_path)
        except Exception as e:
            error_msg = f"Error al leer el archivo CSV '{filename}': formato incorrecto - {str(e)}"
            self.logger.error(error_msg)
            print(f"Error: {error_msg}")
            return None
    
    def _calculate_numeric_statistics(self, df: pd.DataFrame) -> dict:
        """Calcula estadísticas de columnas numéricas."""
        columnas_numericas = df.select_dtypes(include=[np.number]).columns
        estadisticas = {}
        
        if len(columnas_numericas) > 0:
            print("=== Estadísticas de columnas numéricas ===")
            for columna in columnas_numericas:
                try:
                    media = df[columna].mean()
                    desv_std = df[columna].std()
                    estadisticas[columna] = {'media': media, 'desviacion_estandar': desv_std}
                    print(f"{columna}: Media = {media:.2f}, Desviación estándar = {desv_std:.2f}")
                except Exception as e:
                    error_msg = f"Error al calcular estadísticas para columna '{columna}': {str(e)}"
                    self.logger.error(error_msg)
                    print(f"Error: {error_msg}")
        
        return estadisticas
    
    def _save_report(self, filename: str, df: pd.DataFrame, estadisticas: dict, report_path: str) -> None:
        """Guarda el reporte de análisis."""
        try:
            with open(report_path, 'w', encoding='utf-8') as f:
                f.write(f"Reporte de análisis CSV - {filename}\n")
                f.write(f"Generado el: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
                f.write(f"Número de columnas: {len(df.columns)}\n")
                f.write(f"Número de filas: {len(df)}\n\n")
                f.write("Estadísticas de columnas numéricas:\n")
                for columna, stats in estadisticas.items():
                    f.write(f"{columna}: Media = {stats['media']:.2f}, Desviación estándar = {stats['desviacion_estandar']:.2f}\n")
            print(f"\nReporte guardado en: {report_path}")
        except Exception as e:
            error_msg = f"Error al guardar reporte en '{report_path}': {str(e)}"
            self.logger.error(error_msg)
            print(f"Error: {error_msg}")
    
    def _show_non_numeric_summary(self, df: pd.DataFrame) -> None:
        """Muestra resumen de columnas no numéricas."""
        columnas_no_numericas = df.select_dtypes(exclude=[np.number]).columns
        if len(columnas_no_numericas) > 0:
            print("\n=== Resumen de columnas no numéricas ===")
            for columna in columnas_no_numericas:
                valores_unicos = df[columna].value_counts()
                print(f"\nColumna '{columna}':")
                print(f"Valores únicos: {len(valores_unicos)}")
                print("Frecuencias:")
                for valor, freq in valores_unicos.head(10).items():  # Mostrar top 10
                    print(f"  {valor}: {freq}")
                if len(valores_unicos) > 10:
                    print(f"  ... y {len(valores_unicos) - 10} valores más")
    
    def read_csv(self, filename: str, report_path: Optional[str] = None, summary: bool = False) -> None:
        """
        Lee y analiza un archivo CSV, mostrando estadísticas y generando reportes opcionales.
        
        Args:
            filename (str): Nombre del archivo CSV en base_path
            report_path (str, opcional): Ruta donde guardar el reporte de análisis
            summary (bool): Si es True, muestra resumen de columnas no numéricas
        """
        try:
            df = self._load_csv_file(filename)
            if df is None:
                return
            
            print(f"\n=== Análisis del archivo CSV: {filename} ===")
            print(f"Número de columnas: {len(df.columns)}")
            print(f"Nombres de columnas: {list(df.columns)}")
            print(f"Número de filas: {len(df)}")
            print()
            
            estadisticas = self._calculate_numeric_statistics(df)
            
            if report_path:
                self._save_report(filename, df, estadisticas, report_path)
            
            if summary:
                self._show_non_numeric_summary(df)
            
            self.logger.info(f"Análisis exitoso del archivo CSV '{filename}'")
            
        except Exception as e:
            error_msg = f"Error inesperado al procesar '{filename}': {str(e)}"
            self.logger.error(error_msg)
            print(f"Error: {error_msg}")
    
    def _load_dicom_file(self, filename: str):
        """Carga y valida un archivo DICOM."""
        file_path = os.path.join(self.base_path, filename)
        
        if not os.path.exists(file_path):
            error_msg = f"El archivo DICOM '{file_path}' no existe"
            self.logger.error(error_msg)
            print(f"Error: {error_msg}")
            return None
            
        try:
            return pydicom.dcmread(file_path)
        except Exception as e:
            error_msg = f"Error al leer el archivo DICOM '{filename}': formato inválido - {str(e)}"
            self.logger.error(error_msg)
            print(f"Error: {error_msg}")
            return None
    
    def _extract_basic_info(self, dicom_data) -> None:
        """Extrae y muestra información básica del DICOM."""
        try:
            patient_name = getattr(dicom_data, 'PatientName', self.NOT_AVAILABLE)
            study_date = getattr(dicom_data, 'StudyDate', self.NOT_AVAILABLE)
            modality = getattr(dicom_data, 'Modality', self.NOT_AVAILABLE)
            
            print(f"Nombre del paciente: {patient_name}")
            print(f"Fecha del estudio: {study_date}")
            print(f"Modalidad: {modality}")
        except Exception as e:
            self.logger.warning(f"Error al extraer información básica: {str(e)}")
            print("Advertencia: Algunos campos básicos no están disponibles")
    
    def _process_custom_tags(self, dicom_data, tags: List[Tuple[int, int]]) -> None:
        """Procesa tags personalizados del DICOM."""
        print("\n=== Tags personalizados ===")
        for tag in tags:
            try:
                tag_hex = (tag[0], tag[1])
                if tag_hex in dicom_data:
                    valor = dicom_data[tag_hex].value
                    print(f"Tag {hex(tag[0])},{hex(tag[1])}: {valor}")
                else:
                    print(f"Tag {hex(tag[0])},{hex(tag[1])}: No encontrado")
            except Exception as e:
                error_msg = f"Error al leer tag {tag}: {str(e)}"
                self.logger.error(error_msg)
                print(f"Error: {error_msg}")
    
    def _reshape_pixel_array(self, pixel_array: np.ndarray) -> Optional[np.ndarray]:
        """Maneja diferentes formas de array de píxeles."""
        if len(pixel_array.shape) == 3:
            if pixel_array.shape[0] == 1:
                return pixel_array[0]
            elif pixel_array.shape[2] == 1:
                return pixel_array[:, :, 0]
            else:
                middle_slice = pixel_array.shape[2] // 2
                return pixel_array[:, :, middle_slice]
        elif len(pixel_array.shape) == 1:
            size = int(np.sqrt(len(pixel_array)))
            if size * size == len(pixel_array):
                return pixel_array.reshape(size, size)
            else:
                error_msg = f"No se puede convertir el array 1D de tamaño {len(pixel_array)} a imagen 2D"
                self.logger.error(error_msg)
                print(f"Error: {error_msg}")
                return None
        return pixel_array
    
    def _normalize_pixel_array(self, pixel_array: np.ndarray) -> np.ndarray:
        """Normaliza el array de píxeles para PNG (0-255)."""
        if pixel_array.dtype != np.uint8:
            pixel_min = np.min(pixel_array)
            pixel_max = np.max(pixel_array)
            if pixel_max > pixel_min:
                return ((pixel_array - pixel_min) / (pixel_max - pixel_min) * 255).astype(np.uint8)
            else:
                return pixel_array.astype(np.uint8)
        return pixel_array
    
    def _save_image_as_png(self, pixel_array: np.ndarray, filename: str) -> bool:
        """Guarda el array de píxeles como imagen PNG."""
        try:
            image = Image.fromarray(pixel_array)
            
            imagenes_folder = os.path.join(self.base_path, "imagenes_extraidas")
            if not os.path.exists(imagenes_folder):
                os.makedirs(imagenes_folder)
                print(f"Carpeta creada: {imagenes_folder}")
            
            base_name = os.path.splitext(os.path.basename(filename))[0]
            png_filename = f"{base_name}_imagen.png"
            png_path = os.path.join(imagenes_folder, png_filename)
            
            image.save(png_path)
            print(f"\nImagen extraída y guardada como: {os.path.join('imagenes_extraidas', png_filename)}")
            self.logger.info(f"Imagen DICOM extraída exitosamente: {png_path}")
            return True
            
        except Exception as e:
            error_msg = f"Error al crear imagen PIL: {str(e)}"
            self.logger.error(error_msg)
            print(f"Error: {error_msg}")
            return False
    
    def _save_as_numpy_fallback(self, pixel_array: np.ndarray, filename: str) -> None:
        """Guarda como archivo numpy si falla PNG."""
        try:
            imagenes_folder = os.path.join(self.base_path, "imagenes_extraidas")
            if not os.path.exists(imagenes_folder):
                os.makedirs(imagenes_folder)
            
            npy_filename = f"{os.path.splitext(os.path.basename(filename))[0]}_datos.npy"
            npy_path = os.path.join(imagenes_folder, npy_filename)
            np.save(npy_path, pixel_array)
            print(f"Datos guardados como numpy array en: {os.path.join('imagenes_extraidas', npy_filename)}")
            self.logger.info(f"Datos del DICOM guardados como numpy array: {npy_path}")
        except Exception as e:
            error_msg = f"Error al guardar datos numpy: {str(e)}"
            self.logger.error(error_msg)
            print(f"Error: {error_msg}")
    
    def _extract_and_save_image(self, dicom_data, filename: str) -> None:
        """Extrae y guarda la imagen del DICOM."""
        if not hasattr(dicom_data, 'pixel_array'):
            error_msg = f"El archivo DICOM '{filename}' no contiene datos de píxeles"
            self.logger.error(error_msg)
            print(f"Error: {error_msg}")
            return
        
        pixel_array = dicom_data.pixel_array
        
        print("Información del array de píxeles:")
        print(f"  Forma: {pixel_array.shape}")
        print(f"  Tipo de datos: {pixel_array.dtype}")
        print(f"  Rango de valores: {np.min(pixel_array)} - {np.max(pixel_array)}")
        
        pixel_array = self._reshape_pixel_array(pixel_array)
        if pixel_array is None:
            return
        
        if len(pixel_array.shape) != 2:
            error_msg = f"El array de píxeles tiene forma {pixel_array.shape}, no se puede convertir a imagen 2D"
            self.logger.error(error_msg)
            print(f"Error: {error_msg}")
            return
        
        if pixel_array.shape[0] == 0 or pixel_array.shape[1] == 0:
            error_msg = f"El array de píxeles tiene dimensiones inválidas: {pixel_array.shape}"
            self.logger.error(error_msg)
            print(f"Error: {error_msg}")
            return
        
        print(f"  Forma final para imagen: {pixel_array.shape}")
        
        pixel_array = self._normalize_pixel_array(pixel_array)
        
        if not self._save_image_as_png(pixel_array, filename):
            self._save_as_numpy_fallback(pixel_array, filename)
    
    def read_dicom(self, filename: str, tags: Optional[List[Tuple[int, int]]] = None, extract_image: bool = False) -> None:
        """
        Lee un archivo DICOM y extrae información médica y opcionalmente imágenes.
        
        Args:
            filename (str): Nombre del archivo DICOM en base_path
            tags (List[Tuple[int, int]], opcional): Lista de tags DICOM a extraer
            extract_image (bool): Si es True, extrae la imagen como PNG
        """
        try:
            dicom_data = self._load_dicom_file(filename)
            if dicom_data is None:
                return
            
            print(f"\n=== Información del archivo DICOM: {filename} ===")
            
            self._extract_basic_info(dicom_data)
            
            if tags:
                self._process_custom_tags(dicom_data, tags)
            
            if extract_image:
                try:
                    self._extract_and_save_image(dicom_data, filename)
                except Exception as e:
                    error_msg = f"Error al extraer imagen del DICOM '{filename}': {str(e)}"
                    self.logger.error(error_msg)
                    print(f"Error: {error_msg}")
            
            self.logger.info(f"Lectura exitosa del archivo DICOM '{filename}'")
            
        except Exception as e:
            error_msg = f"Error inesperado al procesar DICOM '{filename}': {str(e)}"
            self.logger.error(error_msg)
            print(f"Error: {error_msg}")


# Ejemplo de uso:
if __name__ == "__main__":

    # Crear el procesador
    processor = FileProcessor(".", "Log.log")
    
    # Listar contenido de la carpeta indicada
    print("\n1. Listar contenido de la carpeta samples:")
    processor.list_folder_contents("samples", details=True)

    # # Analizar CUALQUIER CSV
    # processor.read_csv("./samples/prueba.csv", report_path="reporte.txt", summary=True)

    # # # Leer CUALQUIER DICOM  
    # processor.read_dicom("./samples/prueba.dcm", extract_image=True)




