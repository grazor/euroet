from typing import List, Union, Mapping, Optional
from decimal import Decimal
from collections import namedtuple

from openpyxl import load_workbook

from server.pm.models import ComponentImport

Column = namedtuple('Column', ['field', 'columns', 'is_required'])

COLUMNS = (
    Column(field='code', columns={'code'}, is_required=True),
    Column(field='name', columns={'name'}, is_required=True),
    Column(field='description', columns={'description'}, is_required=False),
    Column(field='collection', columns={'collection'}, is_required=False),
    Column(field='manufacturer', columns={'manufacturer'}, is_required=False),
    Column(field='price', columns={'price'}, is_required=True),
)

REQUIRED = {col.field for col in COLUMNS if col.is_required}


def process_component(
    code: str,
    name: str,
    price: Union[str, int, float, Decimal],
    description: Optional[str] = None,
    collection: Optional[str] = None,
    manufacturer: Optional[str] = None,
) -> List[Mapping]:
    return []


def get_header_mapping(row):
    mapping = {}
    for index, value in enumerate(row):
        strval = str(value or '').lower()
        for col in COLUMNS:
            if strval in col.columns:
                mapping[col.field] = index
                break

    return mapping if mapping and set(mapping.keys()).issuperset(REQUIRED) else {}


def import_from_worksheet(sheet):
    values = sheet.values
    rown = 0
    for row in values:
        rown += 1
        mapping = get_header_mapping(row)
        if mapping:
            break
    else:
        return 0, 0, [{'type': 'error', 'sheet': sheet.name, 'error': 'Missing header row'}]

    rows, processed = 0, 0
    errors = []
    for row in values:
        rown += 1
        component = {field: row[index] for field, index in mapping.items()}
        fields = {key for key, value in component.items() if value}
        if fields.issuperset(REQUIRED):
            rows += 1
            component_errors = process_component(**component)
            if not errors:
                processed += 1
            else:
                errors.extend(component_errors)

    return row, processed, []


def import_from_workbook(import_info):
    wb = load_workbook(import_info.full_path)

    for sheet_name in wb.sheetnames:
        try:
            rows, processed, sheet_errors = import_from_worksheet(wb[sheet_name])
        except Exception as exc:
            rows, processed = 0, 0
            sheet_errors = {'type': 'error', 'sheet': sheet_name, 'error': str(exc)}
        finally:
            import_info.rows = (import_info.rows or 0) + rows
            import_info.processed = (import_info.processed or 0) + processed
            import_info.errors.extend(sheet_errors)
            import_info.save(update_fields=['rows', 'processed', 'errors'])


def import_components(import_uuid: str):
    import_info = ComponentImport.objects.get(uuid=import_uuid)
    import_info.status = ComponentImport.ImportStatus.PROCESSING.value
    import_info.save(update_fields=['status'])

    if import_info.import_file.split('.')[-1] == 'xlsx':
        import_from_workbook(import_info)

    import_info.status = ComponentImport.ImportStatus.COMPLETE.value
    import_info.save(update_fields=['status'])
