import {branchList,branchSave} from './branch_list'
import {servicesList,serviceSave} from './service_list'
import {roleList,roleSave} from './role_list'
exports.renew = async ()=>{
  var branchSynchronization = [],
      servicesSynchronization = [],
      rolesSynchronization = [];
  var branchs = await branchList();
  if(branchs){
    for (var i = 0; i < branchs.length; i++) {
      let syncBranch = await branchSave(branchs[i]);
      branchSynchronization.push({branch: branchs[i].F_NAME, statusSynchronization: syncBranch})
    }
    //console.log('branchs synchronization', branchSynchronization);
  }else{
    console.log('error get branch list;');
    return false;
  }
  var services = await servicesList();
  if(services){
    for (var i = 0; i < services.length; i++) {
      let syncServices = await serviceSave(services[i]);
      servicesSynchronization.push({services: services[i].F_WORK_NAME, statusSynchronization: syncServices})
    }
    //console.log('services synchronization', servicesSynchronization);
  }else{
    console.log('error get services list;');
    return false;
  }
  var roles = await roleList();
  if(roles){
    for (var i = 0; i < roles.length; i++) {
      let syncRoles = await roleSave(roles[i]);
      rolesSynchronization.push({role: roles[i].F_NAME, statusSynchronization: syncRoles})
    }
    //console.log('roles synchronization', rolesSynchronization);
  }else{
    console.log('error get roles list;');
    return false;
  }
  return true;
}
