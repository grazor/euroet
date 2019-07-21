from uuid import uuid4
from typing import Any, Mapping
from decimal import Decimal

import xlsxwriter

from django.conf import settings

from server.pm.models import Entry, Group, Report, Product, Project
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


def init_formats(workbook) -> Mapping[str, Any]:
    format_productname = workbook.add_format({'bold': True, 'bg_color': 'yellow'})
    format_productname.set_border(style=1)

    format_head = workbook.add_format({'align': 'center', 'bg_color': 'yellow'})
    format_head.set_border(style=1)

    format_item = workbook.add_format({'font_size': 8})
    format_item.set_border(style=1)

    format_group = workbook.add_format({'font_size': 8, 'bold': True, 'bg_color': 'cyan'})
    format_group.set_border(style=1)

    return {'productname': format_productname, 'head': format_head, 'item': format_item, 'group': format_group}


def write_group(worksheet, row: int, row_format, group: Group) -> None:
    worksheet.write_string(row, 0, group.name, row_format)
    for i in range(1, 9):
        # Yep, empty cells are required
        worksheet.write_string(row, i, '', row_format)


def write_entry(worksheet, row: int, row_format, entry: Entry) -> None:
    worksheet.write_string(row, 0, entry.code or '', row_format)
    worksheet.write_string(row, 1, entry.name or '', row_format)
    worksheet.write_number(row, 2, entry.qty or 0, row_format)
    worksheet.write_string(row, 3, 'шт.', row_format)
    worksheet.write_number(row, 4, 1, row_format)
    worksheet.write_number(row, 5, entry.discount_price_of_one, row_format)
    worksheet.write_number(row, 6, 1, row_format)
    worksheet.write_number(row, 7, entry.total_price, row_format)
    worksheet.write_string(row, 8, entry.manufacturer_name or '', row_format)


def write_product_page(worksheet, formats: Mapping[str, Any], product: Product) -> None:
    worksheet.set_column(0, 0, width=20)
    worksheet.set_column(1, 1, width=100)
    worksheet.set_column(2, 4, width=10, options={'align': 'center'})
    worksheet.set_column(5, 5, width=14, options={'align': 'center'})
    worksheet.set_column(6, 6, width=10, options={'align': 'center'})
    worksheet.set_column(7, 7, width=14, options={'align': 'center'})
    worksheet.set_column(8, 8, width=14, options={'align': 'center'})

    worksheet.write_string(0, 0, product.name, formats['productname'])

    for col, head in enumerate(REPORT_HEAD):
        worksheet.write_string(2, col, head, formats['head'])

    row = 3
    groups = Group.objects.filter(product=product).prefetch_related('entries')
    total_price = Decimal(0)
    for group in groups:
        write_group(worksheet, row, formats['group'], group)
        row += 1
        for entry in group.entries.all():
            write_entry(worksheet, row, formats['item'], entry)
            total_price += entry.total_price
            row += 1

    worksheet.write_number(0, 7, total_price, formats['head'])


def report_product(product: Product, author: User) -> Report:
    report = Report.objects.create(product=product, created_by=author)
    filename = f'report/{report.uuid}.xlsx'
    filepath = settings.MEDIA_ROOT.joinpath(filename)
    workbook = xlsxwriter.Workbook(filepath)
    formats = init_formats(workbook)
    worksheet = workbook.add_worksheet(product.name)

    write_product_page(worksheet, formats, product)

    workbook.close()
    report.complete = True
    report.save(update_fields=['complete'])
    return report


def report_project(project: Project, author: User) -> Report:
    report = Report.objects.create(project=project, created_by=author)
    filename = f'report/{report.uuid}.xlsx'
    filepath = settings.MEDIA_ROOT.joinpath(filename)
    workbook = xlsxwriter.Workbook(filepath)
    formats = init_formats(workbook)

    for product in project.products.all():
        worksheet = workbook.add_worksheet(product.name[:31])
        write_product_page(worksheet, formats, product)

    workbook.close()
    report.complete = True
    report.save(update_fields=['complete'])
    return report

