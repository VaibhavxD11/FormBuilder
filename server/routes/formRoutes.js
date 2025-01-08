const express = require("express");
const { getForms, createForm, updateForm, deleteForm, getFormsByUser, saveFormResponse } = require("../controllers/formController");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, getFormsByUser);
router.post("/create", auth, createForm);
router.post("/response/:id", auth, saveFormResponse);
router.put("/edit/:id", auth, updateForm);
router.delete("/delete/:id", auth, deleteForm);

module.exports = router;
