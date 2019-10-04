import axios from 'axios';
import { soap } from '../config/vars';
import xml2js from 'xml2js';
exports.eventConfirmation = async (branch_host)=>{
  const eventConfirmation = soap.eventConfirmation;
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
        data: eventConfirmation
      })
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        return false;
      });
  if(response){
    const tickets = await parser.parseString(response.data, function (err, result) {
        if(err){
          return false;
        }else{
          return result;
        }
    });

  }else{
    return false;
  }
}
