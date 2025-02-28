const mongoose = require('mongoose');
const Consul = require('consul');

const consul = new Consul({ host: "localhost", port: 8500 });

var db = mongoose.connection;

consul.kv.get('MSConfig', (err, result) => {
  config = JSON.parse(result.Value);
  if (db.readyState === 1) {
    db.close();
  }
  mongoose.connect(`${config.dataSource}://${config.dbHost}:${config.dbPort}/${config.CustomerDB}`)
    .then(() => {
      try {
        console.log('MongoDB connected successful!!!');
      } catch (err) {
        console.log("Connection Error", err);
      }
    });
});

const watch = consul.watch({
  method: consul.kv.get,
  options: {
    key: 'MSConfig',
  },
  backoffFactor: 1000,
});

watch.on('change', function (data, res) {
  config = JSON.parse(data.Value);
  if (db.readyState === 1) {
    db.close();
  }
  mongoose.connect(`${config.dataSource}://${config.dbHost}:${config.dbPort}/${config.CustomerDB}`)
    .then(() => {
      try {
        console.log('MongoDB connected successful!!!');
      } catch (err) {
        console.log("Connection Error", err);
      }
    });
});