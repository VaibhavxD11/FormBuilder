import React, { useState } from "react";
import Header from "./Header";
import FormList from "../components/Form/FormList";
import FormBuilder from "../components/Form/FormBuilder";
import ConfigBuilder from "./Form/ConfigBuilder";

const Dashboard = () => {
  const [isFormView, setIsFormView] = useState(true);
  const [currentForm, setCurrentForm] = useState(null);
  const [isFormReady, setIsFormReady] = useState(false);

  
  const handleEditForm = (form) => {
    setIsFormView(false); 
    setCurrentForm(form);
  };

  const handleViewForm = (form) =>{
    setIsFormReady(true);
    setCurrentForm(form);
  }


  const toggleView = () => {
    setIsFormView((prev) => !prev);
    if (isFormView) {
        setCurrentForm(null); 
      }
  };

  const onClose = () =>{
    window.location.href = "/"
  }

  return (
    <div>
      <Header toggleView={toggleView} isFormView={isFormView} useForm={isFormReady}/>
      {isFormReady ? <ConfigBuilder formConfig={currentForm} onClose={onClose}/> :(
      isFormView ? (
        <FormList handleEditForm={handleEditForm} handleViewForm={handleViewForm} />
      ) : (
        <FormBuilder formData={currentForm}  toggleView={toggleView}/>
      ))}
    </div>
  );
};

export default Dashboard;
