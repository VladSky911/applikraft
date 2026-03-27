import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        {t("appName")}
      </Link>
      <div className="navbar-right">
        <div className="lang-switcher">
          <button
            onClick={() => changeLanguage("en")}
            className={i18n.language === "en" ? "active" : ""}
          >
            EN
          </button>
          <button
            onClick={() => changeLanguage("de")}
            className={i18n.language === "de" ? "active" : ""}
          >
            DE
          </button>
          <button
            onClick={() => changeLanguage("ru")}
            className={i18n.language === "ru" ? "active" : ""}
          >
            RU
          </button>
        </div>
        {token ? (
          <div className="navbar-user">
            <span>{user?.name}</span>
            <button onClick={handleLogout} className="btn btn-logout">
              {t("logout")}
            </button>
          </div>
        ) : (
          <div className="navbar-auth">
            <Link to="/login" className="btn">
              {t("login")}
            </Link>
            <Link to="/register" className="btn btn-primary">
              {t("register")}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
