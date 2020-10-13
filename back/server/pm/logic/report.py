# flake8: noqa: C901

import re
from string import ascii_uppercase
from typing import Any, Tuple, Mapping, Iterable, Optional
from decimal import Decimal
from functools import reduce
from collections import namedtuple, defaultdict

import xlsxwriter
from constance import config

from django.conf import settings

from server.pm.models import Entry, Group, Report, Product, Project
from server.users.models import User

ColumnConfig = namedtuple('ColumnConfig', ['start', 'end', 'width', 'options'])

COLS = ascii_uppercase  # 26 is enough for now
RC_REGEX = re.compile(r'R(\[(-?\d+)\])?C(\[(-?\d+)\])?')

SHEET_REPORT_NAME = 'Расчёт КП'
SHEET_CLIENT_NAME = 'КП клиенту'
SHEET_COMPOENTNS_PIVOT = 'Сводная'

PROJECT_PAGE_COMPUTATION_CAPTIONS = ('Заказчик:', 'Номер счёта:', 'Объект:', 'Дата расчёта:')
PROJECT_PAGE_NOTES_CAPTION = 'Примечания по сделанному расчету:'
TOTAL_CAPTION = 'ИТОГО:'


REPORT_HEAD = (
    'Артикул',
    'Наименование',
    'Кол-во',
    'Единица измерения',
    'Минимальное заказное количество',
    'Цена c НДС, RUR',
    'Единица цены',
    'Сумма с НДС, RUR',
    'Производитель',
)

PROJECTS_HEAD = (
    '№',
    'Наименование изделия',
    'Тип корпуса',
    'Степень защиты',
    'Кол-во изделий',
    'Себестоимость комплектующих RUR с НДС',
    'Программирование, RUR',
    'Упаковка',
    'Планируемая себестоимость РК RUR с НДС',
    '',
    'Стоимость сборки за изделия RUR с НДС',
    '',
    'Планируемый GM по изделию',
    '',
    'Стоимость за единицу RUR с НДС',
    'Стоимость изделий RUR с НДС',
    'Планируемая себестоимость + расходники на кол-во изделий RUR с НДС',
)

PROJECTS_HEAD_PRICING = (
    ('Полная стоимость проекта RUR с НДС:', 15),
    ('Планируемый бюджет ПРОИЗВОДСТВА_RUR с НДС:', 10),
    ('Планируемая прибыль ПРОЕКТА_RUR с НДС:', 12),
    ('Планируемая себестоимость + РК_RUR с НДС', 16),
)

CLIENT_HEAD = (
    '№',
    'Наименование изделия',
    'Тип корпуса',
    'Степень защиты',
    'Кол-во изделий',
    'Стоимость за единицу RUR с НДС',
    'Стоимость изделий RUR с НДС',
    'Срок поставки',
)

PRODUCT_PAGE_COLUMNS = (
    ColumnConfig(start=0, end=0, width=20, options=None),
    ColumnConfig(start=1, end=1, width=64, options=None),
    ColumnConfig(start=2, end=4, width=10, options={'align': 'center'}),
    ColumnConfig(start=5, end=5, width=14, options={'align': 'center'}),
    ColumnConfig(start=6, end=6, width=10, options={'align': 'center'}),
    ColumnConfig(start=7, end=7, width=17, options={'align': 'center'}),
    ColumnConfig(start=8, end=8, width=17, options={'align': 'center'}),
)

PROJECT_PAGE_COLUMNS = (
    ColumnConfig(start=0, end=0, width=3, options={'align': 'center'}),
    ColumnConfig(start=1, end=1, width=64, options=None),
    ColumnConfig(start=2, end=2, width=14, options={'align': 'center'}),
    ColumnConfig(start=3, end=4, width=8, options={'align': 'center'}),
    ColumnConfig(start=5, end=5, width=14, options=None),
    ColumnConfig(start=6, end=7, width=10, options=None),
    ColumnConfig(start=8, end=8, width=14, options=None),
    ColumnConfig(start=9, end=9, width=4, options=None),
    ColumnConfig(start=10, end=10, width=14, options=None),
    ColumnConfig(start=11, end=11, width=4, options=None),
    ColumnConfig(start=12, end=12, width=14, options=None),
    ColumnConfig(start=13, end=13, width=4, options=None),
    ColumnConfig(start=14, end=16, width=19, options=None),
)

