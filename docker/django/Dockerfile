FROM python:3.6.6-alpine3.7

LABEL maintainer="porivaevs@gmail.com"
LABEL vendor="porivaev"

ARG DJANGO_ENV

ENV DJANGO_ENV=${DJANGO_ENV} \
  PYTHONFAULTHANDLER=1 \
  PYTHONUNBUFFERED=1 \
  PYTHONHASHSEED=random \
  PIP_NO_CACHE_DIR=off \
  PIP_DISABLE_PIP_VERSION_CHECK=on \
  PIP_DEFAULT_TIMEOUT=100 \
  POETRY_VERSION=0.12.11


# System deps:
RUN apk --no-cache add bash postgresql-dev curl tini
RUN apk --no-cache add --virtual .build-deps \
     autoconf \
     automake \
     build-base \
     gcc \
     gettext \
     git \
     libffi-dev \
     linux-headers \
     musl-dev \
     nodejs 
RUN pip install "poetry==$POETRY_VERSION" pyparsing attrs

# Build front
WORKDIR /front
COPY front /front/
RUN npm install && npm run build

# Copy only requirements to cache them in docker layer
WORKDIR /code
COPY back/poetry.lock back/pyproject.toml /code/

# This is a special case. We need to run this script as an entry point:
COPY ./docker/django/entrypoint.sh /docker-entrypoint.sh

# Project initialization:
RUN chmod +x "/docker-entrypoint.sh" \
  && poetry config settings.virtualenvs.create false \
  && poetry install $(test "$DJANGO_ENV" == production && echo "--no-dev") --no-interaction --no-ansi

# Creating folders, and files for a project:
COPY back /code
COPY docker /code/docker

# Copy front
RUN mv /front/build/index.html /code/server/templates/singlepage.html \
  && mv /front/build/* /code/server/static/

# Cleanup
RUN rm -rf /front \
  && apk --purge del .build-deps

ENTRYPOINT ["/sbin/tini", "--", "/docker-entrypoint.sh"]
