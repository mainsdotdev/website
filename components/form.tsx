import { useState } from "react";

export default function Form() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [error, setError] = useState(""); // State for error message
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError(""); // Reset error message on new submission
    setSuccessMessage(""); // Reset success message on new submission

    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage("Thanks for submitting."); // Set success message
        setFormData({ name: "", email: "" }); // Optionally reset form fields
      } else {
        setError("Error submitting form. Please try again."); // Set error message
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again."); // Handle unexpected errors
    }
  };

  return (
    <>
      <form className="mb-12" onSubmit={handleSubmit}>
        <div className="flex items-center border-b border-black py-2 mb-4">
          <input
            className="appearance-none bg-transparent border-none w-full text-black text-lg mr-3 px-1 leading-tight focus:outline-none placeholder:text-black"
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
        </div>
        <div className="flex items-center border-b border-black py-2 mb-4">
          <input
            className="appearance-none bg-transparent border-none w-full text-black text-lg mr-3 px-1 leading-tight focus:outline-none placeholder:text-black"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Email"
          />
        </div>

        <button
          type="submit"
          className="text-black text-lg font-medium mt-3 border border-black px-3 py-2 rounded-md hover:bg-black ease-in duration-300 hover:text-white"
        >
          Apply for early access
        </button>
        {error && (
          <p className="text-red-100 font-medium text-sm mt-2">{error}</p>
        )}
        {successMessage && (
          <p className="text-black font-medium text-sm mt-2">
            {successMessage}
          </p>
        )}
      </form>
    </>
  );
}
