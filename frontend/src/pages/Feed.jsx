import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  CircularProgress,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import API_BASE from "../config";
import NavBar from '../components/NavBar';


const LIMIT = 9;

const PREDEFINED_TAGS = [
  "Technology", "Science", "Opinion", "Travel", "Culture",
  "Literature", "Politics", "Health", "Business", "Philosophy",
  "Art", "Education", "Environment", "History",
];

export default function Feed() {
  const [articles, setArticles] = useState([]);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTag, setActiveTag] = useState(null);
  const navigate = useNavigate();

  const fetchArticles = async (skipVal, replace = false, tag = activeTag) => {
    setLoading(true);
    try {
      const tagParam = tag ? `&tag=${encodeURIComponent(tag)}` : "";
      const res = await fetch(`${API_BASE}/feed?skip=${skipVal}&limit=${LIMIT}${tagParam}`);
      const data = await res.json();
      setTotal(data.total);
      setArticles((prev) => (replace ? data.articles : [...prev, ...data.articles]));
      setSkip(skipVal + LIMIT);
    } catch (err) {
      console.error("Failed to fetch feed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(0, true, activeTag);
  }, [activeTag]);

  const handleTagClick = (tag) => {
    setActiveTag((prev) => (prev === tag ? null : tag));
    setSkip(0);
    setArticles([]);
  };

  const hasMore = articles.length < total;

  return (
    <Box>
      <NavBar />
      <Box sx={{ padding: 1 }}>
        <Typography variant="h5" sx={{ color: 'var(--color-primary)', fontFamily: '"Cardo", serif', textAlign: 'center', fontWeight: 700 }}>
          Explore the Feed
        </Typography> 
        <Box sx={{ minHeight: "100vh", backgroundColor: "var(--color-bg-default)", p: 6 }}>

      {/* Tag Filter Bar */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 3 }}>
        {PREDEFINED_TAGS.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            onClick={() => handleTagClick(tag)}
            sx={{
              fontFamily: '"Cardo", serif',
              fontSize: "0.8rem",
              backgroundColor: activeTag === tag ? "var(--color-primary)" : "transparent",
              color: activeTag === tag ? "var(--color-bg-default)" : "var(--color-primary)",
              border: "1px solid var(--color-primary)",
              "&:hover": {
                backgroundColor: activeTag === tag ? "var(--color-primary)" : "rgba(26,54,54,0.08)",
              },
            }}
          />
        ))}
      </Box>

      {/* Articles Grid */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 3 }}>
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
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                p: 3,
              }}
            >
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

              {/* Snippet — flexGrow pushes everything below to bottom */}
              <Typography
                sx={{
                  fontFamily: '"Cardo", serif',
                  opacity: 0.7,
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                  flexGrow: 1,
                  mb: 2,
                }}
              >
                {(article.content || "").slice(0, 120)}
                {article.content?.length > 120 && "..."}
              </Typography>

              {/* Tags — always rendered, minHeight keeps spacing consistent */}
              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", minHeight: 24, mb: 1.5 }}>
                {article.tags?.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTagClick(tag);
                    }}
                    sx={{
                      fontFamily: '"Cardo", serif',
                      fontSize: "0.7rem",
                      backgroundColor: "var(--color-primary)",
                      color: "var(--color-bg-default)",
                      height: 20,
                    }}
                  />
                ))}
              </Box>

              {/* Date — always at bottom */}
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

        {articles.length === 0 && !loading && (
          <Typography
            sx={{
              fontFamily: '"Cardo", serif',
              opacity: 0.4,
              gridColumn: "1 / -1",
              textAlign: "center",
              mt: 10,
            }}
          >
            {activeTag ? `No articles found for "${activeTag}".` : "No articles published yet."}
          </Typography>
        )}
      </Box>

      {/* Load More */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        {loading && <CircularProgress sx={{ color: "var(--color-primary)" }} />}
        {!loading && hasMore && (
          <Button
            onClick={() => fetchArticles(skip)}
            variant="outlined"
            sx={{
              fontFamily: '"Cardo", serif',
              textTransform: "none",
              color: "var(--color-primary)",
              borderColor: "var(--color-primary)",
              borderRadius: 3,
              px: 4,
            }}
          >
            Load More
          </Button>
        )}
        {!loading && !hasMore && articles.length > 0 && (
          <Typography sx={{ fontFamily: '"Cardo", serif', opacity: 0.4, fontSize: "0.9rem" }}>
            You've reached the end.
          </Typography>
        )}
      </Box>
    </Box>
      </Box>
    </Box>
  );
}