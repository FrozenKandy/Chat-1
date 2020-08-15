var mongoose = require("mongoose"),
    User     = require("./user");


var listSchema = new mongoose.Schema({
    item : String,
    completed : Number
});

module.exports = mongoose.model("List", listSchema);
