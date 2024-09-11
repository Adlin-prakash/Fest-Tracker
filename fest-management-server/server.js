const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const AdminRequest = require("./models/AdminRequest");
const Fest = require("./models/Fest");
const authenticateToken = require("./middleware/authenticateToken");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect("mongodb://localhost:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Registration route
app.post("/register", async (req, res) => {
  const { collegeName, email, password } = req.body;

  // Check if all fields are provided
  if (!collegeName || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Password validation
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long" });
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ error: "Password must contain at least one letter and one number" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newRequest = new AdminRequest({
      collegeName,
      email,
      password: hashedPassword,
    });
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      res.status(400).json({ error: "Email already exists" });
    } else {
      console.error("Error during user registration:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});


// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.isApproved) {
    return res.status(400).json({
      error: "Invalid email or password, or your account is not approved yet",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign(
    { userId: user._id, collegeName: user.collegeName },
    "your_jwt_secret",
    {
      expiresIn: "1h",
    }
  );
  res.json({ token });
});

// Route to get user details by ID
app.get("/user/:userId", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user details" });
  }
});

// Route to get all admin requests
app.get("/admin-requests", authenticateToken, async (req, res) => {
  try {
    const requests = await AdminRequest.find({ isApproved: false });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: "Error fetching requests" });
  }
});

// Route to approve or reject an admin request
app.post("/manage-request/:requestId", authenticateToken, async (req, res) => {
  const { requestId } = req.params;
  const { action } = req.body; // action can be 'approve' or 'reject'

  try {
    const request = await AdminRequest.findById(requestId);

    if (action === "approve") {
      const newUser = new User({
        collegeName: request.collegeName,
        email: request.email,
        password: request.password,
        isApproved: true,
      });
      await newUser.save();
    }

    await AdminRequest.findByIdAndDelete(requestId);
    res.status(200).json({ message: "Request processed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error processing request" });
  }
});

app.post("/mainadmin-login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, role: "mainadmin" });
  if (!user) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role, collegeName: user.collegeName },
    "your_jwt_secret",
    {
      expiresIn: "1h",
    }
  );
  res.json({ token });
});

// Route to get all fests
app.get("/fests", authenticateToken, async (req, res) => {
  try {
    const fests = await Fest.find({ createdBy: req.user.userId });
    res.status(200).json(fests);
  } catch (error) {
    res.status(500).json({ error: "Error fetching fests" });
  }
});

// Route to add a new fest
app.post("/add-fest", authenticateToken, async (req, res) => {
  const { festName, description, date, logoUrl } = req.body;
  const newFest = new Fest({
    festName,
    description,
    date,
    collegeName: req.user.collegeName,
    createdBy: req.user.userId, // Set createdBy field to the current user's ID
    logoUrl, // Ensure this field is set
  });
  try {
    await newFest.save();
    res.status(201).json(newFest);
  } catch (error) {
    console.error("Error adding fest:", error);
    res.status(500).json({ error: "Error adding fest" });
  }
});

// Route to add an event
app.post("/add-event/:festId", authenticateToken, async (req, res) => {
  const {
    eventName,
    eventDate,
    participants,
    sponsor,
    logoUrl,
    description,
    rounds,
    hostName,
    phoneNumber,
    timing,
    rules,
    status,
    location,
    currentRound,
    roundDetails,
    winnerName,
    winnerCollege,
  } = req.body;

  if (!eventName || !eventDate || !participants || !description) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  console.log("Request body:", req.body); // Log the request body
  console.log("User ID:", req.user.userId); // Log the user ID

  try {
    const fest = await Fest.findById(req.params.festId);
    if (!fest || fest.createdBy.toString() !== req.user.userId) {
      return res
        .status(404)
        .json({ error: "Fest not found or not authorized" });
    }

    fest.events.push({
      eventName,
      eventDate,
      participants,
      sponsor,
      logoUrl,
      description,
      rounds,
      hostName,
      phoneNumber,
      timing,
      rules,
      status,
      location,
      currentRound,
      roundDetails,
      winner: {
        name: winnerName,
        college: winnerCollege,
      },
      createdBy: req.user.userId,
    });
    await fest.save();
    res.json(fest);
  } catch (error) {
    console.error("Error adding event:", error);
    res.status(400).json({ error: "Error adding event" });
  }
});

// Route to update a fest
app.put("/update-fest/:festId", authenticateToken, async (req, res) => {
  try {
    const fest = await Fest.findOneAndUpdate(
      { _id: req.params.festId, createdBy: req.user.userId },
      req.body,
      { new: true }
    );
    if (!fest) {
      return res
        .status(404)
        .json({ error: "Fest not found or not authorized" });
    }
    res.json(fest);
  } catch (error) {
    res.status(400).json({ error: "Error updating fest" });
  }
});

// Route to delete a fest
app.delete("/delete-fest/:festId", authenticateToken, async (req, res) => {
  try {
    const fest = await Fest.findOneAndDelete({
      _id: req.params.festId,
      createdBy: req.user.userId,
    });
    if (!fest) {
      return res
        .status(404)
        .json({ error: "Fest not found or not authorized" });
    }
    res.json({ message: "Fest deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Error deleting fest" });
  }
});

