import {nomadDB,mssqlNomad,mysqlNomad} from '../../config/vars';
import {htmlspecialchars,nulltozero} from '../../services/additionalFunction'
import mysql from 'mysql';
import db from '../../services/connectionScenterDB'
var sql = require('mssql');
const util = require('util');
exports.servicesList = async ()=>{
  if(nomadDB === 'MSSQL'){
    try {
        let pool = await sql.connect(mssqlNomad)
        let result = await pool.request()
            .query('SELECT * FROM t_g_queue')
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
      const data = await connect.query('SELECT * FROM t_g_queue');
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
exports.serviceSave = async (data)=>{
     const update = await db.query('UPDATE services_list SET '+
        'F_NAME="' + htmlspecialchars(data.F_WORK_NAME) + '", '+
        'F_QWAIT_TIME="' + data.F_QWAIT_TIME + '", '+
        'F_WORK_NAME="' + htmlspecialchars(data.F_WORK_NAME) + '", '+
        'F_QWAIT_TIME="' + nulltozero(data.F_QWAIT_TIME) + '", '+
        'F_F_2="' + data.F_F_2 + '", '+
        'F_ID_PARENT="' + nulltozero(data.F_ID_PARENT) + '", '+
        'F_MAX_SERV_TIME=' + nulltozero(data.F_MAX_SERV_TIME)+ ' '+
        'WHERE F_ID=' + data.F_ID+' ');
     if(update && update.affectedRows === 0){
       let insert = await db.query('INSERT INTO services_list SET '+
         'F_ID="' + data.F_ID + '", '+
         'F_NAME="' + htmlspecialchars(data.F_WORK_NAME) + '", '+
         'F_QWAIT_TIME="' + nulltozero(data.F_QWAIT_TIME) + '", '+
         'F_MAX_SERV_TIME="' +  nulltozero(data.F_MAX_SERV_TIME) + '", '+
         'F_WORK_NAME="' + data.F_WORK_NAME + '", '+
         'F_F_2="' + data.F_F_2 + '", '+
         'F_ID_PARENT="' + nulltozero(data.F_ID_PARENT) +'" ')
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
