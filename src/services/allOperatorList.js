import { soap } from '../config/vars';
import axios from 'axios';
import xml2js from 'xml2js'
exports.allOperatorList = async (branch_host)=>{
  const allOperatorList = soap.allOperatorList;
  const url = 'http://'+branch_host+':'+soap.port;
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
        data: allOperatorList
      })
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        return false;
      });
  if(response){
    const operators = await parser.parseString(response.data);
    console.log(operators);
    if(operators){
      var temp = operators['soapenv:envelope']['soapenv:body'][0]['cus:nomadalloperatorlist'][0]['xsd:complextype'][1]['xsd:element'];
      var AllOperators = [];
      var obj = {};
      for (var i = 0; i < temp.length; i++) {
          obj = {};
          for (var prop in temp[i]) {
              if((temp[i].hasOwnProperty(prop)) && (prop !== 'type'))
                  obj[prop.toLowerCase()] = temp[i][prop][0];
          }
          AllOperators.push(obj);
      }
      return AllOperators;
    }else{
      return false;
    }
  }else{
    return false;
  }
}
