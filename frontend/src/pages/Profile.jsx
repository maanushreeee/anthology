import { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import API_BASE from "../config";


export default function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [stats, setStats] = useState({ drafts: 0, ideas: 0, completed: 0, published: 0 });
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profileRes, draftsRes, ideasRes, completedRes, publishedRes] = await Promise.all([
          fetch(`${API_BASE}/users/me`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE}/articles/my-draft-articles`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE}/ideas`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE}/articles/my-completed-articles`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE}/articles/my-published-articles`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const profileData = await profileRes.json();
        setProfile(profileData);
        setBio(profileData.bio || "");

        const [drafts, ideas, completed, published] = await Promise.all([
          draftsRes.json(),
          ideasRes.json(),
          completedRes.json(),
          publishedRes.json(),
        ]);

        setStats({
          drafts: drafts.length,
          ideas: ideas.length,
          completed: completed.length,
          published: published.length,
        });
      } catch (err) {
        console.error("Failed to fetch profile data", err);
      }
    };

    fetchAll();
  }, []);

  const handleAvatarClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Resize to ~200x200 using canvas
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (ev) => {
      img.src = ev.target.result;
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext("2d");

        // Crop to square from center
        const size = Math.min(img.width, img.height);
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        ctx.drawImage(img, sx, sy, size, size, 0, 0, 200, 200);

        const base64 = canvas.toDataURL("image/jpeg", 0.8);
        await saveProfile(base64, bio);
      };
    };

    reader.readAsDataURL(file);
  };

  const saveProfile = async (avatar, bioText) => {
    setUploading(true);
    try {
      const res = await fetch(`${API_BASE}/users/me/update-profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...(avatar !== undefined && { avatar }),
          bio: bioText,
        }),
      });

      if (!res.ok) throw new Error();

      const updated = await res.json();
      setProfile(updated);
      setBio(updated.bio || "");
      setEditingBio(false);
      setAlert({ open: true, message: "Profile updated", severity: "success" });
    } catch {
      setAlert({ open: true, message: "Failed to update profile", severity: "error" });
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  if (!profile) return null;

  const statItems = [
    { label: "Drafts", value: stats.drafts },
    { label: "Ideas", value: stats.ideas },
    { label: "Completed", value: stats.completed },
    { label: "Published", value: stats.published },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg-default)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        p: 6,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 600 }}>

        {/* Avatar + Username */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
          <Box sx={{ position: "relative", mb: 2 }}>
            <Avatar
              src={profile.avatar || undefined}
              sx={{
                width: 100,
                height: 100,
                fontSize: "2.5rem",
                backgroundColor: "var(--color-primary)",
                fontFamily: '"Cardo", serif',
                cursor: "pointer",
              }}
              onClick={handleAvatarClick}
            >
              {!profile.avatar && profile.username?.[0]?.toUpperCase()}
            </Avatar>
            {uploading && (
              <CircularProgress
                size={108}
                sx={{
                  position: "absolute",
                  top: -4,
                  left: -4,
                  color: "var(--color-primary)",
                }}
              />
            )}
          </Box>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <Typography
            variant="body2"
            onClick={handleAvatarClick}
            sx={{
              fontFamily: '"Cardo", serif',
              color: "var(--color-primary)",
              opacity: 0.6,
              cursor: "pointer",
              mb: 1,
              fontSize: "0.8rem",
              "&:hover": { opacity: 1 },
            }}
          >
            Change photo
          </Typography>

          <Typography
            variant="h5"
            sx={{
              fontFamily: '"Cardo", serif',
              fontWeight: 700,
              color: "var(--color-primary)",
            }}
          >
            {profile.username}
          </Typography>

          {profile.member_since && (
            <Typography
              variant="body2"
              sx={{
                fontFamily: '"Cardo", serif',
                opacity: 0.5,
                fontSize: "0.85rem",
                mt: 0.5,
              }}
            >
              Member since {new Date(profile.member_since).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
            </Typography>
          )}
        </Box>

        {/* Bio */}
        <Box
          sx={{
            backgroundColor: "var(--color-secondary)",
            borderRadius: 4,
            p: 3,
            mb: 3,
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontFamily: '"Cardo", serif', fontWeight: 700, mb: 1, color: "var(--color-primary)" }}
          >
            Bio
          </Typography>

          {editingBio ? (
            <>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: { fontFamily: '"Cardo", serif', fontSize: "0.95rem" },
                }}
                placeholder="Write something about yourself…"
              />
              <Box sx={{ display: "flex", gap: 1, mt: 1.5, justifyContent: "flex-end" }}>
                <Button
                  size="small"
                  onClick={() => { setEditingBio(false); setBio(profile.bio || ""); }}
                  sx={{ fontFamily: '"Cardo", serif', textTransform: "none" }}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => saveProfile(undefined, bio)}
                  sx={{
                    fontFamily: '"Cardo", serif',
                    textTransform: "none",
                    backgroundColor: "var(--color-primary)",
                  }}
                >
                  Save
                </Button>
              </Box>
            </>
          ) : (
            <Typography
              onClick={() => setEditingBio(true)}
              sx={{
                fontFamily: '"Cardo", serif',
                fontSize: "0.95rem",
                opacity: bio ? 0.85 : 0.4,
                cursor: "pointer",
                fontStyle: bio ? "normal" : "italic",
                "&:hover": { opacity: 1 },
              }}
            >
              {bio || "Click to add a bio…"}
            </Typography>
          )}
        </Box>

        {/* Stats */}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, mb: 4 }}>
          {statItems.map((s) => (
            <Box
              key={s.label}
              sx={{
                backgroundColor: "var(--color-secondary)",
                borderRadius: 3,
                p: 2,
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"Cardo", serif',
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  color: "var(--color-primary)",
                }}
              >
                {s.value}
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Cardo", serif',
                  fontSize: "0.8rem",
                  opacity: 0.6,
                  color: "var(--color-primary)",
                }}
              >
                {s.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate("/dashboard")}
            sx={{
              backgroundColor: "var(--color-primary)",
              fontFamily: '"Cardo", serif',
              textTransform: "none",
              borderRadius: 3,
              py: 1.2,
            }}
          >
            Go to Dashboard
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleLogout}
            sx={{
              borderColor: "var(--color-primary)",
              color: "var(--color-primary)",
              fontFamily: '"Cardo", serif',
              textTransform: "none",
              borderRadius: 3,
              py: 1.2,
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ open: false, message: "", severity: "" })}
      >
        <Alert
          onClose={() => setAlert({ open: false, message: "", severity: "" })}
          severity={alert.severity}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}