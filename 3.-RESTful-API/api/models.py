from django.db import models

class Device(models.Model):
    device_name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.device_name

class ImageResult(models.Model):
    id = models.CharField(max_length=255, primary_key=True)
    device = models.ForeignKey(Device, on_delete=models.CASCADE)
    average_before_normalization = models.FloatField()
    average_after_normalization = models.FloatField()
    data_size = models.IntegerField()
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.id
    
    @classmethod
    def id_exists(cls, id_value):
        """Verifica si ya existe un registro con este ID"""
        return cls.objects.filter(id=id_value).exists()
    
    def actualizar_dispositivo(self, device_name):
        """Actualiza el dispositivo asociado"""
        device, _ = Device.objects.get_or_create(device_name=device_name)
        self.device = device
        self.save()