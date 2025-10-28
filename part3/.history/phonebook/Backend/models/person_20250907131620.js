import mongoose from "mongoose";

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name must be at least 3 characters long"], 
  },
  number: {
    type: String,
    required: [true, "Number is required"],
    minlength: [8, "Number must be atleast 8 characters long"],
    validate: {
      validator: function (v) {
        // Must match XX-XXXXX... or XXX-XXXXX...
        return /^\d{2,3}-\d+$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid phone number! Format: XX-XXXX... or XXX-XXXX...`,
    },
  }
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Person = mongoose.model("Person", personSchema);
export default Person;