CLIENT_PAGE_COLUMNS = (
    ColumnConfig(start=0, end=0, width=3, options={'align': 'center'}),
    ColumnConfig(start=1, end=1, width=64, options=None),
    ColumnConfig(start=2, end=2, width=14, options={'align': 'center'}),
    ColumnConfig(start=3, end=4, width=8, options={'align': 'center'}),
    ColumnConfig(start=5, end=6, width=PROJECT_PAGE_COLUMNS[12].width, options=None),
    ColumnConfig(start=7, end=7, width=18, options=None),
)


def worksheet_set_columns(worksheet, config: Iterable[ColumnConfig]) -> None:
    for start, end, width, options in config:
        worksheet.set_column(start, end, width=width, options=options)


def combine(*rules: Mapping):
    return reduce(lambda a, b: {**a, **b}, rules)


def cell(col, row, fixed=False):
    colname = (fixed and '$' or '') + COLS[col]
    rowname = (fixed and '$' or '') + str(row + 1)
    return f'{colname}{rowname}'


def _replacement(col: int, row: int, match):
    return cell(col=col + int(match.group(4) or 0), row=row + int(match.group(2) or 0))


def rc(formula: str, col: int, row: int) -> str:
    return re.sub(RC_REGEX, lambda match: _replacement(col, row, match), formula)


def init_formats(workbook) -> Mapping[str, Any]:
    small = {'font_size': 8}
    bold = {'bold': True}
    underlined = {'underline': True}
    wrap = {'text_wrap': True}
    centered = {'align': 'center', 'valign': 'vcenter'}
    bordered = {'border': 1}
    bordered2 = {'border': 2}

    num_percent = {'num_format': '0%'}
    num_rub = {'num_format': '€ ### ### ### ##0.00'}

    bg_yellow = {'bg_color': '#FFFF00'}
    bg_dark_yellow = {'bg_color': '#FFCC00'}
    bg_light_cyan = {'bg_color': '#33CCCC'}
    bg_pale_blue = {'bg_color': '#99ccff'}
    bg_green = {'bg_color': '#00FF00'}
    bg_light_green = {'bg_color': '#CCFFCC'}

    fc_red = {'font_color': '#FF0000'}
    fc_dark_blue = {'font_color': '#333399'}
    fc_blue = {'font_color': '#0066CC'}

    # styles to be derived
    project_notes = combine(bold, fc_red)
    project_products_thead = combine(small, bold, wrap, bordered, centered)
    project_products_item = combine(small, bordered)

    styles = {
        # small, bold, centered, bordered, fg_color, text_color
        # project sheet
        'project_info_name': (bold, fc_dark_blue),
        'project_info_field': ({'top': 2, 'bottom': 2},),
        'project_notes_title': (underlined, project_notes),
        'project_notes_entry': (project_notes,),
        'project_pricing_head_caption_name': (bold, bordered2, bg_dark_yellow),
        'project_pricing_head_caption_value': (bold, bordered2, bg_dark_yellow, num_rub),
        'project_pricing_head_item_name': (bold, bordered2, bg_pale_blue),
        'project_pricing_head_item_value': (bold, bordered2, bg_yellow, num_rub),
        'project_products_thead': (project_products_thead, bg_light_cyan),
        'project_products_thead_price': (project_products_thead, bg_yellow),
        'project_products_thead_markup': (project_products_thead, bg_green),
        'project_products_thead_markup_value': (project_products_thead, bg_yellow, num_percent),
        'project_products_item': (project_products_item,),
        'project_products_item_idx': (project_products_item, centered),
        'project_products_item_name': (project_products_item, bold, fc_blue),
        'project_products_item_qty': (project_products_item, centered),
        'project_products_item_price': (project_products_item, bg_light_green, num_rub),
        'project_products_item_markup': (project_products_item, centered, bg_yellow, num_percent),
        'project_products_item_markup_value': (project_products_item, num_rub),
        'project_products_total_qty': (project_products_item, centered, bg_yellow, {'bottom': 2}),
        'project_products_blank_line': (project_products_item, bg_light_cyan),
        'project_products_bottom': (project_products_item, {'top': 1, 'bottom': 2}),
        # client sheet
        'client_total_caption': (small, bold, bordered, bg_light_cyan),
        'client_total_value': (small, bold, bordered, bg_dark_yellow, num_rub),
        'client_products_bottom': (project_products_item, bg_light_cyan, {'top': 1, 'bottom': 2}),
        # product sheet
        'product_name': (bold, bordered2, bg_yellow),
        'product_total_price': (bordered2, centered, bg_yellow, num_rub),
        'product_components_thead': (small, bold, wrap, centered, bordered2, bg_dark_yellow),
        'product_components_group': (bold, bordered, bg_light_cyan, fc_dark_blue),
        'product_components_entry': (project_products_item,),
    }
    return {name: workbook.add_format(combine(*styles)) for name, styles in styles.items()}


