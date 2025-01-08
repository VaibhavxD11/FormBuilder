const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const formRoutes = require("./routes/formRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: "https://formbuilder-1qp5.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(bodyParser.json());
app.use(express.json());

app.use("/api/form", formRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
