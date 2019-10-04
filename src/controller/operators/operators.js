import db from '../../services/connectionScenterDB'
import {NomadSoap} from '../../services/nomadSoap'
import {soap} from '../../config/vars';
import {htmlspecialchars,nulltozero} from '../../services/additionalFunction'
var currentDate = new Date();
exports.operators=(servers)=>{
    servers.forEach(function (val) {
        var soapGet = new NomadSoap(val.ip, soap.port, soap.url);
        soapGet.AllOperatorList(function (body) {
            body.forEach(function (value) {
                db.query('UPDATE employee_list SET '+
                  'F_ID=' + value.operatorid  + ', F_WORK_NAME="' + htmlspecialchars(value.workname) + '",'+
                  'F_DESCR="' + htmlspecialchars(value.description) + '", F_BRANCH_ID="' + nulltozero(val.F_ID) + '",'+
                  'startTime="' + value.starttime + '" '+
                  'WHERE F_ID=' + value.operatorid+' and F_BRANCH_ID="' + nulltozero(val.F_ID)+'" and id<>0', function (err, result) {
                    if (err) {
                        console.log('Error when updating all operators => ' + err);
                    } else {
                        if(result.affectedRows == 0){
                          db.query('INSERT INTO employee_list SET '+
                            'F_ID=' + value.operatorid  + ', '+
                            'F_WORK_NAME="' + htmlspecialchars(value.workname) + '", '+
                            'F_DESCR="' + htmlspecialchars(value.description) + '", '+
                            'startTime="' + value.starttime + '", '+
                            'F_BRANCH_ID="' + nulltozero(val.F_ID)+'"', function (err, result) {
                                if (err){
                                    console.log(currentDate + ' Error when inserting all operators => ' + err);
                                }else{
                                    //console.log("Operator  --" + value.workname + "-- inserted to branch => " + val.F_ID);
                                }
                            });
                        }else{
                          //console.log("Operator updated");
                        }
                    }
                });
            });
        });
    })
}
