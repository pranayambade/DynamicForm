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
      { name: "country", type: "dropdown", label: "Country", required: true, options: [] },
      { name: "state", type: "dropdown", label: "State", required: true, options: [] },
      { name: "city", type: "dropdown", label: "City", required: true, options: [] },
      { name: "street", type: "text", label: "Street", required: true },
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
  const [formData, setFormData] = useState({
    country: "",
    state: "",
    city: "",
    firstName: "",
    lastName: "",
    age: "",
    street: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: ""
  });

  const [errors, setErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [submittedData, setSubmittedData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const formStructure = getFormFieldsFromAPI();

  // Static data for countries, states, and cities
  const countries = ["USA", "Canada", "India"];
  const states = {
    USA: ["California", "Florida", "Texas"],
    Canada: ["Ontario", "Quebec", "Alberta"],
    India: ["Maharashtra", "Delhi", "Karnataka"],
  };
  const cities = {
    California: ["Los Angeles", "San Francisco", "San Diego"],
    Florida: ["Miami", "Orlando", "Tampa"],
    Texas: ["Houston", "Austin", "Dallas"],
    Ontario: ["Toronto", "Ottawa", "Mississauga"],
    Quebec: ["Montreal", "Quebec City", "Laval"],
    Alberta: ["Calgary", "Edmonton", "Red Deer"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
    Delhi: ["New Delhi", "Gurugram", "Noida"],
    Karnataka: ["Bangalore", "Mysore", "Mangalore"],
  };

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
      setFormData({
        country: "",
        state: "",
        city: "",
        firstName: "",
        lastName: "",
        age: "",
        street: "",
        zipCode: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardholderName: ""
      });
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

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar-background">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-text">{Math.round(progress)}%</div>
        </div>

        <form onSubmit={handleSubmit}>
          {Object.values(formStructure).flat().map((field) => {
            if (field.name === "country") {
              return (
                <div key={field.name}>
                  <label>{field.label}:</label>
                  <select
                    name={field.name}
                    required={field.required}
                    onChange={handleFieldChange}
                    value={formData[field.name] || ""}
                  >
                    <option value="">Select</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  {errors[field.name] && <p className="error-message">{errors[field.name]}</p>}
                </div>
              );
            }
            if (field.name === "state") {
              return (
                <div key={field.name}>
                  <label>{field.label}:</label>
                  <select
                    name={field.name}
                    required={field.required}
                    onChange={handleFieldChange}
                    value={formData[field.name] || ""}
                    disabled={!formData.country}
                  >
                    <option value="">Select</option>
                    {(states[formData.country] || []).map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {errors[field.name] && <p className="error-message">{errors[field.name]}</p>}
                </div>
              );
            }
            if (field.name === "city") {
              return (
                <div key={field.name}>
                  <label>{field.label}:</label>
                  <select
                    name={field.name}
                    required={field.required}
                    onChange={handleFieldChange}
                    value={formData[field.name] || ""}
                    disabled={!formData.state}
                  >
                    <option value="">Select</option>
                    {(cities[formData.state] || []).map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {errors[field.name] && <p className="error-message">{errors[field.name]}</p>}
                </div>
              );
            }
            return (
              <div key={field.name}>
                <label>{field.label}:</label>
                <input
                  type={field.type}
                  name={field.name}
                  required={field.required}
                  onChange={handleFieldChange}
                  value={formData[field.name] || ""}
                />
                {errors[field.name] && <p className="error-message">{errors[field.name]}</p>}
              </div>
            );
          })}
          <button type="submit">{editingIndex !== null ? "Update" : "Submit"}</button>
        </form>

        {submissionStatus && <p className="submission-status">{submissionStatus}</p>}
      </div>

      <div className="submitted-data-container">
        <h2>Submitted Data</h2>
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Age</th> {/* Added Age column */}
              <th>Country</th>
              <th>State</th>
              <th>City</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {submittedData.map((data, index) => (
              <tr key={index}>
                <td>{data.firstName}</td>
                <td>{data.lastName}</td>
                <td>{data.age}</td> {/* Added Age data */}
                <td>{data.country}</td>
                <td>{data.state}</td>
                <td>{data.city}</td>
                <td>
                  <button onClick={() => handleEdit(index)}>Edit</button>
                  <button onClick={() => handleDelete(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