def write_group(worksheet, row: int, row_format, group: Group) -> None:
    worksheet.write_string(row, 0, group.name, row_format)
    for i in range(1, 9):
        # Yep, empty cells are required
        worksheet.write_string(row, i, '', row_format)


def write_entry(worksheet, row: int, formats, entry: Entry) -> None:
    default_format = formats['project_products_item']
    worksheet.write_string(row, 0, entry.code or '', default_format)
    worksheet.write_string(row, 1, entry.name or '', default_format)
    worksheet.write_number(row, 2, entry.qty or 0, formats['project_products_item_idx'])
    worksheet.write_string(row, 3, 'шт.', default_format)
    worksheet.write_number(row, 4, 1, formats['project_products_item_idx'])
    worksheet.write_number(row, 5, entry.discount_price_of_one, formats['project_products_item_markup_value'])
    worksheet.write_number(row, 6, 1, formats['project_products_item_idx'])
    worksheet.write_number(row, 7, entry.total_price, formats['project_products_item_markup_value'])
    worksheet.write_string(row, 8, entry.manufacturer_name or '', default_format)


def write_product_page(
    worksheet, formats: Mapping[str, Any], product: Product, counts: Optional[Mapping[Any, Entry]] = None
) -> None:
    worksheet_set_columns(worksheet, PRODUCT_PAGE_COLUMNS)
    worksheet.merge_range(0, 0, 0, 1, product.name, formats['product_name'])

    worksheet.set_row(2, 30)
    for col, head in enumerate(REPORT_HEAD):
        worksheet.write_string(2, col, head, formats['product_components_thead'])

    row = 3
    groups = Group.objects.filter(product=product).prefetch_related(
        'entries', 'entries__prototype', 'entries__prototype__manufacturer', 'entries__prototype__collection'
    )
    total_price = Decimal(0)
    for group in groups:
        write_group(worksheet, row, formats['product_components_group'], group)
        row += 1
        for entry in group.entries.all():
            if counts is not None:
                counts[entry.prototype or entry] += entry.qty * group.product.qty
            write_entry(worksheet, row, formats, entry)
            total_price += entry.total_price
            row += 1

    worksheet.write_number(0, 7, total_price, formats['product_total_price'])


