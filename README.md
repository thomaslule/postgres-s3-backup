# postgres-s3-backup

A docker image that is scheduled to backup a postgres database and upload the dump file to an S3 bucket.

https://hub.docker.com/repository/docker/thomaslule/postgres-s3-backup

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
    image: thomaslule/postgres-s3-backup:latest-postgres12
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

## Postgres version

List of published tags [here](https://hub.docker.com/repository/docker/thomaslule/postgres-s3-backup/tags).

You must chose the image that corresponds to your postgres version, or you will get an error `aborting because of server version mismatch`. This is because this tool uses `pg_dump` and it only works for a server with the same version.

If you want to build your own image for another version, you can look for an alpine branch that contain the right postgres version [here](https://pkgs.alpinelinux.org/packages?name=postgresql-client&branch=v3.11).
