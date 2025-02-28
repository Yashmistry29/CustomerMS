const express = require('express');
const Cid = require('uuid').v4();
const Consul = require('consul');

const consul = new Consul({ host: "localhost", port: 8500 });

require("./Database/db");

var app = express();

const routes = require('./Routes/routes');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);

var host = 'localhost';
var port = process.env.PORT || 4001
app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
});

// Registering the Service with consul
const consulId = 'CustomerMS';
const myService = {
  name: consulId,
  address: host,
  port: port,
  id: Cid,
  check: {
    ttl: '10s',
    deregistercriticalserviceafter: '1m'
  }
}

consul.agent.service.register(myService).then(() => {
  console.log("CustomerMS registered on Consul");
  setInterval(() => {
    consul.agent.check.pass({ id: `service:${Cid}` }).then(() => {
      console.log('Updated Consul - Health Status');
    }).catch(err => {
      console.log("Health Check Error", err);
    })
  }, 5 * 1000);
}).catch(err => {
  console.log("Registering Error");
})