def write_computation_internal_page(
    worksheet, formats: Mapping[str, Any], reports: Iterable[Tuple[Any, Any]]
) -> None:
    worksheet_set_columns(worksheet, PROJECT_PAGE_COLUMNS)

    # Captiopns
    row = 2
    for caption in PROJECT_PAGE_COMPUTATION_CAPTIONS:
        worksheet.write_string(row, 1, caption, formats['project_info_name'])
        worksheet.merge_range(row, 2, row, 4, '', formats['project_info_field'])
        row += 1

    # Notes
    worksheet.write_string(row, 1, PROJECT_PAGE_NOTES_CAPTION, formats['project_notes_title'])
    row += 1
    for i in range(3):
        worksheet.write_string(row, 0, f'{i+1}.', formats['project_notes_entry'])
        worksheet.write_string(row, 1, '', formats['project_notes_entry'])
        row += 1

    # Projects table head
    row += 1
    worksheet.set_row(row, 30)
    percent_row = row + 1
    for col, caption in enumerate(PROJECTS_HEAD):
        if col == 5:
            worksheet.merge_range(row, col, percent_row, col, caption, formats['project_products_thead_price'])
        elif col < 8 or col > 13:
            worksheet.merge_range(row, col, percent_row, col, caption, formats['project_products_thead'])
        elif col % 2 == 0:
            worksheet.merge_range(row, col, row, col + 1, caption, formats['project_products_thead_markup'])
            worksheet.merge_range(
                percent_row,
                col,
                percent_row,
                col + 1,
                (col - 7) * 5.0 / 100.0,
                formats['project_products_thead_markup_value'],
            )

    # Right table
    for idx, (caption, col) in enumerate(PROJECTS_HEAD_PRICING):
        if idx == 0:
            style_name = formats['project_pricing_head_caption_name']
            style_value = formats['project_pricing_head_caption_value']
        else:
            style_name = formats['project_pricing_head_item_name']
            style_value = formats['project_pricing_head_item_value']

        worksheet.merge_range(2 + idx, 8, 2 + idx, 13, caption, style_name)
        worksheet.write_formula(2 + idx, 14, f'SUM({cell(row=13, col=col)}:{cell(row=1000, col=col)})', style_value)

    # Projects list
    row += 2
    first_item_row = row
    total_row = row + len(reports) + 4
    for idx, (product, project_sheet) in enumerate(reports + [(None, None)] * 3, start=1):
        if product:
            worksheet.write_number(row, 0, idx, formats['project_products_item_idx'])
            worksheet.write_number(row, 4, product.qty, formats['project_products_item_qty'])
            worksheet.write_formula(row, 5, f'\'{project_sheet.name}\'!$H$1', formats['project_products_item_price'])
            worksheet.write_number(row, 6, 0, formats['project_products_item_price'])
            worksheet.write_number(row, 7, 0, formats['project_products_item_price'])
        else:
            worksheet.write_string(row, 0, '', formats['project_products_item_idx'])
            worksheet.write_string(row, 4, '', formats['project_products_item_qty'])
            worksheet.write_string(row, 5, '', formats['project_products_item_price'])
            worksheet.write_string(row, 6, '', formats['project_products_item_price'])
            worksheet.write_string(row, 7, '', formats['project_products_item_price'])
            worksheet.write_string(row, 8, '', formats['project_products_item_markup_value'])
            worksheet.write_string(row, 10, '', formats['project_products_item_markup_value'])
            worksheet.write_string(row, 12, '', formats['project_products_item_markup_value'])

            worksheet.write_string(row, 14, '', formats['project_products_item_markup_value'])
            worksheet.write_string(row, 15, '', formats['project_products_item_markup_value'])
            worksheet.write_string(row, 16, '', formats['project_products_item_markup_value'])

        worksheet.write_string(row, 1, product and product.name or '', formats['project_products_item_name'])
        worksheet.write_string(row, 2, '', formats['project_products_item'])
        worksheet.write_string(row, 3, '', formats['project_products_item'])

        for j in range(3):
            if product:
                worksheet.write_formula(
                    row,
                    9 + j * 2,
                    cell(col=8 + j * 2, row=percent_row, fixed=True),
                    formats['project_products_item_markup'],
                )
            else:
                worksheet.write_string(row, 9 + j * 2, '', formats['project_products_item_markup'])

        if product:
            worksheet.write_formula(
                row, 8, rc('RC[-3]*RC[1]', row=row, col=8), formats['project_products_item_markup_value']
            )
            worksheet.write_formula(
                row,
                10,
                rc(
                    f'((RC[-5] + RC[-2] + RC[-3]) * RC[1] + RC[-4] + 5000 / {cell(4, total_row, True)}) * RC[-6]',
                    row=row,
                    col=10,
                ),
                formats['project_products_item_markup_value'],
            )
            worksheet.write_formula(
                row,
                12,
                rc(
                    (
                        f'IF(RC[1]<0.05,((RC[-7]+RC[-6]+RC[-5]+RC[-4])*RC[-8]+RC[-2])*0.05/0.95,'
                        f'((RC[-7]+RC[-6]+RC[-5]+RC[-4])*RC[-8]+RC[-2])*RC[1]/(1-RC[1]))'
                    ),
                    row=row,
                    col=12,
                ),
                formats['project_products_item_markup_value'],
            )

            worksheet.write_formula(
                row,
                14,
                rc('IF(RC[-10]>0,RC[1]/RC[-10],0)', row=row, col=14),
                formats['project_products_item_markup_value'],
            )
            worksheet.write_formula(
                row,
                15,
                rc('(RC[-10]+RC[-8]+RC[-7])*RC[-11]+RC[-5]+RC[-3]', row=row, col=15),
                formats['project_products_item_markup_value'],
            )
            worksheet.write_formula(
                row,
                16,
                rc('(RC[-11]+RC[-8])*RC[-12]', row=row, col=16),
                formats['project_products_item_markup_value'],
            )

        row += 1

    # Blank lines
    for i in range(17):
        worksheet.write_string(row, i, '', formats['project_products_blank_line'])
        worksheet.write_string(row + 1, i, '', formats['project_products_bottom'])

    # Total count
    row += 2
    worksheet.write_formula(
        total_row,
        4,
        f'SUM({cell(row=first_item_row, col=4)}:{cell(row=row-3,col=4)})',
        formats['project_products_total_qty'],
    )


