import dramatiq

from server.pm.logic.component_import import import_components


@dramatiq.actor
def import_components_task(import_uuid: str):
    import_components(import_uuid)
