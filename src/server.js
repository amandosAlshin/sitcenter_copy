import express from 'express';
import { tickets,windows,renew,operators,serverList,servicesList,usersList,newday} from './controller';
const { port,postTimeFacts,postTimeOperators } = require('./config/vars');
const app = express();
var cron = require('node-cron');
var servers = false,
    users = false,
    services = false;

var tickets_list = cron.schedule('*/'+postTimeFacts+' * * * 1-6', () => {
    if(servers){

      tickets(servers,services,users);
      windows(servers)
    }
});
var operator_list = cron.schedule('*/'+postTimeOperators+' * * * 1-6', () => {
    if(servers){
        operators(servers);
    }
});
(async function () {
    try {
        let emptyDataNewDay = await newday();
        let DataSynchronization = await renew();
        servers = await serverList();
        services = await servicesList();
        users = await usersList();
        if(servers){
          tickets_list.start();
          operator_list.start();
        }else{
          console.log('error get servers');
        }
    } catch (err) {
        console.log(err);
    }
})()

app.listen(port, () => console.log(`Server is listinging on localhost: ${port}`));
