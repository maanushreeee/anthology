import { useEffect, useState } from "react";
import { Box, Typography, Avatar, Card, CardContent } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import API_BASE from "../config";

export default function PublicProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const [profileRes, articlesRes] = await Promise.all([
        fetch(`${API_BASE}/users/${username}`),
        fetch(`${API_BASE}/users/${username}/articles`),
      ]);

      const profileData = await profileRes.json();
      const articlesData = await articlesRes.json();

      setProfile(profileData);
      setArticles(articlesData);
    };

    fetchProfile();
  }, [username]);

  if (!profile) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg-default)",
        p: 6,
      }}
    >
      {/* Profile Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Avatar
          src={profile.avatar || undefined}
          sx={{
            width: 90,
            height: 90,
            fontSize: "2rem",
            backgroundColor: "var(--color-primary)",
            fontFamily: '"Cardo", serif',
            mb: 2,
          }}
        >
          {!profile.avatar && profile.username?.[0]?.toUpperCase()}
        </Avatar>

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
            sx={{
              fontFamily: '"Cardo", serif',
              fontSize: "0.85rem",
              opacity: 0.5,
              mt: 0.5,
            }}
          >
            Member since{" "}
            {new Date(profile.member_since).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })}
          </Typography>
        )}

        {profile.bio && (
          <Typography
            sx={{
              fontFamily: '"Cardo", serif',
              fontSize: "0.95rem",
              opacity: 0.75,
              mt: 2,
              maxWidth: 500,
              textAlign: "center",
            }}
          >
            {profile.bio}
          </Typography>
        )}
      </Box>

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
            onClick={() => navigate(`/read/${article.id}`)}
            sx={{
              borderRadius: 5,
              cursor: "pointer",
              backgroundColor: "var(--color-secondary)",
              boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
              transition: "0.2s",
              "&:hover": { transform: "translateY(-4px)" },
            }}
          >
            <CardContent>
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
            }}
          >
            No published articles yet.
          </Typography>
        )}
      </Box>
    </Box>
  );
}