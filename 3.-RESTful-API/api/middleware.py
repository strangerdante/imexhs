
import logging
import time

logger = logging.getLogger(__name__)

class LoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()
        
        # Registrar la petición
        log_data = {
            'path': request.path,
            'method': request.method,
            'user': request.user.username if request.user.is_authenticated else 'AnonymousUser',
        }
        logger.info(f"Request: {log_data}")

        response = self.get_response(request)

        # Registrar la respuesta
        duration = time.time() - start_time
        log_data['status_code'] = response.status_code
        log_data['duration_ms'] = duration * 1000
        logger.info(f"Response: {log_data}")

        return response
