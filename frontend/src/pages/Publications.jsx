import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://anthology-ul35.onrender.com";

export default function Publication() {
  const [articles, setArticles] = useState([]);
  const [publication, setPublication] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [publicationName, setPublicationName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchPublicationAndArticles = async () => {
      try {
        // Fetch publications
        const pubRes = await fetch(
          `${API_BASE}/publications/my-publications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (pubRes.ok) {
          const pubData = await pubRes.json();
          if (pubData.length > 0) {
            setPublication(pubData[0]);
            setPublicationName(pubData[0].name);
            
            // Fetch published articles for this publication
            const articlesRes = await fetch(
              `${API_BASE}/articles/my-published-articles`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            
            if (articlesRes.ok) {
              const articlesData = await articlesRes.json();
              setArticles(articlesData);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPublicationAndArticles();
  }, []);

  const handleCreatePublication = async () => {
    if (!publicationName.trim()) {
      setAlert({
        open: true,
        message: "Publication name cannot be empty",
        severity: "error"
      });
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/publications/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: publicationName,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create publication");
      }

      const newPublication = await res.json();
      setPublication(newPublication);
      setOpenDialog(false);
      setAlert({
        open: true,
        message: "Publication created successfully!",
        severity: "success"
      });
    } catch (error) {
      setAlert({
        open: true,
        message: "Failed to create publication",
        severity: "error"
      });
    }
  };

  const handleUpdatePublicationName = async () => {
    if (!publicationName.trim()) {
      setAlert({
        open: true,
        message: "Publication name cannot be empty",
        severity: "error"
      });
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/publications/${publication.id}/update-name`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: publicationName,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update publication name");
      }

      const updatedPublication = await res.json();
      setPublication(updatedPublication);
      setIsEditing(false);
      setAlert({
        open: true,
        message: "Publication name updated successfully!",
        severity: "success"
      });
    } catch (error) {
      setAlert({
        open: true,
        message: "Failed to update publication name",
        severity: "error"
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg-default)",
        p: 6,
      }}
    >
      {/* Page Title with Edit */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Cardo", serif',
            fontWeight: 700,
            color: "var(--color-primary)",
          }}
        >
          {publication ? publication.name : "My Publications"}
        </Typography>
        {publication && (
          <Button
            size="small"
            onClick={() => setIsEditing(true)}
            sx={{
              textTransform: "none",
              color: "var(--color-primary)",
              fontFamily: '"Cardo", serif',
            }}
          >
            Edit
          </Button>
        )}
      </Box>

      {/* Create Publication Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Cardo", serif', fontWeight: 700 }}>
          Create New Publication
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Publication Name"
            variant="outlined"
            value={publicationName}
            onChange={(e) => setPublicationName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreatePublication} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Publication Name Dialog */}
      <Dialog open={isEditing} onClose={() => setIsEditing(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Cardo", serif', fontWeight: 700 }}>
          Edit Publication Name
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Publication Name"
            variant="outlined"
            value={publicationName}
            onChange={(e) => setPublicationName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          <Button onClick={handleUpdatePublicationName} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Publication Button or Articles Grid */}
      {!publication ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography
            sx={{
              fontFamily: '"Cardo", serif',
              opacity: 0.6,
              mb: 3,
            }}
          >
            You haven't created a publication yet. Create one to start publishing your articles.
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpenDialog(true)}
            sx={{
              backgroundColor: "var(--color-primary)",
              color: "white",
              fontFamily: '"Cardo", serif',
              textTransform: "none",
              px: 4,
              py: 1.5,
            }}
          >
            Create Publication
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 3,
          }}
        >
          {articles.map((article) => (
            <Card
              key={article.id}
              sx={{
                borderRadius: 5,
                cursor: "pointer",
                backgroundColor: 'var(--color-secondary)',
                boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                transition: "0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                },
              }}
            >
              <CardContent>
                {/* Title */}
                <Typography
                  sx={{
                    fontFamily: '"Cardo", serif',
                    fontWeight: 700,
                    fontSize: "1.2rem",
                    mb: 1,
                    color: "var(--color-primary)",
                  }}
                >
                  {article.title || "Untitled"}
                </Typography>

                {/* Preview Snippet */}
                <Typography
                  sx={{
                    fontFamily: '"Cardo", serif',
                    opacity: 0.7,
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                    mb: 2,
                  }}
                >
                  {(article.content || "").slice(0, 120)}
                  {article.content?.length > 120 && "..."}
                </Typography>

                {/* Published Date */}
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: '"Cardo", serif',
                    color: "var(--color-primary)",
                    opacity: 0.8,
                  }}
                >
                  Published on {article.published_at ? new Date(article.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A"}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Alert Snackbar */}
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
