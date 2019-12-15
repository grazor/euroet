from functools import reduce
from collections import namedtuple

from openpyxl import load_workbook

Column = namedtuple('Column', ['field', 'columns', 'is_required'])

COLUMNS = (
    Column(field='code', columns={'code'}, is_required=True),
    Column(field='name', columns={'name'}, is_required=True),
    Column(field='description', columns={'description'}, is_required=False),
    Column(field='collection', columns={'collection'}, is_required=False),
    Column(field='manufacturer', columns={'manufacturer'}, is_required=False),
    Column(field='price', columns={'price'}, is_required=True),
)

ALLOWED_HEADERS = reduce(set.union, map(lambda x: x.columns, COLUMNS))


def is_header(row):
    pass


def import_from_worksheet(sheet):
    pass


def import_from_workbook(file_path):
    wb = load_workbook(file_path)
    for sheet_name in wb.sheetnames:
        import_from_worksheet(wb[sheet_name])