// Route to update an event within a fest
app.put(
  "/update-event/:festId/:eventId",
  authenticateToken,
  async (req, res) => {
    try {
      const fest = await Fest.findById(req.params.festId);
      if (!fest || fest.createdBy.toString() !== req.user.userId) {
        return res
          .status(404)
          .json({ error: "Fest not found or not authorized" });
      }

      const event = fest.events.id(req.params.eventId);
      if (!event || event.createdBy.toString() !== req.user.userId) {
        return res
          .status(404)
          .json({ error: "Event not found or not authorized" });
      }

      Object.assign(event, req.body);
      await fest.save();
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: "Error updating event" });
    }
  }
);

// Route to delete an event within a fest
app.delete(
  "/delete-event/:festId/:eventId",
  authenticateToken,
  async (req, res) => {
    try {
      const { festId, eventId } = req.params;

      const fest = await Fest.findById(festId);
      if (!fest || fest.createdBy.toString() !== req.user.userId) {
        return res
          .status(404)
          .json({ error: "Fest not found or not authorized" });
      }

      const event = fest.events.id(eventId);
      if (!event || event.createdBy.toString() !== req.user.userId) {
        return res
          .status(404)
          .json({ error: "Event not found or not authorized" });
      }

      fest.events.pull({ _id: eventId }); // Use pull method to remove the event
      await fest.save();

      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: "Error deleting event" });
    }
  }
);

// Route to get a specific fest by ID
app.get("/fests/:festId", authenticateToken, async (req, res) => {
  try {
    const fest = await Fest.findById(req.params.festId);
    if (!fest || fest.createdBy.toString() !== req.user.userId) {
      return res
        .status(404)
        .json({ error: "Fest not found or not authorized" });
    }
    res.json(fest);
  } catch (error) {
    res.status(500).json({ error: "Error fetching fest" });
  }
});

// Route to get all fests
app.get("/all-fests", authenticateToken, async (req, res) => {
  try {
    const fests = await Fest.find();
    res.status(200).json(fests);
  } catch (error) {
    res.status(500).json({ error: "Error fetching fests" });
  }
});

// Route to delete a fest for admin
app.delete(
  "/manage-delete-fest/:festId",
  authenticateToken,
  async (req, res) => {
    try {
      const fest = await Fest.findByIdAndDelete(req.params.festId);
      if (!fest) {
        return res.status(404).json({ error: "Fest not found" });
      }
      res.json({ message: "Fest deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: "Error deleting fest" });
    }
  }
);

// Route to get all fests (for user viewing)
app.get("/view-fests", async (req, res) => {
  try {
    const fests = await Fest.find({});
    res.status(200).json(fests);
  } catch (error) {
    res.status(500).json({ error: "Error fetching fests" });
  }
});

// Route to get all events of a specific fest (for user viewing)
app.get("/view-fest-events/:festId", async (req, res) => {
  try {
    const fest = await Fest.findById(req.params.festId);
    if (!fest) {
      return res.status(404).json({ error: "Fest not found" });
    }
    res.status(200).json(fest.events);
  } catch (error) {
    res.status(500).json({ error: "Error fetching events" });
  }
});

// New API endpoint to fetch the status and round details of an event
app.get(
  "/event-details/:festId/:eventId",
  authenticateToken,
  async (req, res) => {
    const { festId, eventId } = req.params;

    try {
      const fest = await Fest.findById(festId);
      if (!fest) {
        return res.status(404).json({ error: "Fest not found" });
      }

      const event = fest.events.id(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      res.json({
        status: event.status,
        roundDetails: event.roundDetails,
        currentRound: event.currentRound,
        winnerName: event.winner.name,
        winnerCollege: event.winner.college,
      });
    } catch (error) {
      console.error("Error fetching event details:", error);
      res.status(400).json({ error: "Error fetching event details" });
    }
  }
);

// New API endpoint to update the status, round details, and winner of an event
app.put(
  "/update-event-status-round/:festId/:eventId",
  authenticateToken,
  async (req, res) => {
    const { festId, eventId } = req.params;
    const { status, roundDetails, currentRound, winnerName, winnerCollege } =
      req.body;

    // Log the request body
    console.log("Request body:", req.body);

    try {
      const fest = await Fest.findById(festId);
      if (!fest) {
        return res.status(404).json({ error: "Fest not found" });
      }

      const event = fest.events.id(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      event.status = status;
      event.roundDetails = roundDetails.filter(
        (round) => round.roundNumber && round.timing
      );
      event.currentRound = currentRound;
      event.winner = {
        name: winnerName,
        college: winnerCollege,
      };

      await fest.save();
      res.json(fest);
    } catch (error) {
      console.error("Error updating event status and round details:", error);
      res
        .status(400)
        .json({ error: "Error updating event status and round details" });
    }
  }
);

// New API endpoint to fetch the details of a specific event
app.get("/user-event-detail/:festId/:eventId", async (req, res) => {
  const { festId, eventId } = req.params;

  try {
    const fest = await Fest.findById(festId);
    if (!fest) {
      return res.status(404).json({ error: "Fest not found" });
    }

    const event = fest.events.id(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({
      eventName: event.eventName,
      eventDate: event.eventDate,
      participants: event.participants,
      sponsor: event.sponsor,
      logoUrl: event.logoUrl,
      description: event.description,
      rounds: event.rounds,
      hostName: event.hostName,
      phoneNumber: event.phoneNumber,
      timing: event.timing,
      rules: event.rules,
      status: event.status,
      location: event.location,
      currentRound: event.currentRound,
      roundDetails: event.roundDetails,
      winnerName: event.winner.name,
      winnerCollege: event.winner.college,
    });
  } catch (error) {
    console.error("Error fetching event details:", error);
    res.status(400).json({ error: "Error fetching event details" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
