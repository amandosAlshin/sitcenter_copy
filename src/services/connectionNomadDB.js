import mysql from 'mysql';
const util = require('util');
import {mysqlNomad} from '../config/vars';
console.log(mysqlNomad);
const dbNomad = mysql.createConnection({
    host: mysqlNomad.host,
    user:  mysqlNomad.user,
    password:  mysqlNomad.password,
    database:  mysqlNomad.database,
});
// connect to database
dbNomad.connect((err) => {
    console.log('err',err);
    if (err) {
        console.log('error mysqlNomad connect',err);
        return err;
    }
    console.log('mysqlNomad connected');
});
dbNomad.query = util.promisify(dbNomad.query);
export default dbNomad;
