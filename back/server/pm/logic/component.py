from typing import Iterable, Optional

from server.pm.models import Component

MAX_COMPONENTS_TO_FIND = 7


def find_components(query: Optional[str], exclude: Optional[Iterable[str]] = None) -> Iterable[Component]:
    """Performs trigram search on components.code field.

    Annotating queryset with django.contrib.postgres.search.TrigramSimilarity results on
    ignoring trigram index therefore using .extra query here.
    """
    if not query or len(query) < 3:
        return []

    queryset = Component.objects.filter(merged_to__isnull=True)

    if exclude:
        queryset = queryset.exclude(id__in=exclude)

    queryset = (
        queryset.extra(
            select={'similarity': 'word_similarity(%s, code)'},
            select_params=(query,),
            where=['%s <%% code'],
            params=(query,),
        )
        .select_related('collection')
        .order_by('-similarity')[:MAX_COMPONENTS_TO_FIND]
    )

    return queryset
