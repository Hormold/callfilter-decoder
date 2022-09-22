const fs = require('fs');
const path = require('path');
const Database = require('./database');

/*
Main database url: https://api.callfilter.app:61980/iidata780.zip > db_main
Deltas url: https://api.callfilter.app:61980/dddata.zip > db_delta
*/

const numberToSearch = process.argv[2] || '1234567890';

const dir = path.join(__dirname, 'db_main');
const index = fs.readFileSync(path.join(dir, 'index.dat'), 'utf8').split('\n')
let total = 0;
for (let i = 0; i < index.length; i++) {
	const db = index[i].replace(/[^0-9]/g, '');
	if (db === '') {
		continue;
	}
	const fileName = path.join(dir, `db${db}.zdata`);
	const fileContentBinary = fs.readFileSync(fileName);
	const b = new Database(numberToSearch, fileContentBinary, fileName, db);
	const result = b.decode();
	total += result.length;
	console.log("Total: ", total);
}