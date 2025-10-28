import mongoose from "mongoose";

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

export default mongoose.model("Person", personSchema);
