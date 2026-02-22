import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const API_BASE = "anthology-production.up.railway.app";

export default function CompletedPage() {
  const [completed, setCompleted] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchCompleted = async () => {
      const res = await fetch(
        `${API_BASE}/articles/my-completed-articles`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setCompleted(data);
    };

    fetchCompleted();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg-default)",
        p: 6,
      }}
    >
      {/* Page Title */}
      <Typography
        variant="h4"
        sx={{
          fontFamily: '"Cardo", serif',
          fontWeight: 700,
          mb: 4,
          color: "var(--color-primary)",
        }}
      >
        Completed Articles
      </Typography>

      {/* Cards Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 3,
        }}
      >
        {completed.map((article) => (
          <Card
            key={article.id}
            onClick={() => navigate(`/completed/${article.id}`)}
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
                }}
              >
                {(article.content || "").slice(0, 120)}
                {article.content?.length > 120 && "..."}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
