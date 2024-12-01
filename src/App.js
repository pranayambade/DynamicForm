import React, { useState } from "react";
import "./App.css";

const getFormFieldsFromAPI = () => {
  return {
    user: [
      { name: "firstName", type: "text", label: "First Name", required: true },
      { name: "lastName", type: "text", label: "Last Name", required: true },
      { name: "age", type: "number", label: "Age", required: false },
    ],
    address: [
      { name: "street", type: "text", label: "Street", required: true },
      { name: "city", type: "text", label: "City", required: true },
      {
        name: "state",
        type: "dropdown",
        label: "State",
        options: ["California", "Texas", "New York"],
        required: true,
      },
      { name: "zipCode", type: "text", label: "Zip Code", required: false },
    ],
    payment: [
      { name: "cardNumber", type: "text", label: "Card Number", required: true },
      { name: "expiryDate", type: "date", label: "Expiry Date", required: true },
      { name: "cvv", type: "password", label: "CVV", required: true },
      { name: "cardholderName", type: "text", label: "Cardholder Name", required: true },
    ],
  };
};

function App() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [submittedData, setSubmittedData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const formStructure = getFormFieldsFromAPI();

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    updateProgress();
  };

  const updateProgress = () => {
    const requiredFields = Object.values(formStructure).flat().filter((field) => field.required);
    const filledFields = requiredFields.filter(
      (field) => formData[field.name] && formData[field.name].trim() !== ""
    ).length;
    const progressPercentage = (filledFields / requiredFields.length) * 100;
    setProgress(progressPercentage);
  };

  const validateForm = () => {
    const newErrors = {};
    Object.values(formStructure).flat().forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
      if (field.type === "number" && formData[field.name] && isNaN(formData[field.name])) {
        newErrors[field.name] = `${field.label} must be a number`;
      }
    });
    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      if (editingIndex !== null) {
        setSubmittedData((prevData) =>
          prevData.map((item, index) => (index === editingIndex ? formData : item))
        );
        setEditingIndex(null);
        setSubmissionStatus("Form updated successfully!");
      } else {
        setSubmittedData((prevData) => [...prevData, formData]);
        setSubmissionStatus("Form submitted successfully!");
      }
      setFormData({});
      setProgress(0);
    }
  };

  const handleEdit = (index) => {
    setFormData(submittedData[index]);
    setEditingIndex(index);
    setSubmissionStatus("");
  };

  const handleDelete = (index) => {
    setSubmittedData((prevData) => prevData.filter((_, i) => i !== index));
  };

  return (
    <div className="app-container">
      <div className="form-container">
        <h1>Dynamic Form</h1>
        <form onSubmit={handleSubmit}>
          {Object.values(formStructure).flat().map((field) => (
            <div key={field.name}>
              <label>{field.label}:</label>
              {field.type === "dropdown" ? (
                <select
                  name={field.name}
                  required={field.required}
                  onChange={handleFieldChange}
                  value={formData[field.name] || ""}
                >
                  <option value="">Select</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  required={field.required}
                  onChange={handleFieldChange}
                  value={formData[field.name] || ""}
                />
              )}
              {errors[field.name] && <p className="error-message">{errors[field.name]}</p>}
            </div>
          ))}
          <button type="submit">{editingIndex !== null ? "Update" : "Submit"}</button>
        </form>

        {submissionStatus && <p className="success-message">{submissionStatus}</p>}
      </div>

      <div className="table-container">
        {submittedData.length > 0 && (
          <div className="table-section">
            <h2>Submitted Data</h2>
            <table>
              <thead>
                <tr>
                  {Object.values(formStructure).flat().map((field) => (
                    <th key={field.name}>{field.label}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submittedData.map((data, index) => (
                  <tr key={index}>
                    {Object.keys(data).map((key) => (
                      <td key={key}>{data[key]}</td>
                    ))}
                    <td>
                      <button onClick={() => handleEdit(index)}>Edit</button>
                      <button onClick={() => handleDelete(index)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
