import {nomadDB,mssqlNomad,mysqlNomad} from '../../config/vars';
import {htmlspecialchars} from '../../services/additionalFunction'
import mysql from 'mysql';
import db from '../../services/connectionScenterDB'
import util from 'util'
var sql = require('mssql');
exports.branchList = async ()=>{
  if(nomadDB === 'MSSQL'){
    try {
        let pool = await sql.connect(mssqlNomad)
        let result = await pool.request()
            .query('SELECT * FROM t_g_branch')
        if(result.recordset){
          sql.close()
          return result.recordset;
        }else{
          sql.close()
          return false;
        }
    } catch (err) {
      sql.close()
      console.log('error connect mssql db nomad '+err);
      return false;
    }
  }else if (nomadDB === 'MYSQL'){
    try{
      const dbNomad = mysql.createConnection(mysqlNomad);
      dbNomad.query = util.promisify(dbNomad.query);
      const data = await dbNomad.query('SELECT * FROM t_g_branch');
      return data;
    }catch(err){
      console.log('error connect mysql db nomad '+err);
      return false;
    }
  }else{
    console.log('error type db not correctly');
    return false;
  }
}
exports.branchSave = async (data)=>{
     const update = await db.query('UPDATE branches SET '+
        'F_NAME="' + htmlspecialchars(data.F_NAME) + '", '+
        'F_IP_ADDRESS="' + data.F_IP_ADDRESS + '", '+
        'F_PARENT_ID="' + data.F_PARENT_ID + '" '+
        'WHERE F_ID=' + data.F_ID+' ');
     if(update && update.affectedRows === 0){
       let insert = await db.query('INSERT INTO branches SET '+
         'F_ID="' + data.F_ID + '", '+
         'F_NAME="' + htmlspecialchars(data.F_NAME) + '", '+
         'F_PARENT_ID="' + data.F_PARENT_ID + '", '+
         'F_IP_ADDRESS="' + data.F_IP_ADDRESS +'" ')
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
