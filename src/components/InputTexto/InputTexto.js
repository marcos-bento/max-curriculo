import React from "react";
import "./InputTexto.css";

function InputTexto({ label, register, name, required, type = "text" }) {
  return (
    <div className="input-wrapper">
      <label className="input-label" htmlFor={name}>{label}</label>
      <input
        id={name}
        {...register(name, { required })}
        type={type}
        className="input-campo"
      />
    </div>
  );
}

export default InputTexto;
