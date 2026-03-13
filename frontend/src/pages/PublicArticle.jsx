import { useEffect, useState } from "react";
import { Box, Typography, Avatar, Button, IconButton, Chip } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useParams, useNavigate } from "react-router-dom";
import API_BASE from "../config";

export default function PublicArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchArticle = async () => {
      const res = await fetch(`${API_BASE}/feed/${id}`);
      const data = await res.json();
      setArticle(data);
      setLikeCount(data.likes?.length || 0);

      // Check if current user has liked
      if (token) {
        const meRes = await fetch(`${API_BASE}/users/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (meRes.ok) {
          const me = await meRes.json();
          setLiked(data.likes?.includes(me.username) || false);
        }
      }
    };

    fetchArticle();
  }, [id]);

  const handleLike = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    const res = await fetch(`${API_BASE}/articles/${id}/like`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setLiked(data.liked);
      setLikeCount(data.likes);
    }
  };

  if (!article) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg-default)",
        p: 6,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Back */}
      <Button
        variant="outlined"
        onClick={() => navigate("/feed")}
        sx={{
          mb: 4,
          alignSelf: "flex-start",
          color: "var(--color-primary)",
          borderColor: "var(--color-primary)",
          fontFamily: '"Cardo", serif',
          textTransform: "none",
        }}
      >
        Back to Feed
      </Button>

      <Box
        sx={{
          width: "100%",
          maxWidth: 800,
          margin: "0 auto",
          backgroundColor: "var(--color-secondary)",
          borderRadius: "20px",
          p: 5,
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >
        {/* Author + Like */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 4,
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer" }}
            onClick={() => navigate(`/user/${article.author_username}`)}
          >
            <Avatar
              src={article.author_avatar || undefined}
              sx={{
                width: 36,
                height: 36,
                fontSize: "0.9rem",
                backgroundColor: "var(--color-primary)",
                fontFamily: '"Cardo", serif',
              }}
            >
              {!article.author_avatar && article.author_username?.[0]?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography
                sx={{
                  fontFamily: '"Cardo", serif',
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  color: "var(--color-primary)",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {article.author_username}
              </Typography>
              <Typography
                sx={{ fontFamily: '"Cardo", serif', fontSize: "0.8rem", opacity: 0.5 }}
              >
                {article.published_at
                  ? new Date(article.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : ""}
              </Typography>
            </Box>
          </Box>

          {/* Like Button */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <IconButton onClick={handleLike} sx={{ color: "var(--color-primary)" }}>
              {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <Typography
              sx={{
                fontFamily: '"Cardo", serif',
                fontSize: "0.9rem",
                color: "var(--color-primary)",
              }}
            >
              {likeCount}
            </Typography>
          </Box>
        </Box>

        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Cardo", serif',
            fontWeight: 700,
            mb: 4,
            color: "var(--color-primary)",
          }}
        >
          {article.title}
        </Typography>

        {/* Tags */}
        {article.tags?.length > 0 && (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
            {article.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                onClick={() => navigate(`/feed?tag=${tag}`)}
                sx={{
                  fontFamily: '"Cardo", serif',
                  fontSize: "0.8rem",
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-bg-default)",
                }}
              />
            ))}
          </Box>
        )}

        {/* Content */}
        <Typography
          sx={{
            fontFamily: '"Cardo", serif',
            fontSize: "1.1rem",
            lineHeight: 1.9,
            whiteSpace: "pre-wrap",
            opacity: 0.9,
          }}
        >
          {article.content}
        </Typography>
      </Box>
    </Box>
  );
}