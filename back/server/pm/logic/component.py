from typing import List, Iterable, Optional

from server.pm.models import Component

MAX_COMPONENTS_TO_FIND = 7


def _get_by_code(
    query: str, exclude: Optional[Iterable[int]] = None, max_count: int = MAX_COMPONENTS_TO_FIND
) -> List[Component]:
    pattern = query.replace('*', '%').replace('?', '_') + '%'
    queryset = Component.objects.filter(merged_to__isnull=True)
    if exclude:
        queryset = queryset.exclude(id__in=exclude)

    return list((queryset.extra(where=['code ILIKE %s'], params=(pattern,)).select_related('collection'))[:max_count])


def _get_by_description(
    query: str, exclude: Optional[Iterable[int]] = None, max_count: int = MAX_COMPONENTS_TO_FIND
) -> List[Component]:
    queryset = Component.objects.filter(merged_to__isnull=True)
    if exclude:
        queryset = queryset.exclude(id__in=exclude)

    return list(
        (
            queryset.extra(
                select={'similarity': 'word_similarity(%s, description)'},
                select_params=(query,),
                where=['%s <%% description'],
                params=(query,),
            )
            .select_related('collection')
            .order_by('-similarity')[:MAX_COMPONENTS_TO_FIND]
        )[:max_count]
    )


def find_components(query: Optional[str], exclude: Optional[Iterable[int]] = None) -> List[Component]:
    clean = (query or '').replace('%', '').strip()
    if not clean or len(clean) < 3:
        return []

    components = _get_by_code(clean, exclude, MAX_COMPONENTS_TO_FIND)
    ids = {int(component.id) for component in components}
    exclude = ids.union(set(exclude or []))
    count_left = MAX_COMPONENTS_TO_FIND - len(components)
    for component in components:
        setattr(component, 'match_code', True)

    if count_left > 0:
        by_description = _get_by_description(clean, exclude, count_left)
        components.extend(by_description)

    return components
