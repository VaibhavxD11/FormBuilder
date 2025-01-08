import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { logout } from "../utils/auth";
import "./Header.css";

const Header = ({ toggleView, isFormView, useForm }) => {
  return (
    <div>
      <header className="header">
        <nav className="header-nav">
          <ul>
            <li className="header-nav-item">
              <NavLink to="/" activeClassName="active-link" exact>
                FormBuilder
              </NavLink>
            </li>
          </ul>
        </nav>
        {useForm ? "Fill in your response" :
        (<div className="header-center scale">
          <span className="view-label">Form Creation</span>
          <label className="switch">
            <input type="checkbox" checked={isFormView} onChange={toggleView} />
            <span className="slider"></span>
          </label>
          <span className="view-label">Forms List View</span>
        </div>)
        }
        <div className="header-right scale">
          <button onClick={logout}>Logout</button>
        </div>
      </header>
      <hr />
    </div>
  );
};

export default Header;
