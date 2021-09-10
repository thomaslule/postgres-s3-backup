# postgres-s3-backup

A docker image that is scheduled to backup a postgres database and upload the dump file to an S3 bucket.

## Usage example

Docker-compose usage example:

```yaml
version: "3"
services:
  postgres:
    image: postgres:12.2-alpine
    environment:
      POSTGRES_PASSWORD: admin
      PGDATA: /data/postgres
    volumes:
      - postgres_data:/data/postgres

  postgres-backup:
    image: thomaslule/postgres-s3-backup:latest
    depends_on:
      - postgres
    environment:
      S3BACKUP_DB_CONNECTION_STRING: postgresql://postgres:admin@postgres:5432/postgres
      S3BACKUP_CRON_SCHEDULE: "0 5 * * 0"
      S3BACKUP_S3_REGION: eu-west-3
      S3BACKUP_S3_BUCKET: db-backup
      AWS_ACCESS_KEY_ID: yourkey
      AWS_SECRET_ACCESS_KEY: yoursecret

  volumes:
    postgres_data:
```

## Environment variables

### `S3BACKUP_DB_CONNECTION_STRING`

The connection string for your postgres database.

- required: false
- default: `postgresql://postgres:admin@localhost:5432/postgres`

### `S3BACKUP_CRON_SCHEDULE`

The CRON expression that describes when the export must be done.

- required: false
- default: `0 5 * * 0` (every sunday at 05:00)

### `S3BACKUP_S3_REGION`

The AWS region where the bucket lives

- required: true

### `S3BACKUP_S3_BUCKET`

The AWS S3 bucket name

- required: true

### `AWS_ACCESS_KEY_ID`

The AWS Access Key

- required: true

### `AWS_SECRET_ACCESS_KEY`

The AWS Secret Key

- required: true

## Limitation

This docker image uses `pg_dump` and if its version isn't exactly the same as the postgres server version, this tool will fail with the error `aborting because of server version mismatch`.

In order to have the same `pg_dump` version as your database, you must rebuild this image from another alpine version, you can search an alpine branch that contain the right postgres version [here](https://pkgs.alpinelinux.org/packages?name=postgresql-client&branch=v3.11).
