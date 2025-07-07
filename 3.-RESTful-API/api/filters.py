
import django_filters
from .models import ImageResult

class ImageResultFilter(django_filters.FilterSet):
    created_date = django_filters.DateTimeFromToRangeFilter()
    updated_date = django_filters.DateTimeFromToRangeFilter()
    average_before_normalization = django_filters.RangeFilter()
    average_after_normalization = django_filters.RangeFilter()
    data_size = django_filters.RangeFilter()

    class Meta:
        model = ImageResult
        fields = [
            'created_date',
            'updated_date',
            'average_before_normalization',
            'average_after_normalization',
            'data_size',
        ]
