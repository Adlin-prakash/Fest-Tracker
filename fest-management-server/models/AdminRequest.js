const mongoose = require("mongoose");

const adminRequestSchema = new mongoose.Schema({
  collegeName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
});

const AdminRequest = mongoose.model("AdminRequest", adminRequestSchema);
module.exports = AdminRequest;
