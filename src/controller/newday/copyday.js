import db from '../../services/connectionScenterDB'
exports.daysList = async ()=>{
  try {
    const days = await db.query('SELECT * FROM copy_time ORDER BY id DESC LIMIT 1');
    return days;
  } catch (err) {
    console.log('error get copy day list '+err);
    return false;
  }
}
exports.insertDay = async (day)=>{
  try {
    const inst = await db.query('INSERT INTO copy_time set copy_date = "' + day + '"');
    return inst;
  } catch (err) {
    console.log('error insert copy day '+err);
    return false;
  }
}
