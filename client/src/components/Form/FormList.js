import React, { useEffect, useState } from "react";
import "./FormList.css";
import API from "../../utils/api";
import editIcon from "../../assets/img/edit.png";
import deleteIcon from "../../assets/img/delete.png";

const FormList = ({ handleEditForm, handleViewForm }) => {
  const [forms, setForms] = useState([]);
  const [error, setError] = useState("");
  const [loader , setLoader] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await API.get("/form/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setForms(response.data);
        setLoader(false);
        setError("");
      } catch (err) {
        setError("Failed to fetch forms. Please try again.");
        console.error(err);
      }
    };

    fetchForms();
  }, []);

  const handleDeleteForm = async (formId) => {
    try {
      const token = localStorage.getItem("authToken");
      await API.delete(`/form/delete/${formId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setForms(forms.filter((form) => form.formId !== formId));
    } catch (err) {
      console.error("Failed to delete the form", err);
      setError("Failed to delete the form. Please try again.");
    }
  };

  return (
    <div className="form-list-container">
      <h2>Your Forms</h2>
      {error && <p className="error-message">{error}</p>}
      {loader ? (<div className="loading-forms">
        <p>Loading your forms...</p>
        </div>) :
      forms.length === 0 ? (
        <p className="no-forms-message">No forms found.</p>
      ) : (
        <ul className="form-list">
          {forms.map((form) => (
            <li key={form.formId} className="form-list-item">
              <div className="form-details">
                <span
                  className="form-name clickable"
                  onClick={() => handleViewForm(form)}
                >
                  {form.formName}
                </span>
                <div className="form-actions">
                  <img
                    src={editIcon}
                    alt="Edit"
                    className="action-icon"
                    onClick={() => handleEditForm(form)}
                  />
                  <img
                    src={deleteIcon}
                    alt="Delete"
                    className="action-icon"
                    onClick={() => handleDeleteForm(form.formId)}
                  />
                </div>
                <span className="form-date">
                  Created on:{" " + new Date(form.createdAt).toLocaleDateString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FormList;
