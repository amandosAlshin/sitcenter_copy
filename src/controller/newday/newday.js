import {daysList,insertDay} from './copyday'
import {truncateFacts,truncateWindow,truncateServers} from './emptyData'
import db from '../../services/connectionScenterDB'
exports.newday=async(servers)=>{
  try {
    var currentTime = new Date().toLocaleDateString();
    var day = await daysList();
    if(day){
      if(day.length>0){
          var now = day[0].copy_date;
          if(now === currentTime){
            return true;
          }else{
            var facts = await truncateFacts(),
                windows = await truncateWindow(),
                servers = await truncateServers();
            if(facts && windows && servers){
              var inst = await insertDay(currentTime);
              return true;
            }else{
              return false;
            }
          }
      }else{
        var facts = await truncateFacts(),
            windows = await truncateWindow(),
            servers = await truncateServers();
        if(facts && windows && servers){
          var inst = await insertDay(currentTime);
          return true;
        }else{
          return false;
        }
      }
    }else{
      return false;
    }
  } catch (err) {
    console.log('error newday '+err);
    return false;
  }
}
