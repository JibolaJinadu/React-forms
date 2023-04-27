import React, { useState } from "react";
import axios from "axios";
import { nanoid } from "nanoid";
import "./index.css"

const INITIAL_STATE = { userName: "", email: "", subject: "", details: "" };

const VALIDATION = {
  email: [
    {
      isValid: (value) => !!value,
      message: "",
    },
    {
      isValid: (value) => /\S+@\S+\.\S+/.test(value),
      message: "Needs to be a valid email.",
    },
  ],
  userName: [
    {
      isValid: (value) => !!value,
      message: "",
    },
    {
      isValid: (value) => value.length > 8,
      message: "Needs to be First and Last Name.",
    },
  ],

  details: [
    {
      isValid: (value) => !!value,
      message: "",
    },
    {
      isValid: (value) => value.length < 100,
      message: "100 characters only",
    },
  ],
};

const getErrorFields = (form) =>
  Object.keys(form).reduce((acc, key) => {
    if (!VALIDATION[key]) return acc;

    const errorsPerField = VALIDATION[key]
      // get a list of potential errors for each field
      // by running through all the checks
      .map((validation) => ({
        isValid: validation.isValid(form[key]),
        message: validation.message,
      }))
      // only keep the errors
      .filter((errorPerField) => !errorPerField.isValid);

    return { ...acc, [key]: errorsPerField };
  }, {});

const ContactForm = () => {
  const [form, setForm] = useState(INITIAL_STATE);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (event) => {
    const { id, value } = event.target;
    setForm((prevState) => ({ ...prevState, [id]: value }));
  };

  const errorFields = getErrorFields(form);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const hasErrors = Object.values(errorFields).flat().length > 0;
    if (hasErrors) return;

    const { userName, email, subject, details } = form;
    const userData = {
      id: nanoid(),
      userName,
      email,
      subject,
      details,
    };

    try {
      await axios.post(
        "https://my-json-server.typicode.com/tundeojediran/contacts-api-server/inquiries",
        { userData }
      );
   
      setForm(INITIAL_STATE);
      setIsSuccess(true)
    } catch (error) {
      console.log(error);
      setSubmitError("There was an error submitting the form. Please try again later.");
    }
  };

  return (
    <div>
      {isSuccess && (
        <div className="success">
          Your inquiry has been submitted successfully!
        </div>
      )}
      {submitError && (
        <div className="failed">
          {submitError}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="userName">
            Full Name: <span className="asteric">*</span>
          </label>
          <input
            id="userName"
            type="text"
            placeholder="Your full name"
            value={form.userName}
            onChange={handleChange}
          />
          {errorFields.userName?.length ? (
            <span style={{ color: "red", display: "block" }}>
              {errorFields.userName[0].message}
            </span>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="email">
            Email-address: <span className="asteric">*</span>
          </label>
          <input
            id="email"
            type="text"
            placeholder="Your email-address"
            value={form.email}
            onChange={handleChange}
          />
          {errorFields.email?.length ? (
            <span style={{ color: "red", display: "block" }}>
              {errorFields.email[0].message}
            </span>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="subject">Subject:</label>
          <input
            id="subject"
            type="text"
            placeholder="Subject of your Inquiry"
            value={form.subject}
            onChange={handleChange}
          />
        </div>

        <div className="fieldLast">
          <label htmlFor="details">
            Message: <span className="asteric">*</span>
          </label>
          <input
            className="message"
            id="details" type="text" value=
            {form.details}
            placeholder="Comment here"
            onChange={handleChange}
            rows="4" cols="30"/>
          {errorFields.details?.length ? (
            <span className="error">
              {errorFields.details[0].message}
            </span>
          ) : null}
        </div>
        <span className="required">* - required fields</span>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export { ContactForm };
