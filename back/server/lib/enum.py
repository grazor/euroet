from typing import Any, Tuple, Iterable


def as_choices(enum: Any) -> Iterable[Tuple[str, str]]:
    return [(item.name, item.value) for item in enum]
