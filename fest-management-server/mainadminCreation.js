const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // Adjust the path as necessary

mongoose.connect("mongodb://localhost:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createMainAdmin() {
  const email = "admin@example.com";
  const password = "yourpassword"; // Replace with the desired password
  const hashedPassword = await bcrypt.hash(password, 10);

  const mainAdmin = new User({
    email,
    password: hashedPassword,
    role: "mainadmin",
    collegeName: "N/A", // Provide a dummy value
    isApproved: true,
  });

  await mainAdmin.save();
  console.log("Main admin created");
  mongoose.connection.close();
}

createMainAdmin().catch((err) => {
  console.error(err);
  mongoose.connection.close();
});