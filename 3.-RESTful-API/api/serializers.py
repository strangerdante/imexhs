from rest_framework import serializers
from .models import Device, ImageResult

class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = '__all__'

class ImageResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageResult
        fields = '__all__'

class InputDataSerializer(serializers.Serializer):
    id = serializers.CharField()
    data = serializers.ListField(child=serializers.CharField())
    deviceName = serializers.CharField()

    def validate_data(self, value):
        flat_data = []
        for item in value:
            try:
                flat_data.extend([int(num) for num in item.split()])
            except ValueError:
                raise serializers.ValidationError("All items in data must be numbers.")
        if not flat_data:
            raise serializers.ValidationError("Data cannot be empty.")
        return flat_data