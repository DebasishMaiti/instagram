import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TermsAndConditions from "./pages/TermsAndConditions"; // Import the terms page component

const Home = () => {
  const [accessToken, setAccessToken] = useState("");
  const [igUserId, setIgUserId] = useState("");
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const BACKEND_URL = "https://instagram-three-psi.vercel.app/instagram";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("access_token");
    const id = params.get("ig_user_id");

    if (token && id) {
      setAccessToken(token);
      setIgUserId(id);
    }
  }, []);

  const handleLogin = async () => {
    const res = await axios.get(`${BACKEND_URL}/auth`);
    window.location.href = res.data.authUrl;
  };

  const handleShowProfile = async () => {
    try {
      const res = await axios.get(
        `https://graph.facebook.com/v18.0/${igUserId}?fields=username,profile_picture_url&access_token=${accessToken}`
      );
      setUsername(res.data.username);
      setProfilePic(res.data.profile_picture_url);
    } catch (err) {
      alert("Failed to fetch profile");
    }
  };

  const handlePost = async () => {
    if (!imageUrl || !caption) {
      alert("Please enter both an image URL and caption.");
      return;
    }

    try {
      await axios.post(`${BACKEND_URL}/post`, {
        accessToken,
        igUserId,
        imageUrl,
        caption,
      });
      alert("✅ Post successful!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("❌ Post failed.");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      {!accessToken ? (
        <button onClick={handleLogin}>Login with Instagram</button>
      ) : (
        <>
          <button onClick={handleShowProfile}>Show Profile</button>

          {username && (
            <div style={{ marginTop: "1rem" }}>
              <h3>@{username}</h3>
              {profilePic && <img src={profilePic} alt="Profile" width="80" />}
            </div>
          )}

          <div style={{ marginTop: "2rem" }}>
            <input
              type="text"
              placeholder="Enter secure image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              style={{ width: "100%", marginBottom: "1rem" }}
            />
            <input
              type="text"
              placeholder="Enter caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              style={{ width: "100%", marginBottom: "1rem" }}
            />
            <button onClick={handlePost}>Post to Instagram</button>
          </div>
        </>
      )}

      {/* Footer Links */}
      <div style={{ marginTop: "3rem", textAlign: "center", fontSize: "0.9rem" }}>
        <a
          href="https://myoffshoreemployees.com/privacy-policy/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#007bff", marginRight: "1rem", textDecoration: "underline" }}
        >
          Privacy Policy
        </a>
        <Link to="/terms" style={{ color: "#007bff", textDecoration: "underline" }}>
          Terms & Conditions
        </Link>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/terms" element={<TermsAndConditions />} />
      </Routes>
    </Router>
  );
};

export default App;
