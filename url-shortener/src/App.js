import React, { useState } from "react";
import "./App.css";

// ✅ Password Modal Component
function PasswordModal({ open, onClose, onVerify }) {
  const [enteredPass, setEnteredPass] = useState("");

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>🔐 Enter Password</h3>
        <input
          type="password"
          placeholder="Enter password"
          value={enteredPass}
          onChange={(e) => setEnteredPass(e.target.value)}
        />
        <div className="modal-btns">
          <button onClick={() => onVerify(enteredPass)}>✅ Submit</button>
          <button onClick={onClose}>❌ Cancel</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  // ✅ Added password field in state
  const [urls, setUrls] = useState([
    { long: "", short: "", shortcode: "", validity: "", password: "" },
  ]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // ✅ For modal state
  const [showModal, setShowModal] = useState(false);
  const [activeLink, setActiveLink] = useState(null);

  const handleChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const handleAddField = () => {
    if (urls.length < 10) {
      setUrls([
        ...urls,
        { long: "", short: "", shortcode: "", validity: "", password: "" },
      ]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newUrls = urls.map((item) => {
      if (!item.long.trim()) return item;

      const randomSlug =
        item.shortcode && item.shortcode.trim() !== ""
          ? item.shortcode
          : Math.random().toString(36).substring(6);

      const expiry = item.validity && !isNaN(item.validity) ? item.validity : 30;

      return {
        ...item,
        short: `https://sho.rt/${randomSlug}`,
        validity: expiry,
        password: item.password || "", // ✅ Keep password
      };
    });

    setUrls(newUrls);
  };

  const handleCopy = (shortUrl, index) => {
    navigator.clipboard.writeText(shortUrl).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  // ✅ Verify password function
  const handleVerifyPassword = (enteredPass) => {
    if (enteredPass === activeLink.password) {
      window.open(activeLink.long, "_blank"); // redirect to original long URL
      setShowModal(false);
      setActiveLink(null);
    } else {
      alert("❌ Wrong password!");
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>🌈 URL Shortener</h1>
        <p>Create colorful, fun & short links with custom codes, validity & password protection</p>
      </header>

      {/* Main Form */}
      <main className="main">
        <form className="form" onSubmit={handleSubmit}>
          {urls.map((item, index) => (
            <div key={index} className="url-field">
              <input
                type="text"
                placeholder={`Enter URL #${index + 1}`}
                value={item.long}
                onChange={(e) => handleChange(index, "long", e.target.value)}
              />
              <input
                type="text"
                placeholder="Custom Shortcode (optional)"
                value={item.shortcode}
                onChange={(e) => handleChange(index, "shortcode", e.target.value)}
              />
              <input
                type="number"
                placeholder="Validity (minutes)"
                value={item.validity}
                onChange={(e) => handleChange(index, "validity", e.target.value)}
              />
              {/* ✅ Password Field */}
              <input
                type="password"
                placeholder="Password (optional)"
                value={item.password}
                onChange={(e) => handleChange(index, "password", e.target.value)}
              />

              {item.short && (
                <div className="result-card">
                  <p>
                    <strong>Short:</strong>{" "}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (item.password) {
                          setActiveLink(item); // store clicked link
                          setShowModal(true); // open modal
                        } else {
                          window.open(item.long, "_blank"); // direct if no password
                        }
                      }}
                    >
                      {item.short}
                    </a>
                  </p>
                  <p>⏳ Valid for: {item.validity} minutes</p>
                  <button
                    type="button"
                    className="copy-btn"
                    onClick={() => handleCopy(item.short, index)}
                  >
                    📋 Copy
                  </button>
                  {copiedIndex === index && (
                    <span className="copied-msg">Copied!</span>
                  )}
                </div>
              )}
            </div>
          ))}

          <div className="btn-group">
            <button
              type="button"
              className="add-btn"
              onClick={handleAddField}
              disabled={urls.length >= 10}
            >
              ➕ Add More
            </button>
            <button type="submit" className="shorten-btn">
              🚀 Shorten All
            </button>
          </div>
        </form>
      </main>

      {/* ✅ Modal Component */}
      <PasswordModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onVerify={handleVerifyPassword}
      />

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 | Built with 💜 using React</p>
      </footer>
    </div>
  );
}

export default App;
