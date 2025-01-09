const Form = require("../models/Form");
const FormResponse = require("../models/FormResponse");
const bcrypt = require("bcryptjs");


const getForms = async (req, res) => {
  const forms = await Form.find({ user: req.user.id });
  res.json(forms);
};

const createForm = async (req, res) => {
  try {
    const body = req.body;

    if (!Array.isArray(body) || body.length === 0) {
      return res.status(400).json({ message: "Invalid form data provided." });
    }

    const { FormName, formId } = body[0];
    const fields = body.slice(1);

    const createdBy = req.user?.email; 

    if (!createdBy) {
      return res.status(403).json({ message: "User email is required." });
    }

    if (!FormName || !formId || fields.length === 0) {
      return res.status(400).json({ message: "FormName, formId, and fields are required." });
    }

    const newForm = new Form({
      formName: FormName,
      formId,
      fields,
      createdBy,
    });

    const savedForm = await newForm.save();
    return res.status(201).json({ message: "Form saved successfully", form: savedForm });
  } catch (error) {
    console.error("Error saving form:", error);
    return res.status(500).json({ message: "Failed to save form", error });
  }
};


const getFormsByUser = async (req, res) => {
  try {
    const createdBy = req.user?.email;

    if (!createdBy) {
      return res.status(403).json({ message: "User email is required." });
    }

    const forms = await Form.find({ createdBy });
    if (forms.length === 0) {
      return res.status(201).json(forms);
    }

    return res.status(200).json(forms);
  } catch (error) {
    console.error("Error retrieving forms:", error);
    return res.status(500).json({ message: "Failed to retrieve forms", error });
  }
};


const updateForm = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const createdBy = req.user?.email;

    if (!createdBy) {
      return res.status(403).json({ message: "User email is required." });
    }

    if (!Array.isArray(body) || body.length === 0) {
      return res.status(400).json({ message: "Invalid form data provided." });
    }

    const { FormName } = body[0];
    const fields = body.slice(1);

    if (!FormName || fields.length === 0) {
      return res.status(400).json({ message: "FormName and fields are required." });
    }

    const updatedForm = await Form.findOneAndUpdate(
      { formId:id, createdBy },
      { formName: FormName, fields },
      { new: true, runValidators: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ message: "Form not found or access denied." });
    }

    return res.status(200).json({ message: "Form updated successfully", form: updatedForm });
  } catch (error) {
    console.error("Error updating form:", error);
    return res.status(500).json({ message: "Failed to update form", error });
  }
};



const deleteForm = async (req, res) => {
  try {
    const { id } = req.params;
    const createdBy = req.user?.email;

    if (!createdBy) {
      return res.status(403).json({ message: "User email is required." });
    }
    const deletedForm = await Form.findOneAndDelete({ formId:id, createdBy });

    if (!deletedForm) {
      return res.status(404).json({ message: "Form not found or access denied." });
    }

    return res.status(200).json({ message: "Form deleted successfully", form: deletedForm });
  } catch (error) {
    console.error("Error deleting form:", error);
    return res.status(500).json({ message: "Failed to delete form", error });
  }
};

const saveFormResponse = async (req, res) => {
  try {
    const { formId, responses } = req.body;
    const createdBy = req.user?.email;
    

    if (!formId || !responses || typeof responses !== 'object') {
      return res.status(400).json({
        error: 'Invalid request. formId and responses are required and must be in the correct format.',
      });
    }

    const form = await Form.findOne({ formId });
    if (!form) {
      return res.status(404).json({ error: 'Form not found.' });
    }

    const fieldValidationErrors = [];

    
    for (const field of form.fields) {
      const { id: fieldId, type: fieldType } = field;
      let responseValue = responses[fieldType];

      if (responseValue === undefined || responseValue === null) {
        fieldValidationErrors.push(`Missing response for field type: ${fieldType}`);
        continue;
      }

      if (fieldType === 'email') {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test(responseValue)) {
          fieldValidationErrors.push(`Invalid email format for field type: ${fieldType}`);
        }
      }

      if (fieldType === 'number' && isNaN(responseValue)) {
        fieldValidationErrors.push(`Invalid number format for field type: ${fieldType}`);
      }

      if (fieldType === 'password') {
        const salt = await bcrypt.genSalt(10);
        responseValue = await bcrypt.hash(responseValue, salt);
        responses[fieldType] = responseValue;
      }
    }

    if (fieldValidationErrors.length > 0) {
      return res.status(400).json({ error: fieldValidationErrors });
    }

    const formResponse = new FormResponse({
      formId,
      responses,
      submittedBy: createdBy,
      submittedAt: new Date(),
    });

    await formResponse.save();

    return res.status(201).json({
      message: 'Form responses saved successfully.',
      data: formResponse,
    });
  } catch (error) {
    console.error('Error saving form responses:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};



module.exports = { getForms, createForm, updateForm, deleteForm, getFormsByUser, saveFormResponse };
