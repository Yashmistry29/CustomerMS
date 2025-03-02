const { customer } = require("../Model/model");
const { isValidAge, isValidEmail, isValidMobile, isValidName, isValidPassword } = require('../Utils/validators');
const { generateCustomerId} = require('../Utils/utils');
const md5 = require('md5');

// Customer Services
exports.register = async (req, res) => {
  try { 
    const { name, emailId, contactNo, password, gender, dateOfBirth, address } = req.body;

    // Validate the input
    if (!isValidName(name)) return res.status(400).json({ message: "Invalid Name" });
    if (!isValidEmail(emailId)) return res.status(400).json({ message: "Invalid Email" });
    if (!isValidAge(dateOfBirth)) return res.status(400).json({ message: "You must be at least 18 years old" });
    if (!isValidMobile(contactNo)) return res.status(400).json({ message: "Invalid Mobile Number" });
    if (!isValidPassword(password)) return res.status(400).json({ message: "Invalid Password" });

    const existingUser = await customer.findOne({ emailId });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = md5(password);
    const customerId = await generateCustomerId();

    const newUser = await customer.create({
      customerId,
      name,
      emailId,
      contactNo,
      password: hashedPassword,
      gender,
      dateOfBirth,
      address
    })

    res.status(200).json({status:'success', message: `The customer account ${newUser.customerId} created` });

  }
  catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Something went wrong...' });
  }
}

exports.login = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    
    let user = await customer.findOne({ emailId: emailId }, {name:1,customerId:1, emailId: 1, password: 1, _id: 0 });

    if (user.password === md5(password)) {
      res.cookie("emailId", emailId, { httpOnly: true, secure: false });
      res.status(200).json({
        status: 'success',
        message: "You have logged in successfully",
        data: user
      })
    } else {
      res.status(404).json({
        status: 'fail',
        message: "Invalid Id and Password"
      })
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Something went wrong...' });
  }
}

exports.logout = async (req, res) => {
  try {
    res.clearCookie("emailId");
    res.status(200).json({
      message: "You have Logged out successfully"
    });
  }
  catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'fail',
      message: 'something went wrong'
    })
  }

}

exports.getCustomer = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const customerDetails = await customer.findOne({ customerId: customerId });

    if (customerDetails) {
      res.status(200).json({
        status: 'success',
        data: customerDetails
      })
    } else {
      res.status(404).json({
        status: 'fail',
        message: 'Customer not found'
      })
    }
  }
  catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'fail',
      message: 'something went wrong'
    })
  }
}

exports.getAddress = async (req, res) => {
  try {
    const { customerId } = req.params;
    const fetchAddress = await customer.findOne({ customerId: customerId }, { name: 1, contactNo: 1, address: 1, _id: 0 });

    if (fetchAddress) {
      res.status(200).json({
        status: 'success',
        data: fetchAddress
      })
    } else {
      res.status(400).json({
        message: 'No customer found'
      })
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'fail', message: 'Something went wrong' });
  }
}

exports.addAddress = async (req, res) => {
  try {
    const { addressName, addressLine1, addressLine2,area, city, state, pincode } = req.body;
    const data = {
      addressName,
      addressLine1,
      addressLine2,
      area,
      city,
      state,
      pincode
    }

    const { customerId } = req.params;

    const address = await customer.updateOne({ customerId: customerId }, {
      $push:{
        address: data
      }
    })

    if (address) {
      res.status(200).json({
        status: "success",
        message: "Address added successfull",
        data: data
      })
    } else {
      res.status(400).json({
        message:"customer not found"
      })
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'fail', message: 'Something went wrong' });
  }
  
}

exports.updateCustomer = async (req, res) => {
  try {
    const { name, emailId, contactNo, password, dateOfBirth } = req.body;
    const { customerId } = req.params;

    if (!isValidName(name)) return res.status(400).json({ message: "Invalid Name" });
    if (!isValidEmail(emailId)) return res.status(400).json({ message: "Invalid Email" });
    if (!isValidAge(dateOfBirth)) return res.status(400).json({ message: "You must be at least 18 years old" });
    if (!isValidMobile(contactNo)) return res.status(400).json({ message: "Invalid Mobile Number" });
    // if (!isValidPassword(password)) return res.status(400).json({ message: "Invalid Password" });

    const validateCustomer = await customer.findOne({ customerId }, { password: 1, emailId: 1 });

    var hashedPassword = (password === validateCustomer.password) ? password : md5(password);

    const updateCustomer = await customer.findOneAndUpdate({ customerId: customerId }, {
      $set: {
        name: name,
        password: hashedPassword,
        emailId: emailId,
        contactNo: contactNo,
        dateOfBirth: dateOfBirth
      }
    })

    if (!updateCustomer) {
      return res.status(400).json({ status: "error", message: "Update data is required" });
    }

    res.status(200).json({ status: "success", message: "Customer updated successfully", data: updateCustomer });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: "Internal server error", error });
  }
}

exports.updateAddress = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { addressLine1, addressLine2, addressName, area, city, pincode, state, _id } = req.body;

    const data = { addressLine1, addressLine2, addressName, area, city, state, pincode, _id };

    const result = await customer.findOneAndUpdate(
      { customerId, "address._id": data._id },
      { $set: { "address.$": data } } // Updates the matched address
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Address not found or no changes made" });
    }

    res.status(200).json({ status: "success", message: "Address updated successfully", data: result });
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: "error", message: "Internal server error", error });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { addressId } = req.body;

    const result = await customer.findOneAndUpdate(
      { customerId },
      { $pull: { address: { _id: addressId } } } // Removes the address with matching _id
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({ status: "success", message: "Address deleted successfully", data: result });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Internal server error", error });
  }
};


exports.invalidRoute = (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'Invalid route'
  })
}