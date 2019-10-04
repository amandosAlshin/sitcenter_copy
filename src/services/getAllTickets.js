import axios from 'axios';
import { soap } from '../config/vars';
import xml2js from 'xml2js';
exports.getAllTickets = async (branch_host)=>{
  const getAllTickets = soap.getAllTickets;
  const url = 'http://'+branch_host+soap.port;
  var parser = new xml2js.Parser({
      trim: true,
      normalizeTags: true,
      normalize: true,
      stripPrefix: true,
      mergeAttrs: true,
      async: true
  });
  const response =  await axios({
        method: 'post',
        url: url,
        data: getAllTickets
      })
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        return false;
      });
  if(response){
    console.log(response);
    const tickets = await parser.parseString(response.data, function (err, result) {
        if(err){
          console.log(err);
          return false;
        }else{
          return result;
        }
    });
    console.log('tickets', tickets);

  }else{
    return false;
  }
}
