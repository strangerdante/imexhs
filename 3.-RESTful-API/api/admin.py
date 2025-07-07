from django.contrib import admin
from .models import Device, ImageResult


@admin.register(Device)
class DeviceAdmin(admin.ModelAdmin):
    list_display = ("id", "device_name")
    search_fields = ("device_name",)


@admin.register(ImageResult)
class ImageResultAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "device",
        "average_before_normalization",
        "average_after_normalization",
        "data_size",
        "created_date",
        "updated_date",
    )
    list_filter = ("device", "created_date", "updated_date")
    search_fields = ("id",)