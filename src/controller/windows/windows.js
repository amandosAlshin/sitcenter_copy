import db from '../../services/connectionScenterDB'
import {NomadSoap} from '../../services/nomadSoap'
import {soap} from '../../config/vars';
exports.windows=(servers)=>{
  servers.forEach(function (val) {
      var soapGet = new NomadSoap(val.ip, soap.port, soap.url);
      soapGet.BranchIdWindowList(val.F_ID,function(branchId,body) {
          if (body) {
              body.forEach(function (value) {
                db.query('UPDATE `window_state` SET '+
                                'winno = ' + value.no + ', windowid =  "' + value.windowid + branchId + '",'+
                                'idoperator=' + value.operatorid + ', idbranch=' + branchId + ','+
                                'worktitle="'+value.role+' " '+
                                'where windowid="' + value.windowid + branchId+ ' " ', function (err, result) {
                    if (err){
                        console.log('Error when updating window_state '+value.eventid);
                    }else{
                        if (result.affectedRows == 0 || result.length==0) {
                          db.query('INSERT INTO `window_state` SET '+
                            'winno = ' + value.no + ', windowid = ' + value.windowid + branchId+','+
                            'idoperator = ' + value.operatorid + ',idbranch=' + branchId + ','+
                            'worktitle="'+value.role+'"',function (err, result) {
                              if (err) {
                                  console.log('\n\t Error when inserting window to table window_state');
                              } else {
                                  //console.log("\n\t Inserting new window =-" + value.windowid + branchId + " ");
                              }
                          });
                        }else{
                          //console.log("\n\t window Update  " + value.windowid + branchId);
                        }
                    }
                });
              });
          }
      });
  });
}
