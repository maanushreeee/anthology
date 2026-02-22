import { useEffect, useState, useRef } from "react";
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
import { debounceAsync } from "../utils/debounce";

const API_BASE = "http://127.0.0.1:8000";

export default function Articles() {
  const [articles, setarticles] = useState([]);
  const [activeArticle, setActiveArticle] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [autoSaveStatus, setAutoSaveStatus] = useState(""); // "", "saving", "saved", "error"
  const [draftWarningOpen, setDraftWarningOpen] = useState(false);
  const [pendingDraft, setPendingDraft] = useState(null);
  const autoSaveFuncRef = useRef(null);
  const [alert, setAlert] = useState({
  open: false,
  message: "",
  severity: "success"
});

  const token = localStorage.getItem("access_token");

  // Fetch articles
  const fetcharticles = async () => {
    const res = await fetch(`${API_BASE}/articles/my-draft-articles`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setarticles(data);
  };

  // Auto-save function
  const performAutoSave = async (articleId, titleToSave, contentToSave) => {
    if (!articleId) return;
    
    try {
      setAutoSaveStatus("saving");
      const res = await fetch(`${API_BASE}/articles/${articleId}/auto-save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: titleToSave || undefined,
          content: contentToSave || undefined,
        }),
      });

      if (res.ok) {
        setAutoSaveStatus("saved");
      } else {
        setAutoSaveStatus("error");
        setTimeout(() => setAutoSaveStatus(""), 3000);
      }
    } catch (error) {
      console.error("Auto-save error:", error);
      setAutoSaveStatus("error");
      setTimeout(() => setAutoSaveStatus(""), 3000);
    }
  };

  // Create debounced auto-save
  useEffect(() => {
    autoSaveFuncRef.current = debounceAsync(async () => {
      if (activeArticle) {
        await performAutoSave(activeArticle.id, title, content);
      }
    }, 1000); // 1 second debounce
  }, [activeArticle, token]);

  // Auto-save when title or content changes
  useEffect(() => {
    if (activeArticle && autoSaveFuncRef.current) {
      autoSaveFuncRef.current();
    }
  }, [title, content]);

  useEffect(() => {
    fetcharticles();
  }, []);

  // Create new article
  const createArticle = async () => {
    const res = await fetch(`${API_BASE}/articles/create-article`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: "Untitled article",
        content: "",
      }),
    });

    const article = await res.json();
    setarticles((prev) => [article, ...prev]);
    selectArticle(article);
  };

  const selectArticle = async (article) => {
    setActiveArticle(article);
    setTitle(article.title || "");
    setContent(article.content || "");
    
    // Check for auto-saved draft
    try {
      const res = await fetch(`${API_BASE}/articles/${article.id}/draft-info`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const draftInfo = await res.json();
        if (draftInfo.has_draft && draftInfo.draft) {
          setPendingDraft(draftInfo.draft);
          setDraftWarningOpen(true);
        }
      }
    } catch (error) {
      console.error("Error checking for draft:", error);
    }
  };

  const restoreDraft = () => {
    if (pendingDraft) {
      if (pendingDraft.title) setTitle(pendingDraft.title);
      if (pendingDraft.content) setContent(pendingDraft.content);
    }
    setDraftWarningOpen(false);
    setPendingDraft(null);
  };

  const discardDraft = () => {
    setDraftWarningOpen(false);
    setPendingDraft(null);
  };

const saveArticle = async () => {
  if (!activeArticle) return;
  try {
    const contentRes = await fetch(
      `${API_BASE}/articles/${activeArticle.id}/update-content`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ new_content: content }),
      }
    );

    const titleRes = await fetch(
      `${API_BASE}/articles/${activeArticle.id}/update-title`,
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
      message: "Article saved",
      severity: "success",
    });

    fetcharticles();
  } catch (error) {
    setAlert({
      open: true,
      message: "Failed to save article",
      severity: "error",
    });
  }
};

const convertDrafttoComplete = async () => {
  if (!activeArticle) return;

  try {
    const res = await fetch(
      `${API_BASE}/articles/${activeArticle.id}/complete`,
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
      message: "Article successfully completed",
      severity: "success",
    });

    fetcharticles();
  } catch (error) {
    setAlert({
      open: true,
      message: "Failed to complete article",
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
          articles
        </Typography>

        <Button
          fullWidth
          onClick={createArticle}
          sx={{
            mb: 2,
            color: "white",
            border: "1px solid rgba(255,255,255,0.4)",
            fontFamily: '"Cardo", serif',
            textTransform: "none",
            borderRadius: 3,
          }}
        >
          + New Article
        </Button>

        <List>
          {articles.map((article) => (
            <ListItemButton
              key={article.id}
              onClick={() => selectArticle(article)}
              sx={{
                borderRadius: 2,
                mb: 1,
                backgroundColor:
                  activeArticle?.id === article.id
                    ? "rgba(255,255,255,0.15)"
                    : "transparent",
              }}
            >
              <Typography sx={{ fontFamily: '"Cardo", serif' }}>
                {article.title || "Untitled"}
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
        {activeArticle ? (
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
              placeholder="Untitled article"
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

            <Box sx={{ mt: 3, alignSelf: "flex-end", display: "flex", gap: 2, alignItems: "center" }}>
              {autoSaveStatus && (
                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    fontFamily: '"Cardo", serif',
                    color: autoSaveStatus === "saving" ? "orange" : autoSaveStatus === "saved" ? "green" : "red",
                  }}
                >
                  {autoSaveStatus === "saving" && "🔄 Auto-saving..."}
                  {autoSaveStatus === "saved" && "✓ Saved"}
                  {autoSaveStatus === "error" && "✕ Save failed"}
                </Typography>
              )}
              
              <Button
              onClick={convertDrafttoComplete}
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
                Complete Article
              </Button>
              {/* Save */}
              <Button
                onClick={saveArticle}
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
            Select or create an article to begin.
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

      {/* Draft Recovery Snackbar */}
      <Snackbar
        open={draftWarningOpen}
        autoHideDuration={10000}
        onClose={discardDraft}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert 
          onClose={discardDraft}
          severity="info"
          sx={{ width: "100%" }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Typography>You have unsaved changes from {pendingDraft?.last_auto_saved_at ? new Date(pendingDraft.last_auto_saved_at).toLocaleTimeString() : "earlier"}. Restore them?</Typography>
            <Button size="small" onClick={restoreDraft} sx={{ color: "info.main" }}>
              Restore
            </Button>
            <Button size="small" onClick={discardDraft} sx={{ color: "info.main" }}>
              Discard
            </Button>
          </Box>
        </Alert>
      </Snackbar>
    </Box>
  );
}