def write_computation_external_page(
    worksheet, formats: Mapping[str, Any], reports_count: int, internal_sheet
) -> None:
    worksheet_set_columns(worksheet, CLIENT_PAGE_COLUMNS)

    worksheet.write_string(0, 5, TOTAL_CAPTION, formats['client_total_caption'])
    worksheet.write_formula(
        0, 6, f'SUM({cell(row=3, col=6)}:{cell(row=3+reports_count,col=6)})', formats['client_total_value']
    )

    # Table head
    row = 2
    worksheet.set_row(row, 30)
    for idx, caption in enumerate(CLIENT_HEAD):
        worksheet.write_string(row, idx, caption, formats['project_products_thead'])

    row += 1
    for i in range(reports_count):
        worksheet.write_number(row, 0, i + 1, formats['project_products_item_idx'])
        worksheet.write_string(row, 7, '', formats['project_products_item_idx'])
        for j in range(6):
            col = j + 1 if j < 4 else j + 10
            style = formats['project_products_item'] if j < 4 else formats['project_products_item_markup_value']
            worksheet.write_formula(row, j + 1, f'\'{internal_sheet.name}\'!{cell(row=i+13, col=col)}', style)
        row += 1

    # Blank lines
    for i in range(8):
        worksheet.write_string(row, i, '', formats['project_products_item'])
        worksheet.write_string(row + 1, i, '', formats['client_products_bottom'])


def write_summary_page(worksheet, formats: Mapping[str, Any], counts) -> None:
    worksheet_set_columns(worksheet, PRODUCT_PAGE_COLUMNS)

    worksheet.set_row(2, 30)
    for col, head in enumerate(REPORT_HEAD):
        worksheet.write_string(2, col, head, formats['product_components_thead'])

    row = 3
    for item, count in sorted(counts.items(), key=lambda x: x[0].code or 'z' * 100):
        if isinstance(item, Entry):
            write_entry(worksheet, row, formats, item)
        else:
            entry = Entry(prototype=item, qty=count)
            write_entry(worksheet, row, formats, entry)
        row += 1

    worksheet.write_formula(
        0, 7, f'SUM({cell(row=3, col=7)}:{cell(row=1000, col=7)})', formats['product_total_price']
    )


def report_product(product: Product, author: User) -> Report:
    report = Report.objects.create(product=product, created_by=author)
    filename = f'report/{report.uuid}.xlsx'
    filepath = settings.MEDIA_ROOT.joinpath(filename)
    workbook = xlsxwriter.Workbook(filepath)
    formats = init_formats(workbook)
    worksheet = workbook.add_worksheet(
        product.name[:31]
        .replace('/', '')
        .replace('[', '')
        .replace(']', '')
        .replace(':', '')
        .replace('*', '')
        .replace('?', '')
        .replace('\\', '')
    )

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
    report_sheet = workbook.add_worksheet(SHEET_REPORT_NAME)
    client_sheet = workbook.add_worksheet(SHEET_CLIENT_NAME)
    pivot_sheet = workbook.add_worksheet(SHEET_COMPOENTNS_PIVOT)
    formats = init_formats(workbook)

    reports = []
    counts = defaultdict(int)
    products = project.products.all().order_by('created_at')
    for product in products:
        worksheet = workbook.add_worksheet(product.name[:31])
        write_product_page(worksheet, formats, product, counts)
        reports.append((product, worksheet))

    write_computation_internal_page(report_sheet, formats, reports)
    write_computation_external_page(client_sheet, formats, len(reports), report_sheet)
    write_summary_page(pivot_sheet, formats, counts)

    workbook.close()
    report.complete = True
    report.save(update_fields=['complete'])
    return report
