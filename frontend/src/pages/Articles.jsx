import { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  TextField,
  Button,
  Alert,
  Snackbar,
  Chip,
} from "@mui/material";
import { debounceAsync } from "../utils/debounce";
import API_BASE from "../config";

const PREDEFINED_TAGS = [
  "Technology", "Science", "Opinion", "Travel", "Culture",
  "Literature", "Politics", "Health", "Business", "Philosophy",
  "Art", "Education", "Environment", "History", "Fiction",
];

export default function Articles() {
  const [articles, setarticles] = useState([]);
  const [activeArticle, setActiveArticle] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState("");
  const [draftWarningOpen, setDraftWarningOpen] = useState(false);
  const [pendingDraft, setPendingDraft] = useState(null);
  const autoSaveFuncRef = useRef(null);
  const coverImageInputRef = useRef(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const token = localStorage.getItem("access_token");

  const fetcharticles = async () => {
    const res = await fetch(`${API_BASE}/articles/my-draft-articles`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      console.error(`Failed to fetch articles: ${res.status}`);
      return;
    }
    const data = await res.json();
    setarticles(data);
  };

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
      setAutoSaveStatus("error");
      setTimeout(() => setAutoSaveStatus(""), 3000);
    }
  };

  useEffect(() => {
    autoSaveFuncRef.current = debounceAsync(async () => {
      if (activeArticle) {
        await performAutoSave(activeArticle.id, title, content);
      }
    }, 1000);
  }, [activeArticle, token]);

  useEffect(() => {
    if (activeArticle && autoSaveFuncRef.current) {
      autoSaveFuncRef.current();
    }
  }, [title, content]);

  useEffect(() => {
    fetcharticles();
  }, []);

  const createArticle = async () => {
    const res = await fetch(`${API_BASE}/articles/create-article`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: "Untitled article", content: "" }),
    });
    if (!res.ok) {
      console.error(`Failed to create article: ${res.status}`);
      return;
    }
    const article = await res.json();
    setarticles((prev) => [article, ...prev]);
    selectArticle(article);
  };

  const selectArticle = async (article) => {
    setActiveArticle(article);
    setTitle(article.title || "");
    setContent(article.content || "");
    setSelectedTags(article.tags || []);
    setCoverImage(article.cover_image || null);

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

  const toggleTag = async (tag) => {
    if (!activeArticle) return;

    let newTags;
    if (selectedTags.includes(tag)) {
      newTags = selectedTags.filter((t) => t !== tag);
    } else {
      if (selectedTags.length >= 3) {
        setAlert({ open: true, message: "Maximum 3 tags allowed", severity: "warning" });
        return;
      }
      newTags = [...selectedTags, tag];
    }

    setSelectedTags(newTags);

    try {
      await fetch(`${API_BASE}/articles/${activeArticle.id}/update-tags`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tags: newTags }),
      });
    } catch {
      setAlert({ open: true, message: "Failed to update tags", severity: "error" });
    }
  };

  const handleCoverImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (ev) => {
      img.onload = async () => {
        const maxW = 1200;
        const maxH = 600;
        let w = img.width;
        let h = img.height;

        if (w > maxW || h > maxH) {
          const ratio = Math.min(maxW / w, maxH / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }

        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);
        const base64 = canvas.toDataURL("image/jpeg", 0.85);

        setCoverImage(base64);

        try {
          await fetch(`${API_BASE}/articles/${activeArticle.id}/cover-image`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ cover_image: base64 }),
          });
        } catch {
          setAlert({ open: true, message: "Failed to save cover image", severity: "error" });
        }
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const removeCoverImage = async () => {
    setCoverImage(null);
    try {
      await fetch(`${API_BASE}/articles/${activeArticle.id}/cover-image`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cover_image: null }),
      });
    } catch {
      setAlert({ open: true, message: "Failed to remove cover image", severity: "error" });
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

      if (!contentRes.ok || !titleRes.ok) throw new Error();

      setAlert({ open: true, message: "Article saved", severity: "success" });
      fetcharticles();
    } catch {
      setAlert({ open: true, message: "Failed to save article", severity: "error" });
    }
  };

  const convertDrafttoComplete = async () => {
    if (!activeArticle) return;
    try {
      const res = await fetch(`${API_BASE}/articles/${activeArticle.id}/complete`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setAlert({ open: true, message: "Article successfully completed", severity: "success" });
      fetcharticles();
    } catch {
      setAlert({ open: true, message: "Failed to complete article", severity: "error" });
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
        <Typography variant="h6" sx={{ fontFamily: '"Cardo", serif', mb: 2 }}>
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
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
            }}
          >
            {/* Cover Image Area */}
            <input
              type="file"
              accept="image/*"
              ref={coverImageInputRef}
              style={{ display: "none" }}
              onChange={handleCoverImageUpload}
            />

            {coverImage ? (
              <Box sx={{ position: "relative" }}>
                <Box
                  component="img"
                  src={coverImage}
                  sx={{
                    width: "100%",
                    height: 220,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <Button
                  size="small"
                  onClick={removeCoverImage}
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    color: "white",
                    fontFamily: '"Cardo", serif',
                    textTransform: "none",
                    borderRadius: 2,
                    fontSize: "0.75rem",
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                  }}
                >
                  Remove Cover
                </Button>
              </Box>
            ) : (
              <Box
                onClick={() => coverImageInputRef.current.click()}
                sx={{
                  width: "100%",
                  height: 80,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottom: "1px dashed rgba(26,54,54,0.2)",
                  cursor: "pointer",
                  backgroundColor: "rgba(26,54,54,0.03)",
                  "&:hover": { backgroundColor: "rgba(26,54,54,0.06)" },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"Cardo", serif',
                    fontSize: "0.85rem",
                    opacity: 0.4,
                    color: "var(--color-primary)",
                  }}
                >
                  + Add cover image
                </Typography>
              </Box>
            )}

            {/* Editor Content */}
            <Box sx={{ p: 4, display: "flex", flexDirection: "column", flexGrow: 1 }}>
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

              {/* Tags */}
              <Box sx={{ mt: 3 }}>
                <Typography
                  sx={{
                    fontFamily: '"Cardo", serif',
                    fontSize: "0.85rem",
                    opacity: 0.6,
                    mb: 1,
                  }}
                >
                  Tags {selectedTags.length}/3
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {PREDEFINED_TAGS.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onClick={() => toggleTag(tag)}
                      sx={{
                        fontFamily: '"Cardo", serif',
                        fontSize: "0.8rem",
                        backgroundColor: selectedTags.includes(tag)
                          ? "var(--color-primary)"
                          : "transparent",
                        color: selectedTags.includes(tag)
                          ? "var(--color-bg-default)"
                          : "var(--color-primary)",
                        border: "1px solid var(--color-primary)",
                        "&:hover": {
                          backgroundColor: selectedTags.includes(tag)
                            ? "var(--color-primary)"
                            : "rgba(26,54,54,0.08)",
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Bottom Actions */}
              <Box
                sx={{
                  mt: 3,
                  alignSelf: "flex-end",
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                }}
              >
                {autoSaveStatus && (
                  <Typography
                    sx={{
                      fontSize: "0.85rem",
                      fontFamily: '"Cardo", serif',
                      color:
                        autoSaveStatus === "saving"
                          ? "orange"
                          : autoSaveStatus === "saved"
                          ? "green"
                          : "red",
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
                  }}
                >
                  Complete Article
                </Button>

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
          </Box>
        ) : (
          <Typography sx={{ fontFamily: '"Cardo", serif', opacity: 0.6 }}>
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

      <Snackbar
        open={draftWarningOpen}
        autoHideDuration={10000}
        onClose={discardDraft}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={discardDraft} severity="info" sx={{ width: "100%" }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Typography>
              You have unsaved changes from{" "}
              {pendingDraft?.last_auto_saved_at
                ? new Date(pendingDraft.last_auto_saved_at).toLocaleTimeString()
                : "earlier"}
              . Restore them?
            </Typography>
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