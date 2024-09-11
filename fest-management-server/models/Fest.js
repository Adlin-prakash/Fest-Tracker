const mongoose = require("mongoose");

const roundDetailSchema = new mongoose.Schema({
  roundNumber: { type: String, required: true },
  timing: { type: String, required: true },
});

const eventSchema = new mongoose.Schema({
  eventName: String,
  eventDate: Date,
  participants: Number,
  sponsor: String,
  logoUrl: String,
  description: String,
  rounds: Number,
  hostName: String,
  phoneNumber: String,
  timing: String,
  rules: String,
  status: { type: String, default: 'ongoing' },
  location: String,
  currentRound: String,
  roundDetails: [roundDetailSchema],
  winner: {
    name: String,
    college: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

  


const festSchema = new mongoose.Schema({
  festName: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  collegeName: { type: String, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  logoUrl: { type: String, required: false },
  events: [eventSchema],
});

const Fest = mongoose.model("Fest", festSchema);

module.exports = Fest;
