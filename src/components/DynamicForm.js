
import React, { useState } from "react";
const getFormFields = (formType) => {
    const formTemplates = {
      user: {
        fields: [
          { name: "firstName", type: "text", label: "First Name", required: true },
          { name: "lastName", type: "text", label: "Last Name", required: true },
          { name: "age", type: "number", label: "Age", required: false },
        ],
      },
      address: {
        fields: [
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
      },
      payment: {
        fields: [
          { name: "cardNumber", type: "text", label: "Card Number", required: true },
          { name: "expiryDate", type: "date", label: "Expiry Date", required: true },
          { name: "cvv", type: "password", label: "CVV", required: true },
          { name: "cardholderName", type: "text", label: "Cardholder Name", required: true },
        ],
      },
    };
    return formTemplates[formType];
  };


  function DynamicForm({ formType }) {
    const formStructure = getFormFields(formType);
    const [formData, setFormData] = useState({});
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Form Submitted:", formData);
    };
  
    return (
      <form onSubmit={handleSubmit}>
        {formStructure.fields.map((field) => (
          <div key={field.name}>
            <label>{field.label}:</label>
            {field.type === "dropdown" ? (
              <select name={field.name} required={field.required} onChange={handleChange}>
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
                onChange={handleChange}
              />
            )}
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    );
  }
  
  export default DynamicForm;
    