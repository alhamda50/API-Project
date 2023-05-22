const mongoose = require("mongoose");
//Create publication schema
const PublicationSchema = mongoose.Schema(
  {
    id: Number,
    name: String,
    books: [String]
  }
);

const PublicationModel = mongoose.model("Publications" , PublicationSchema);

module.exports = PublicationModel;
