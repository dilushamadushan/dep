const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');

const verifyJwt = require("./middleware/verifyJwt");
const auth = require("./routes/auth.routes");
const customer = require("./routes/customer.routes");
const corsOptions = require("./config/corsOptions");
const credentials = require("./middleware/credentials");
const adminRouter = require("./routes/admin.routes");

const app = express();
const port = process.env.PORT || 5000;

app.use(credentials);

app.get("/", (req, res) => res.send("API is running!"));

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", auth);


app.use(verifyJwt);
app.use("/api/v1", customer);
app.use("/api/v1", adminRouter);


module.exports = app;