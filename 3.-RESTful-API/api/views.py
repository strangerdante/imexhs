from django.db import transaction
from rest_framework import viewsets, status, serializers
from rest_framework.response import Response
from .models import Device, ImageResult
from .serializers import ImageResultSerializer, InputDataSerializer
from .filters import ImageResultFilter
from .services import ImageResultService
from django_filters.rest_framework import DjangoFilterBackend

class ImageViewSet(viewsets.ModelViewSet):
    queryset = ImageResult.objects.all()
    serializer_class = ImageResultSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ImageResultFilter

    def create(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                results = ImageResultService.create_from_payload(request.data)
                serialized_results = [
                    self.get_serializer(result).data for result in results
                ]
                return Response(serialized_results, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_id = request.data.get('id')
        device_name = request.data.get('device_name')

        try:
            with transaction.atomic():
                # Cambiar ID si es necesario
                if new_id and new_id != instance.id:
                    instance = ImageResultService.change_id(instance, new_id)
                
                # Actualizar dispositivo si se proporciona
                if device_name:
                    instance.actualizar_dispositivo(device_name)
                
                # Actualizar otros campos
                serializer = self.get_serializer(instance, data=request.data, partial=False)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                    
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_id = request.data.get('id')
        device_name = request.data.get('device_name')

        try:
            with transaction.atomic():
                # Cambiar ID si es necesario
                if new_id and new_id != instance.id:
                    instance = ImageResultService.change_id(instance, new_id)
                
                # Actualizar dispositivo si se proporciona
                if device_name:
                    instance.actualizar_dispositivo(device_name)
                
                return Response(self.get_serializer(instance).data)
                
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)