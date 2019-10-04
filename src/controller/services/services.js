import db from '../../services/connectionScenterDB' 
exports.servicesList = async ()=>{
  try {
    const services = await db.query('SELECT id,F_ID,F_NAME,F_WORK_NAME,F_ID_PARENT,F_F_2,F_QWAIT_TIME,F_MAX_SERV_TIME FROM services_list');
    return services;
  } catch (err) {
    console.log('Error get services list '+err);
    return false;
  }
}
