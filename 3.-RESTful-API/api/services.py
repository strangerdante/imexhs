from django.db import transaction
from rest_framework import serializers
from .models import Device, ImageResult
from .serializers import InputDataSerializer


class ImageResultService:
    @staticmethod
    def process_medical_data(flat_data):
        """Calcula normalización y promedios de datos médicos"""
        if not flat_data:
            raise ValueError("Los datos no pueden estar vacíos")
        
        max_value = max(flat_data)
        normalized_data = [x / max_value for x in flat_data]
        
        avg_before = sum(flat_data) / len(flat_data)
        avg_after = sum(normalized_data) / len(normalized_data)
        
        return {
            'average_before_normalization': avg_before,
            'average_after_normalization': avg_after,
            'data_size': len(flat_data)
        }
    
    @staticmethod
    def create_from_payload(payload):
        """Procesa un lote completo de datos médicos"""
        results = []
        
        for key, value in payload.items():
            serializer = InputDataSerializer(data=value)
            if not serializer.is_valid():
                raise serializers.ValidationError(serializer.errors)
            
            validated_data = serializer.validated_data
            device_name = validated_data.get('deviceName')
            device, _ = Device.objects.get_or_create(device_name=device_name)
            
            # Verificar duplicado
            if ImageResult.id_exists(validated_data.get('id')):
                raise serializers.ValidationError(
                    f"ImageResult with id {validated_data.get('id')} already exists."
                )
            
            # Procesar datos médicos
            flat_data = validated_data.get('data', [])
            processed_data = ImageResultService.process_medical_data(flat_data)
            
            # Crear resultado
            image_result = ImageResult.objects.create(
                id=validated_data.get('id'),
                device=device,
                **processed_data
            )
            results.append(image_result)
        
        return results
    
    @staticmethod
    def change_id(instance, new_id):
        """Cambia el ID de un ImageResult (crear nuevo + eliminar anterior)"""
        if ImageResult.id_exists(new_id):
            raise serializers.ValidationError(f"ImageResult with id {new_id} already exists.")
        
        # Crear nuevo registro con el nuevo ID
        new_instance = ImageResult.objects.create(
            id=new_id,
            device=instance.device,
            average_before_normalization=instance.average_before_normalization,
            average_after_normalization=instance.average_after_normalization,
            data_size=instance.data_size
        )
        
        # Eliminar el registro original
        instance.delete()
        
        return new_instance 