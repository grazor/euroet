from typing import List, Iterable, Optional

from constance import config

from server.pm.models import Component


def _get_by_code(query: str, max_count: int, exclude: Optional[Iterable[int]] = None) -> List[Component]:
    pattern = query.replace('*', '%').replace('?', '_')
    pattern += '' if '%' in pattern else '%'
    queryset = Component.objects.all()
    if exclude:
        queryset = queryset.exclude(id__in=exclude)

    return list(
        (queryset.extra(where=['code ILIKE %s'], params=(pattern,)).select_related('collection', 'manufacturer'))[
            :max_count
        ]
    )


def _get_by_description(query: str, max_count: int, exclude: Optional[Iterable[int]] = None) -> List[Component]:
    queryset = Component.objects.all()
    if exclude:
        queryset = queryset.exclude(id__in=exclude)

    return list(
        (
            queryset.extra(
                select={'similarity': 'word_similarity(%s, pm_component.name)'},
                select_params=(query,),
                where=['%s <%% pm_component.name'],
                params=(query,),
            )
            .select_related('collection', 'manufacturer')
            .order_by('-similarity')[:max_count]
        )
    )


def find_components(query: Optional[str], max_results: Optional[int]) -> List[Component]:
    clean = (query or '').replace('%', '').strip()
    if len(clean) < 3:
        return []

    max_results = max_results or config.SEARCH_RESULTS_TO_RETURN
    components = _get_by_code(clean, max_results)
    ids = set()
    for component in components:
        setattr(component, 'match_code', True)
        ids.add(component.id)

    count_left = max_results - len(ids)
    if count_left > 0:
        components.extend(_get_by_description(clean, count_left, ids))

    return components
