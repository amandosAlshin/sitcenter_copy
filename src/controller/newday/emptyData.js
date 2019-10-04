import db from '../../services/connectionScenterDB'
exports.truncateFacts = async ()=>{
  try {
    const trn = await db.query('truncate table facts');
    // console.log('truncate facts', trn);
    return trn;
  } catch (err) {
    console.log('error truncate facts '+err);
    return false;
  }
}
exports.truncateWindow = async ()=>{
  try {
    const trn = await db.query('truncate table window_state');
    // console.log('truncate window', trn);
    return trn;
  } catch (err) {
    console.log('error truncate window_state  '+err);
    return false;
  }
}
exports.truncateServers = async ()=>{
  try {
    const trn = await db.query('truncate table branches');
    // console.log('truncate branches', trn);
    return trn;
  } catch (err) {
    console.log('error truncate branches  '+err);
    return false;
  }
}
