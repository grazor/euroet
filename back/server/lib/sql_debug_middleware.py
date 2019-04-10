# flake8: noqa

import os
import fcntl
import struct
import termios
from contextlib import suppress

from django.db import connection
from django.conf import settings


def terminal_width() -> int:
    width = 0
    with suppress(Exception):
        s = struct.pack('HHHH', 0, 0, 0, 0)
        x = fcntl.ioctl(1, termios.TIOCGWINSZ, s)
        width = struct.unpack('HHHH', x)[1]

    with suppress(ValueError):
        width = width or int(os.environ['COLUMNS'])

    return width or 80


class SqlDebugMiddleware:
    """
    Middleware which prints out a list of all SQL queries done
    for each view that is processed.  This is only useful for debugging.
    Based on https://djangosnippets.org/snippets/290/.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        indentation = 2
        if len(connection.queries) > 0 and settings.DEBUG:
            width = terminal_width()
            total_time = 0.0
            for query in connection.queries:
                nice_sql = query['sql'].replace('"', '').replace(',', ', ')
                sql = '\033[1;31m[{:0.3f}]\033[0m {}'.format(float(query['time']), nice_sql)
                total_time = total_time + float(query['time'])
                while len(sql) > width - indentation:
                    print('{}{}'.format(' ' * indentation, sql[: width - indentation]))
                    sql = sql[width - indentation :]
                print('{}{}\n'.format(' ' * indentation, sql))
            print('{}\033[1;32m[TOTAL TIME: {:0.3f} seconds]\033[0m'.format(' ' * indentation, total_time))
        return response
