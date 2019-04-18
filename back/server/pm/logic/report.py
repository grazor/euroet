from uuid import uuid4

import xlsxwriter

from django.conf import settings

from server.pm.models import Report, Product, ProductComponent

REPORT_HEAD = [
    'Артикул',
    'Наименование',
    'Кол-во',
    'Единица измерения',
    'Минимальное заказное количество',
    'Цена c НДС, RUR',
    'Единица цены',
    'Сумма с НДС, RUR',
    'Произ-тель',
]


def report_product(product: Product) -> str:
    filename = f'{uuid4()}.xlsx'
    filepath = settings.MEDIA_ROOT.joinpath('reports', filename)
    workbook = xlsxwriter.Workbook(filepath)
    ws = workbook.add_worksheet(product.name)

    ws.set_column(0, 0, width=20)
    ws.set_column(1, 1, width=100)
    ws.set_column(2, 4, width=10, options={'align': 'center'})
    ws.set_column(5, 5, width=14, options={'align': 'center'})
    ws.set_column(6, 6, width=10, options={'align': 'center'})
    ws.set_column(7, 7, width=14, options={'align': 'center'})
    ws.set_column(8, 8, width=14, options={'align': 'center'})

    format_productname = workbook.add_format({'bold': True, 'bg_color': 'yellow'})
    format_productname.set_border(style=1)

    format_head = workbook.add_format({'align': 'center', 'bg_color': 'yellow'})
    format_head.set_border(style=1)

    format_item = workbook.add_format({'font_size': 8})
    format_item.set_border(style=1)

    ws.write_string(0, 0, product.name, format_productname)

    for col, head in enumerate(REPORT_HEAD):
        ws.write_string(2, col, head, format_head)

    row = 3
    product_components = ProductComponent.objects.filter(product=product).select_related(
        'component', 'component__collection'
    )
    for product_component in product_components:
        component = product_component.component

        ws.write_string(row, 0, component.code, format_item)
        ws.write_string(row, 1, component.description, format_item)
        ws.write_number(row, 2, product_component.qty, format_item)
        ws.write_string(row, 3, 'шт.', format_item)
        ws.write_number(row, 4, 1, format_item)
        ws.write_number(row, 5, component.total_price, format_item)
        ws.write_number(row, 6, 1, format_item)
        ws.write_number(row, 7, product_component.aggregated_price, format_item)
        ws.write_string(row, 8, '' if not component.collection else component.collection.slug, format_item)
        row += 1

    workbook.close()
    return filename
