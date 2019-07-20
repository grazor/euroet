from django.shortcuts import get_object_or_404

from server.pm.models import Product


class ProductDetailMixin:
    def initialize_request(self, request, *args, **kwargs):
        request = super().initialize_request(request, *args, **kwargs)
        project_slug = self.kwargs.get('project_slug')
        product_slug = self.kwargs.get('product_slug')
        self.request.product = get_object_or_404(
            Product.objects.filter(slug=product_slug, project__slug=project_slug)
            .select_related('project')
            .prefetch_related('project__access', 'project__access__user')
        )
        self.request.project = self.request.product.project
        return request
