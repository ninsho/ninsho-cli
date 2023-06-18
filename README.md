# ninsho-cli

[![build and publish](https://github.com/ninsho/ninsho-cli/actions/workflows/run-build-and-publish.yml/badge.svg)](https://github.com/ninsho/ninsho-cli/actions/workflows/run-build-and-publish.yml)

A command line tool useful for creating database tables and other tasks on [ninsho](https://www.npmjs.com/package/ninsho).

# USAGE

npx -y ninsho-cli@latest create-table

# options

```
ninsho-cli create-table
  [-db pg]               => default: pg is static
  [--db-host HOSTNAME]   => default: localhost
  [--db-port PORT]       => default: 5432
  [--db-user DB_USER]    => default: postgres 
  [--db-pass DB_PASS]    => default: postgres
  [--db-name DB_NAME]    => default: postgres
  [--table-members MEMBERS_TABLE_NAME]   => default: members
  [--table-sessions SESSIONS_TABLE_NAME] => default: sessions
  [--schema-version VERSION] => default: auto set latest version. example 0.0.0
```

## Development Warning

This project is in development. Features may change without notice.

<!-- README.md -->
