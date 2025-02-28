const { counters } = require("../Model/model");

exports.generateCustomerId = async () => {
  try {
    const counter = await counters.findOneAndUpdate(
      { key: "customer" },
      { $inc: { value: 1 } },  // Increment the counter
      { new: true, upsert: true }  // Create if not exists
    );
    return `CUST${counter.value}`;  // Format: CUST1001, CUST1002
  } catch (error) {
    console.error("Error generating Customer ID:", error);
    throw new Error("Failed to generate Customer ID");
  }
};