import mysql from 'mysql';
const util = require('util');
import {scenterDB} from '../config/vars';
const db = mysql.createConnection({
    host: scenterDB.host,
    user:  scenterDB.user,
    password:  scenterDB.password,
    database:  scenterDB.database,
});

// connect to database
db.connect((err) => {
    if (err) {
        console.log('error mysql connect',err);
        return err;
    }
    console.log('Scenter db connected');
});
db.query = util.promisify(db.query);
export default db;
