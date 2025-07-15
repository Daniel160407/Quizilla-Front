import { useState } from "react";
import "../../style/forms/ClientGroupForm.scss";
import ClientLogo from "../uiComponents/ClientLogo";

const ClientGroupForm = ({ onSubmit }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name);
      setName("");
    }
  };

  return (
    <>
      <ClientLogo />
      <form className="client-group-form" onSubmit={handleSubmit}>
        <label>
          Enter Group Name:
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <button type="submit">Next</button>
      </form>
    </>
  );
};

export default ClientGroupForm;
