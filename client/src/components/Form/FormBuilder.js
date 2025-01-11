import React, { useState, useEffect } from "react";
import "./FormBuilder.css";
import tickIcon from "../../assets/img/check.png";
import closeIcon from "../../assets/img/close.png";
import editIcon from "../../assets/img/edit.png";
import API from "../../utils/api";

const inputTypes = [
  { type: "email", label: "Email" },
  { type: "text", label: "Text" },
  { type: "password", label: "Password" },
  { type: "number", label: "Number" },
  { type: "date", label: "Date" },
];

const FormBuilder = ({ formData, toggleView }) => {
  const [formName, setFormName] = useState("");
  const [editForm, setEditForm] = useState(false);
  const [fields, setFields] = useState([]);
  const [error, setError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (formData) {
      setFormName(formData.formName || "");
      setFields(formData.fields || []);
      setEditForm(true);
    }
  }, [formData]);

  const addField = (type) => {
    if (fields.length >= 20) {
      setError("You can only add up to 20 inputs.");
      return;
    }
    setError("");
    setFields((prevFields) => [
      ...prevFields,
      {
        id: Date.now(),
        type,
        title: "",
        placeholder: "",
        confirmed: false,
        titleError: false,
        isEditing: true,
      },
    ]);
  };


  const updateField = (id, key, value) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, [key]: value } : field
      )
    );
  };

  const deleteField = (id) => {
    setFields((prevFields) => prevFields.filter((field) => field.id !== id));
    checkFormValidity(fields);
  };

  const confirmField = (id) => {
    setFields((prevFields) => {
      const updatedFields = prevFields.map((field) => {
        if (field.id === id) {
          const titleError = field.title.trim() === "";
          return {
            ...field,
            confirmed: !titleError,
            titleError,
            isEditing: false,
          };
        }
        return field;
      });

      checkFormValidity(updatedFields);
      return updatedFields;
    });
  };

  const checkFormValidity = (fields) => {
    const allFieldsValid = fields?.every(
      (field) => field?.confirmed && !field?.titleError
    );
    setIsFormValid(allFieldsValid);
  };

  const handleEdit = (id) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id
          ? { ...field, isEditing: true, confirmed: false }
          : field
      )
    );
  };

  const saveForm = async () => {
    const token = localStorage.getItem("authToken");
    if (!formName.trim()) {
      setError("Please provide a name for the form.");
      return;
    }
    if (fields.length === 0) {
      setError("Form cannot be empty, enter some fields.");
      return;
    }
    let final = [...fields];
    final.unshift({ FormName: formName, formId: Date.now() });

    if (editForm) {
      await API.put(`/form/edit/${formData.formId}`, final, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((data) => {
        })
        .catch((e) => console.log(e));
    } else {
      await API.post("/form/create", final, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((data) => {
        })
        .catch((e) => console.log(e));
    }
    toggleView();
  };

  const cancelForm = () => {
    toggleView();
  };

  return (
    <div className="dynamic-form-builder">
      
      <div className="left-section">
        <h3>Input Types</h3>
        
        <input
          type="text"
          value={formName}
          onChange={(e) => {setFormName(e.target.value); checkFormValidity(fields)}}
          placeholder="Enter Form Name"
          className="form-name-input"
        />
        
        {error && <p className="error-message">{error}</p>}
        <div className="input-buttons-container">
          {inputTypes.map((input) => (
            <button
              key={input.type}
              onClick={() => addField(input.type)}
              className="input-button"
            >
              {input.label}
            </button>
          ))}
        </div>
        <div className="footer">
          <button
            className="save-button"
            onClick={saveForm}
            disabled={!isFormValid}
          >
            Save Form
          </button>
          <button className="cancel-button" onClick={cancelForm}>
            Cancel
          </button>
        </div>
      </div>

      <div className="right-section" style={{ overflowY: "auto" }}>
        <h3>Preview</h3>
        <div className="fields-grid">
          {fields.map((field) => (
            <div className="field-container" key={field.id}>
              <div className="field-header">
                {!field.confirmed ? (
                  <>
                    <img
                      src={tickIcon}
                      alt="Confirm"
                      onClick={() => confirmField(field.id)}
                      title="Confirm"
                    />
                    <img
                      src={closeIcon}
                      alt="Close"
                      onClick={() => deleteField(field.id)}
                      title="Close"
                    />
                  </>
                ) : (
                  <>
                    <img
                      src={editIcon}
                      alt="Edit"
                      onClick={() => handleEdit(field.id)}
                      title="Edit"
                    />
                    <img
                      src={closeIcon}
                      alt="Delete"
                      onClick={() => deleteField(field.id)}
                      title="Delete"
                    />
                  </>
                )}
              </div>
              {field.confirmed ? (
                <>
                  <label className="field-title">{field.title}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="field-input"
                    disabled={!field.isEditing}
                  />
                </>
              ) : (
                <div className="field-config">
                  <input
                    type="text"
                    placeholder="Set Title"
                    value={field.title}
                    onChange={(e) =>
                      updateField(field.id, "title", e.target.value)
                    }
                    className="field-config-input"
                  />
                  <input
                    type="text"
                    placeholder="Set Placeholder"
                    value={field.placeholder}
                    onChange={(e) =>
                      updateField(field.id, "placeholder", e.target.value)
                    }
                    className="field-config-input"
                  />
                  {field.titleError && (
                    <p className="error-message">Title cannot be empty</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
