import db from '../../services/connectionScenterDB'
exports.usersList = async ()=>{
  try {
    const users = await db.query('SELECT id,login,password,role,id_branch,delete_status,email,send_n FROM users WHERE send_n>0');
    return users;
  } catch (err) {
    console.log('Error get users list '+err);
    return false;
  }
}
