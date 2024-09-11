const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["mainadmin", "collegeadmin"],
    default: "collegeadmin",
  },
  collegeName: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
