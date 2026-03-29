import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";

function Dashboard() {
  const { t } = useTranslation();
  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    company: "",
    position: "",
    url: "",
    status: "applied",
    notes: "",
    appliedDate: "",
  });
  const [files, setFiles] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const API = "http://localhost:5000/api/applications";

  const headers = { Authorization: `Bearer ${token}` };

  const fetchApplications = async () => {
    try {
      const res = await axios.get(API, { headers });
      setApplications(res.data);
    } catch (err) {
      console.log("Error fetching applications");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    if (files) {
      Array.from(files).forEach((file) => formData.append("screenshots", file));
    }

    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, formData, { headers });
      } else {
        await axios.post(API, formData, { headers });
      }
      setForm({
        company: "",
        position: "",
        url: "",
        status: "applied",
        notes: "",
        appliedDate: "",
      });
      setFiles(null);
      setShowForm(false);
      setEditId(null);
      fetchApplications();
    } catch (err) {
      console.log("Error saving application");
    }
  };

  const handleEdit = (app) => {
    setForm({
      company: app.company,
      position: app.position,
      url: app.url || "",
      status: app.status,
      notes: app.notes || "",
      appliedDate: app.appliedDate ? app.appliedDate.split("T")[0] : "",
    });
    setEditId(app._id);
    setShowForm(true);
  };

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`, { headers });
      setDeleteConfirmId(null);
      fetchApplications();
    } catch (err) {
      console.log("Error deleting application");
    }
  };

  const filteredApplications = applications
    .filter((app) => {
      const matchesSearch =
        app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.position.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || app.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.appliedDate || a.createdAt);
      const dateB = new Date(b.appliedDate || b.createdAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  const statusColors = {
    applied: "#3b82f6",
    interview: "#f59e0b",
    rejected: "#ef4444",
    offer: "#10b981",
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>
          {t("welcome")}, {user?.name}!
        </h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditId(null);
            setForm({
              company: "",
              position: "",
              url: "",
              status: "applied",
              notes: "",
              appliedDate: "",
            });
          }}
        >
          {showForm ? t("cancel") : t("addApplication")}
        </button>
      </div>

      <div className="status-counters">
        <div
          className="counter-card"
          style={{ borderLeft: "4px solid #3b82f6" }}
        >
          <span className="counter-number">
            {applications.filter((a) => a.status === "applied").length}
          </span>
          <span className="counter-label">{t("applied")}</span>
        </div>
        <div
          className="counter-card"
          style={{ borderLeft: "4px solid #f59e0b" }}
        >
          <span className="counter-number">
            {applications.filter((a) => a.status === "interview").length}
          </span>
          <span className="counter-label">{t("interview")}</span>
        </div>
        <div
          className="counter-card"
          style={{ borderLeft: "4px solid #ef4444" }}
        >
          <span className="counter-number">
            {applications.filter((a) => a.status === "rejected").length}
          </span>
          <span className="counter-label">{t("rejected")}</span>
        </div>
        <div
          className="counter-card"
          style={{ borderLeft: "4px solid #10b981" }}
        >
          <span className="counter-number">
            {applications.filter((a) => a.status === "offer").length}
          </span>
          <span className="counter-label">{t("offer")}</span>
        </div>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          className="search-input"
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="btn sort-btn"
          onClick={() =>
            setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
          }
        >
          {sortOrder === "newest" ? t("newest") : t("oldest")} ↕
        </button>
        <div className="filter-buttons">
          {["all", "applied", "interview", "rejected", "offer"].map(
            (status) => (
              <button
                key={status}
                className={`filter-btn ${filterStatus === status ? "active" : ""}`}
                onClick={() => setFilterStatus(status)}
                style={
                  filterStatus === status && status !== "all"
                    ? { backgroundColor: statusColors[status], color: "white" }
                    : {}
                }
              >
                {status === "all" ? t("all") : t(status)}
              </button>
            ),
          )}
        </div>
      </div>

      {showForm && (
        <div className="form-card glass">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>{t("company")}</label>
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t("position")}</label>
                <input
                  type="text"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t("url")}</label>
                <input
                  type="url"
                  name="url"
                  value={form.url}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>{t("appliedDate")}</label>
                <input
                  type="date"
                  name="appliedDate"
                  value={form.appliedDate}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t("status")}</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="applied">{t("applied")}</option>
                  <option value="interview">{t("interview")}</option>
                  <option value="rejected">{t("rejected")}</option>
                  <option value="offer">{t("offer")}</option>
                </select>
              </div>
              <div className="form-group">
                <label>{t("screenshots")}</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setFiles(e.target.files)}
                />
              </div>
            </div>
            <div className="form-group">
              <label>{t("notes")}</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows="3"
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              {t("save")}
            </button>
          </form>
        </div>
      )}

      {filteredApplications.length === 0 ? (
        <p className="no-data">{t("noApplications")}</p>
      ) : (
        <div className="applications-list">
          {filteredApplications.map((app) => (
            <div key={app._id} className="app-card glass">
              <div
                className="app-card-header"
                onClick={() =>
                  setExpandedId(expandedId === app._id ? null : app._id)
                }
              >
                <div className="app-card-info">
                  <h3>{app.company}</h3>
                  <p>{app.position}</p>
                </div>
                <span
                  className="status-badge"
                  style={{ backgroundColor: statusColors[app.status] }}
                >
                  {t(app.status)}
                </span>
              </div>
              {expandedId === app._id && (
                <div className="app-card-details">
                  {app.url && (
                    <p>
                      <strong>{t("url")}:</strong>{" "}
                      <a href={app.url} target="_blank" rel="noreferrer">
                        {app.url}
                      </a>
                    </p>
                  )}
                  {app.appliedDate && (
                    <p>
                      <strong>{t("appliedDate")}:</strong>{" "}
                      {new Date(app.appliedDate).toLocaleDateString()}
                    </p>
                  )}
                  {app.notes && (
                    <p>
                      <strong>{t("notes")}:</strong> {app.notes}
                    </p>
                  )}
                  {app.screenshots && app.screenshots.length > 0 && (
                    <div className="screenshots">
                      <strong>{t("screenshots")}:</strong>
                      <div className="screenshot-grid">
                        {app.screenshots.map((src, i) => (
                          <img
                            key={i}
                            src={`http://localhost:5000/${src}`}
                            alt="screenshot"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="app-card-actions">
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEdit(app)}
                    >
                      {t("edit")}
                    </button>
                    {deleteConfirmId === app._id ? (
                      <div className="delete-confirm">
                        <span>{t("confirmDelete")}</span>
                        <button
                          className="btn btn-delete"
                          onClick={() => handleDelete(app._id)}
                        >
                          {t("yes")}
                        </button>
                        <button
                          className="btn"
                          onClick={() => setDeleteConfirmId(null)}
                        >
                          {t("no")}
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn btn-delete"
                        onClick={() => setDeleteConfirmId(app._id)}
                      >
                        {t("delete")}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
