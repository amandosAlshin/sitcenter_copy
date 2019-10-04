import {nomadDB,mssqlNomad,mysqlNomad} from '../../config/vars';
import {htmlspecialchars,nulltozero} from '../../services/additionalFunction'
import mysql from 'mysql';
import db from '../../services/connectionScenterDB'
var sql = require('mssql');
const util = require('util');
exports.roleList = async ()=>{
  if(nomadDB === 'MSSQL'){
    try {
        let pool = await sql.connect(mssqlNomad)
        let result = await pool.request()
            .query('SELECT F_ID,F_NAME,q.F_QUEUE_ID FROM t_role as r	LEFT JOIN (SELECT F_ROLE_ID,F_QUEUE_ID FROM t_qrole) as q ON q.F_ROLE_ID = r.F_ID')
        if(result.recordset){
          sql.close()
          return result.recordset;
        }else{
          sql.close()
          return false;
        }
    }catch(err) {
      sql.close()
      console.log('error connect mssql db nomad '+err);
      return false;
    }
  }else if (nomadDB === 'MYSQL'){
    try {
      const connect = mysql.createConnection(mysqlNomad);
      connect.query = util.promisify(connect.query);
      const data = await connect.query('SELECT F_ID,F_NAME,q.F_QUEUE_ID FROM t_role as r	LEFT JOIN (SELECT F_ROLE_ID,F_QUEUE_ID FROM t_qrole) as q ON q.F_ROLE_ID = r.F_ID');
      return data;
    } catch (err) {
      console.log('error connect mysql db nomad '+err);
      return false;
    }
  }else{
    console.log('error type db not correctly');
    return false;
  }
}
exports.roleSave = async (data)=>{
     const update = await db.query('UPDATE role SET '+
        'F_NAME="' + htmlspecialchars(data.F_NAME) + '", '+
        'F_QUEUE_ID="' + nulltozero(data.F_QUEUE_ID) + '" '+
        'WHERE F_ID=' + data.F_ID+' ');
     if(update && update.affectedRows === 0){
       let insert = await db.query('INSERT INTO role SET '+
         'F_ID="' + data.F_ID + '", '+
         'F_NAME="' + htmlspecialchars(data.F_NAME) + '", '+
         'F_QUEUE_ID="' + nulltozero(data.F_QUEUE_ID) + '" ')
       if(insert){
          return true;
       }else {
         return false;
       }
     }else if(update && update.affectedRows>0){
       return true;
     }else{
       return false;
     }
}
