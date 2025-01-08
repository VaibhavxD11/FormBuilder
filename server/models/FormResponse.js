const mongoose = require('mongoose');

const FormResponseSchema = new mongoose.Schema({
  formId: { type: String, required: true },
  responses: { type: Map, of: String, required: true },
  submittedBy:{ type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FormResponse', FormResponseSchema);
