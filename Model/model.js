const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  name: { type: String, required: true },
  emailId: { type: String, required: true },
  contactNo: { type: String, required: true },
  password: { type: String, required: true },
  gender: { type: String },
  dateOfBirth: { type: Date },
  address: [{
    addressName: { type: String },
    addressLine1: { type: String },
    addressLine2: { type: String },
    area: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String }
  }]
});

const counterSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: Number, required: true } 
});


const dbModels = {};

dbModels.counters = mongoose.model("counter", counterSchema, "Counters");
dbModels.customer = mongoose.model('customer', customerSchema, 'Customer');

module.exports = dbModels;