import { Pool } from 'pg'
import * as path from 'path';
import * as fs from 'fs-extra';

/*
  command sample
  npx ninsho@latest --db-host localhost --db-port 5432 --db-name postgres --db-user postgres --db-pass postgres
  npx ninsho@latest --table-members members --table-sessions session --schema-version 0.0.0
*/

type CommandArgv = {
  _: string[],
  help?: boolean,
  'schema-version'?: string,
  'db'?: string,
  'db-host'?: string,
  'db-port'?: number,
  'db-user'?: string,
  'db-pass'?: string,
  'db-name'?: string,
  'table-members'?: string,
  'table-sessions'?: string
}

export class CommandLine {

  private argv: CommandArgv = {} as CommandArgv

  constructor() {
    console.log('ninsho-cli')
  }

  public main(): void {
    const argv: CommandArgv = require('minimist')(process.argv.slice(2))
    this.argv = argv
    if (argv.help) {
      this.help()
      return
    }
    if (argv._[0] === 'create-table') {
      this.createTable()
      return
    }
  }

  async createTable(): Promise<void> {

    // set default
    const base: CommandArgv = {
      _: [],
      help: false,
      'schema-version': '0.0.0',
      db: 'pg',
      'db-host': 'localhost',
      'db-port': 5432,
      'db-user': 'postgres',
      'db-pass': 'postgres',
      'db-name': 'postgres',
      'table-members': 'members',
      'table-sessions': 'sessions'
    };
    Object.entries(base).forEach(([key, val]) => {
      (this.argv as any)[key] = (this.argv as any)[key] ? (this.argv as any)[key] : val
    });

    const basePath = __dirname;
    const schemaPath = path.resolve(__dirname, basePath.match(/src$/) ? 'schema' : 'src/schema')

    const sql = fs.readFileSync(`${schemaPath}/${this.argv.db}.v${this.argv['schema-version']}.sql`)
    .toString()
    .replace(/\{\{m\}\}/g, this.argv['table-members'] as string)
    .replace(/\{\{s\}\}/g, this.argv['table-sessions'] as string);

    const pg = new Pool({
      user: this.argv['db-user'],
      host: this.argv['db-host'],
      database: this.argv['db-name'],
      password: this.argv['db-pass'],
      port: this.argv['db-port']
    })

    const connect = await pg.connect()
    // await connect.query(`drop table sessions`)
    // await connect.query(`drop table members`)
    await connect.query(sql)
    connect.release()

    console.log('create tables compleat.')
  }

  /**
   * help
   */
  help(): void {
    const help = `
ninsho-cli <command>

USAGE:

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

EXAMPLE:
  npx ninsho-cli create-table --db-post 5500 --db-pass foo
`
    console.log(help)
  }
}
