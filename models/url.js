
const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  shortId: { type: String, required: true, unique: true },
  redirectURL: { 
    type: String, required: true
   },
  visitHistory: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    userAgent: String,
    ipAddress: String,
  }],
  expirationDate: { type: Date },
});

const URLModel = mongoose.model("URL", urlSchema);

module.exports = URLModel;
