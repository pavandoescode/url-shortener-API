const express = require("express");
const URLModel = require("./models/url");
const mongoose = require("mongoose");
const { body, validationResult } = require('express-validator');
const ShortUniqueId = require('short-unique-id');

const app = express();
const PORT = 8080;
const mongoURL = "mongodb://localhost:27017/url-shortener-API";

app.use(express.json());

const validateURL = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateAlias = async (req, res, next) => {
  const alias = req.body.alias;
  if (alias) {
    const existingURL = await URLModel.findOne({ shortId: alias });
    if (existingURL) {
      return res.status(400).json({ error: "Alias already exists" });
    }
  }
  next();
};


app.post("/", [body('url').isURL().withMessage('Must be a valid URL'), validateAlias, validateURL,], async function handleGenerateNewShortURL(req, res) {
  const { url, alias, expirationDate } = req.body;

  const shortID = new ShortUniqueId();
  const uniqueShortID = alias ? alias : shortID.randomUUID();

  try {
    const newURL = new URLModel({
      shortId: uniqueShortID,
      redirectURL: url,
      expirationDate: expirationDate || undefined,
    });
    await newURL.save();

    return res.json({ id: uniqueShortID });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/",(req,res)=>{
  res.send("Hello World!")
})


app.get("/analytics/:shortId", async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  try {
    const result = await URLModel.findOne({ shortId });
    if (!result) {
      return res.status(404).json({ error: "Oops! This URL does not exist." });
    }

    return res.json({
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
      expirationDate: result.expirationDate,
      createdBy: result.createdBy
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/:id", async function handleRedirect(req, res) {
  const shortId = req.params.id;
  try {
    const result = await URLModel.findOne({ shortId });
    if (!result) {
      return res.status(404).json({ error: "Oops! This URL does not exist." });
    }


    if (result.expirationDate && new Date(result.expirationDate) < new Date()) {
      return res.status(400).json({ error: "This URL has expired" });
    }

  
    result.visitHistory.push({
      timestamp: new Date(),
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    });
    await result.save();

    return res.redirect(result.redirectURL); 
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


mongoose.connect(mongoURL, {})
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));
