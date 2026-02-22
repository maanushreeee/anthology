import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  TextField,
  Button,
  Alert, 
  Snackbar
} from "@mui/material";

const API_BASE = "https://anthology-ul35.onrender.com";

export default function Ideas() {
  const [ideas, setIdeas] = useState([]);
  const [activeIdea, setActiveIdea] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [alert, setAlert] = useState({
  open: false,
  message: "",
  severity: "success"
});

  const token = localStorage.getItem("access_token");

  // Fetch ideas
  const fetchIdeas = async () => {
    const res = await fetch(`${API_BASE}/ideas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setIdeas(data);
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  // Create new idea
  const createIdea = async () => {
    const res = await fetch(`${API_BASE}/ideas/create-idea`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: "Untitled idea",
        content: "",
      }),
    });

    const idea = await res.json();
    setIdeas((prev) => [idea, ...prev]);
    selectIdea(idea);
  };

  const selectIdea = (idea) => {
    setActiveIdea(idea);
    setTitle(idea.title || "");
    setContent(idea.content || "");
  };

const saveIdea = async () => {
  if (!activeIdea) return;

  try {
    const contentRes = await fetch(
      `${API_BASE}/ideas/${activeIdea.id}/update-content`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      }
    );

    const titleRes = await fetch(
      `${API_BASE}/ideas/${activeIdea.id}/update-title`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ new_title: title }),
      }
    );

    if (!contentRes.ok || !titleRes.ok) {
      throw new Error();
    }

    setAlert({
      open: true,
      message: "Idea saved",
      severity: "success",
    });

    fetchIdeas();
  } catch {
    setAlert({
      open: true,
      message: "Failed to save idea",
      severity: "error",
    });
  }
};

const convertToArticle = async () => {
  if (!activeIdea) return;

  try {
    const res = await fetch(
      `${API_BASE}/ideas/${activeIdea.id}/convert-to-article`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error();
    }

    setAlert({
      open: true,
      message: "Idea converted to article",
      severity: "success",
    });

    fetchIdeas();
  } catch (error) {
    setAlert({
      open: true,
      message: "Failed to convert idea to article",
      severity: "error",
    });
  }
};

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* LEFT PANEL */}
      <Box
        sx={{
          width: "20%",
          backgroundColor: "var(--color-primary)",
          color: "white",
          p: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontFamily: '"Cardo", serif', mb: 2 }}
        >
          Ideas
        </Typography>

        <Button
          fullWidth
          onClick={createIdea}
          sx={{
            mb: 2,
            color: "white",
            border: "1px solid rgba(255,255,255,0.4)",
            fontFamily: '"Cardo", serif',
            textTransform: "none",
            borderRadius: 3,
          }}
        >
          + New idea
        </Button>

        <List>
          {ideas.map((idea) => (
            <ListItemButton
              key={idea.id}
              onClick={() => selectIdea(idea)}
              sx={{
                borderRadius: 2,
                mb: 1,
                backgroundColor:
                  activeIdea?.id === idea.id
                    ? "rgba(255,255,255,0.15)"
                    : "transparent",
              }}
            >
              <Typography sx={{ fontFamily: '"Cardo", serif' }}>
                {idea.title || "Untitled"}
              </Typography>
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* RIGHT PANEL */}
      <Box
        sx={{
          width: "80%",
          backgroundColor: "var(--color-secondary)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 6,
        }}
      >
        {activeIdea ? (
          <Box
            sx={{
              width: "100%",
              maxWidth: 890,
              minHeight: "70vh",
              backgroundColor: "var(--color-bg-default)",
              borderRadius: "28px",
              p: 4,
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
            }}
          >
            {/* Title */}
            <TextField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled idea"
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontFamily: '"Cardo", serif',
                  fontSize: "1.6rem",
                  fontWeight: 600,
                  mb: 2,
                },
              }}
            />

            {/* Content */}
            <TextField
              multiline
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing…"
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontFamily: '"Cardo", serif',
                  fontSize: "1.1rem",
                  lineHeight: 1.8,
                },
              }}
              sx={{ flexGrow: 1 }}
            />

            <Box sx={{ mt: 3, alignSelf: "flex-end", display: "flex", gap: 2 }}>
              
              <Button
              onClick={convertToArticle}
                sx={{
                  alignSelf: "flex-end",
                  mt: 3,
                  px: 4,
                  borderRadius: 3,
                  backgroundColor: "var(--color-primary)",
                  color: "white",
                  fontFamily: '"Cardo", serif',
                  textTransform: "none",
                  "&:hover": { opacity: 0.9 },
                }}>
                Convert to Article
              </Button>
              {/* Save */}
              <Button
                onClick={saveIdea}
                sx={{
                  alignSelf: "flex-end",
                  mt: 3,
                  px: 4,
                  borderRadius: 3,
                  backgroundColor: "var(--color-primary)",
                  color: "white",
                  fontFamily: '"Cardo", serif',
                  textTransform: "none",
                  "&:hover": { opacity: 0.9 },
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography
            sx={{
              fontFamily: '"Cardo", serif',
              opacity: 0.6,
            }}
          >
            Select or create an idea to begin.
          </Typography>
        )}
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
