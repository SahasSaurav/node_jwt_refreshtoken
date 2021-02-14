const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { connectDB } = require("./config/db");
const authRoute = require("./routes/authRoute");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { verifyAccessToken  } = require("./middleware/authMiddleware");

const app = express();

dotenv.config();
connectDB();

app.use(express.json()); // api to json data
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/auth", authRoute);
app.get("/", verifyAccessToken, async (req, res) => {
  console.log(req.user)
  res.send("hello");
});

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(
  port,
  console.log(
    `Server is running on port ${port} in ${process.env.NODE_ENV} mode`
  )
);
