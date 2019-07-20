from decimal import Decimal
from uuid import uuid4

import xlsxwriter

from django.conf import settings

from server.pm.models import Entry, Group, Report, Product
from server.users.models import User

REPORT_HEAD = [
    'Артикул',
    'Наименование',
    'Кол-во',
    'Единица измерения',
    'Минимальное заказное количество',
    'Цена c НДС, RUR',
    'Единица цены',
    'Сумма с НДС, RUR',
    'Производитель',
]


def write_group(worksheet, row: int, row_format, group: Group) -> None:
    worksheet.write_string(row, 0, group.name, row_format)
    for i in range(1, 9):
        # Yep, empty cells are required
        worksheet.write_string(row, i, '', row_format)


def write_entry(worksheet, row: int, row_format, entry: Entry) -> None:
    worksheet.write_string(row, 0, entry.code, row_format)
    worksheet.write_string(row, 1, entry.name, row_format)
    worksheet.write_number(row, 2, entry.qty, row_format)
    worksheet.write_string(row, 3, 'шт.', row_format)
    worksheet.write_number(row, 4, 1, row_format)
    worksheet.write_number(row, 5, entry.discount_price_of_one, row_format)
    worksheet.write_number(row, 6, 1, row_format)
    worksheet.write_number(row, 7, entry.total_price, row_format)
    worksheet.write_string(row, 8, entry.manufacturer_name or '', row_format)


def report_product(product: Product, author: User) -> Report:
    report = Report.objects.create(product=product, created_by=author)
    filename = f'report/{report.uuid}.xlsx'
    filepath = settings.MEDIA_ROOT.joinpath(filename)
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

    format_group = workbook.add_format({'font_size': 8, 'bold': True, 'bg_color': 'cyan'})
    format_group.set_border(style=1)

    ws.write_string(0, 0, product.name, format_productname)

    for col, head in enumerate(REPORT_HEAD):
        ws.write_string(2, col, head, format_head)

    row = 3
    groups = Group.objects.filter(product=product).prefetch_related('entries')
    total_price = Decimal(0)
    for group in groups:
        write_group(ws, row, format_group, group)
        row += 1
        for entry in group.entries.all():
            write_entry(ws, row, format_item, entry)
            total_price += entry.total_price
            row += 1

    ws.write_number(0, 7, total_price, format_head)

    workbook.close()

    report.complete = True
    report.save(update_fields=['complete'])

    return report
