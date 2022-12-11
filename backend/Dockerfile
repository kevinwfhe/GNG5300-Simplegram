FROM python:3.10-alpine AS builder
RUN apk add zlib-dev jpeg-dev gcc musl-dev mariadb-dev libffi-dev
RUN pip3 install poetry
WORKDIR /app 
COPY . /app
RUN poetry config virtualenvs.create false
RUN poetry install
RUN chmod +x docker-entrypoint.sh
ENTRYPOINT ["/app/docker-entrypoint.sh"]
