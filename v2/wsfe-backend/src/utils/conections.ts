import dotenv from 'dotenv';
// import * as sql from 'mssql';
import path from 'path';
import { Client } from 'pg';
const sql = require('mssql');

dotenv.config({
	path: path.join(path.resolve('./env'), process.env.NODE_ENV + '.env'),
});

const clientWSFEPostgreSQL = new Client({
	user: process.env.BD_PG_USER,
	host: process.env.BD_PG_HOST,
	database: process.env.BD_PG_DATABASE,
	password: process.env.BD_PG_PASSWORD,
	port: parseInt(`${process.env.BD_PG_PORT}`),
});

clientWSFEPostgreSQL.connect();

const clientWSFESQLServer = new sql.ConnectionPool({
	user: process.env.BD_SS_USER,
	password: process.env.BD_SS_PASSWORD,
	database: process.env.BD_SS_DATABASE,
	server: process.env.BD_SS_HOST,
	pool: {
		max: 10,
		min: 0,
		idleTimeoutMillis: 30000,
	},
	options: {
		encrypt: false,
		trustServerCertificate: false,
	},
});

clientWSFESQLServer.connect();

export { clientWSFEPostgreSQL, clientWSFESQLServer };
