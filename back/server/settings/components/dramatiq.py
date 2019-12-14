from server.settings.components import BASE_DIR, config

DRAMATIQ_BROKER = {
    'BROKER': 'dramatiq.brokers.redis.RedisBroker',
    'OPTIONS': {'url': 'redis://{host}:{port}'.format(host=config('REDIS_HOST'), port=config('REDIS_PORT'))},
    'MIDDLEWARE': [
        'dramatiq.middleware.AgeLimit',
        'dramatiq.middleware.Retries',
        'django_dramatiq.middleware.DbConnectionsMiddleware',
    ],
}
