const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["email", "text", "password", "number", "date"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: "",
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  titleError: {
    type: Boolean,
    default: false,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
});

const formSchema = new mongoose.Schema({
  formName: {
    type: String,
    required: true,
    trim: true,
  },
  formId: {
    type: Number,
    unique: true,
    required: true,
  },
  fields: [fieldSchema],
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Form = mongoose.model("Form", formSchema);

module.exports = Form;
