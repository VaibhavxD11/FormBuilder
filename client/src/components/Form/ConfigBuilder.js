import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import "./ConfigBuilder.css";

const ConfigBuilder = ({ formConfig, onClose }) => {
  const [formResponses, setFormResponses] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isTouched, setIsTouched] = useState({});
  const [error, setError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
  
    const initialResponses = {};
    const initialTouched = {};

    formConfig.fields.forEach((field) => {
      initialResponses[field.type] = "";
      initialTouched[field.type] = false;
    });

    setFormResponses(initialResponses);
    setIsTouched(initialTouched);
  }, [formConfig]);


  const validateField = (fieldType, value) => {
    let errorMessage = "";

    switch (fieldType) {
      case "email":
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!value || !emailPattern.test(value)) {
          errorMessage = "Please enter a valid email address.";
        }
        break;
      case "text":
        if (!value.trim()) {
          errorMessage = "This field is required.";
        }
        break;
      case "number":
        if (!value || isNaN(value)) {
          errorMessage = "Please enter a valid number.";
        }
        break;
      default:
        break;
    }

    setFormErrors((prevErrors) => {
      if (prevErrors[fieldType] === errorMessage) {
        return prevErrors;
      }
      return {
        ...prevErrors,
        [fieldType]: errorMessage,
      };
    });

    return errorMessage === "";
  };

  
  const handleChange = (fieldType, value) => {
    setFormResponses((prev) => {
      if (prev[fieldType] === value) {
        return prev;
      }
      return {
        ...prev,
        [fieldType]: value,
      };
    });

    
    setIsTouched((prevTouched) => ({
      ...prevTouched,
      [fieldType]: true,
    }));

    
    validateField(fieldType, value);
  };

 
  useEffect(() => {
    const isValid = formConfig.fields.every((field) => {
      const fieldType = field.type;
      const fieldValue = formResponses[fieldType] || "";
      return validateField(fieldType, fieldValue);
    });
    setIsFormValid(isValid);
  }, [formResponses]);

  
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        formId: formConfig.formId,
        responses: formResponses,
      };

      await API.post(`/form/response/${formConfig.formId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onClose();
    } catch (err) {
      console.error("Error saving form:", err);
      setError("Failed to save form responses. Please try again.");
    }
  };

  
  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="config-builder">
      <h2>{formConfig.formName}</h2>
      {error && <p className="error-message">{error}</p>}

      <form>
        {formConfig.fields.map((field) => (
          <div key={field.id} className="form-field">
            <label htmlFor={field.id}>{field.title}</label>
            <input
              type={field.type}
              id={field.id}
              placeholder={field.placeholder}
              value={formResponses[field.type] || ""}
              onChange={(e) =>
                handleChange(field.type, e.target.value)
              }
              className={isTouched[field.type] && formErrors[field.type] ? "error" : ""}
            />
            {isTouched[field.type] && formErrors[field.type] && (
              <span className="error-text">{formErrors[field.type]}</span>
            )}
          </div>
        ))}
      </form>

      <div className="form-actions">
        <button onClick={handleSave} className="save-button" disabled={!isFormValid}>
          Save
        </button>
        <button onClick={handleCancel} className="cancel-button">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConfigBuilder;
