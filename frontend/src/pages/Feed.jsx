import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import API_BASE from "../config";

export default function Feed() {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchFeed = async () => {
      let currentUsername = null;

      // Get current user if logged in
      if (token) {
        try {
          const meRes = await fetch(`${API_BASE}/users/me/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (meRes.ok) {
            const me = await meRes.json();
            currentUsername = me.username;
          }
        } catch {
          // not logged in or token expired, show full feed
        }
      }

      const res = await fetch(`${API_BASE}/feed`);
      const data = await res.json();

      // Filter out current user's articles
      const filtered = currentUsername
        ? data.filter((a) => a.author_username !== currentUsername)
        : data;

      setArticles(filtered);
    };

    fetchFeed();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg-default)",
        p: 6,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontFamily: '"Cardo", serif',
          fontWeight: 700,
          mb: 6,
          color: "var(--color-primary)",
        }}
      >
        Feed
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 3,
        }}
      >
        {articles.map((article) => (
          <Card
            key={article.id}
            sx={{
              borderRadius: 5,
              backgroundColor: "var(--color-secondary)",
              boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
              transition: "0.2s",
              cursor: "pointer",
              "&:hover": { transform: "translateY(-4px)" },
            }}
            onClick={() => navigate(`/read/${article.id}`)}
          >
            <CardContent>
              {/* Author */}
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/user/${article.author_username}`);
                }}
              >
                <Avatar
                  src={article.author_avatar || undefined}
                  sx={{
                    width: 28,
                    height: 28,
                    fontSize: "0.8rem",
                    backgroundColor: "var(--color-primary)",
                    fontFamily: '"Cardo", serif',
                  }}
                >
                  {!article.author_avatar && article.author_username?.[0]?.toUpperCase()}
                </Avatar>
                <Typography
                  sx={{
                    fontFamily: '"Cardo", serif',
                    fontSize: "0.85rem",
                    color: "var(--color-primary)",
                    fontWeight: 600,
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {article.author_username}
                </Typography>
              </Box>

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

              {/* Snippet */}
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

              {/* Published date */}
              <Typography
                variant="caption"
                sx={{
                  fontFamily: '"Cardo", serif',
                  color: "var(--color-primary)",
                  opacity: 0.5,
                }}
              >
                {article.published_at
                  ? new Date(article.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : ""}
              </Typography>
            </CardContent>
          </Card>
        ))}

        {articles.length === 0 && (
          <Typography
            sx={{
              fontFamily: '"Cardo", serif',
              opacity: 0.4,
              gridColumn: "1 / -1",
              textAlign: "center",
              mt: 10,
            }}
          >
            No articles published yet.
          </Typography>
        )}
      </Box>
    </Box>
  );
}