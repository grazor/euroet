/*
This file is used to bootstrap development database.

Note: ONLY development database;
*/

CREATE USER euroet SUPERUSER;
CREATE DATABASE euroet OWNER euroet ENCODING 'utf-8';
CREATE EXTENSION IF NOT EXISTS pg_trgm;
