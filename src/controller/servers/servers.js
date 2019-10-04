import db from '../../services/connectionScenterDB'
exports.serverList = async ()=>{
  try {
    const servers = await db.query('SELECT distinct(F_IP_ADDRESS) as ip, F_ID, F_PARENT_ID, F_NAME, F_PARENT_ID FROM branches WHERE LOCATE(".",F_IP_ADDRESS) and F_PARENT_ID >0');
    return servers;
  } catch (err) {
    console.log('error get server list '+err);
    return false;
  }
}
