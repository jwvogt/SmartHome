import psycopg2
from decouple import config
from psycopg2.extras import register_uuid


def get_postgres_connection() -> psycopg2.extensions.connection:
    connection = psycopg2.connect(dsn=config("DB_URL"))
    register_uuid(conn_or_curs=connection)
    connection.autocommit = True
    return connection


def insert(db: psycopg2.extensions.connection, query: str, args: list = None):
    with db:
        with db.cursor() as cursor:
            if args:
                cursor.execute(query, args)
            else:
                cursor.execute(query)
            return cursor.rowcount


def update(db: psycopg2.extensions.connection, query: str, args: list = None):
    return insert(db, query, args)


def delete(db: psycopg2.extensions.connection, query: str, args: list = None):
    return insert(db, query, args)


def select(db: psycopg2.extensions.connection, query: str, args: list = None):
    with db:
        with db.cursor() as cursor:
            if args:
                cursor.execute(query, args)
            else:
                cursor.execute(query)
            return cursor.fetchall()
