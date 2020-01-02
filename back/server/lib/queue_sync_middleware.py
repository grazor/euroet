from dramatiq.middleware import Middleware


class QueueSyncMiddleware(Middleware):
    def after_enqueue(self, broker, message, delay):
        actor = broker.get_actor(message.actor_name)
        actor(*message.args, **message.kwargs)
