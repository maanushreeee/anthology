import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItemButton,
} from "@mui/material";

const API_BASE = "https://anthology-ul35.onrender.com";

export default function Dashboard() {
  const [ideas, setIdeas] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [published, setPublished] = useState([]);

  const token = localStorage.getItem("access_token");

  // Generic fetch helper
  const fetchSection = async (endpoint) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to load ${endpoint}`);
    }

    return await res.json();
  };

  // Load everything
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIdeas(await fetchSection("/ideas"));
        setDrafts(await fetchSection("/articles/my-draft-articles"));
        setCompleted(await fetchSection("/articles/my-completed-articles"));
        setPublished(await fetchSection("/publications/my-publications"));
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    };

    loadDashboard();
  }, []);

  // Card component
const StatCard = ({ label, count }) => (
  <Card
    sx={{
      flex: 1,
      borderRadius: 3,
      boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
      backgroundColor: "var(--color-secondary)",
    }}
  >
    <CardContent sx={{ py: 1.5 }}>
      <Typography
        sx={{
          fontFamily: '"Cardo", serif',
          fontSize: "0.85rem",
          opacity: 0.65,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontFamily: '"Cardo", serif',
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "var(--color-primary)",
          lineHeight: 1.2,
        }}
      >
        {count}
      </Typography>
    </CardContent>
  </Card>
);

  // Column component
  const Column = ({ title, items }) => (
    <Box
      sx={{
        flex: 1,
        backgroundColor: "var(--color-secondary)",
        borderRadius: 3,
        p: 1,
        minHeight: "60vh",
        boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
        overflowY: "auto",
      }}
    >
      <Typography
        sx={{
          fontFamily: '"Cardo", serif',
          fontSize: "1.1rem",
          fontWeight: 600,
          mb: 2,
          color: "var(--color-primary)",
        }}
      >
        {title}
      </Typography>

      <List>
        {items.length === 0 ? (
          <Typography
            sx={{
              fontFamily: '"Cardo", serif',
              opacity: 0.5,
              fontSize: "0.95rem",
              borderBottom: "1px solid rgba(0,0,0,0.08)"
            }}
          >
            Nothing here yet.
          </Typography>
        ) : (
          items.map((item) => (
            <ListItemButton
              key={item.id}
              sx={{
                borderRadius: 3,
                mb: 1,
                fontFamily: '"Cardo", serif',
              }}
            >
              <Typography sx={{ fontFamily: '"Cardo", serif' }}>
                {item.title || "Untitled"}
              </Typography>
            </ListItemButton>
          ))
        )}
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg-default)",
        p: 3,
      }}
    >
      {/* Page Title */}
      <Typography
        variant="h4"
        sx={{
          fontFamily: '"Cardo", serif',
          fontWeight: 700,
          mb: 3,
          color: "var(--color-primary)",
        }}
      >
        Dashboard
      </Typography>

      {/* Top Stats Row */}
      <Box sx={{ display: "flex", gap: 4, mb: 1 }}>
        <StatCard label="Ideas" count={ideas.length} />
        <StatCard label="Drafts" count={drafts.length} />
        <StatCard label="Completed" count={completed.length} />
        <StatCard label="Published" count={published.length} />
      </Box>

      {/* Four Columns */}
      <Box sx={{ display: "flex", gap: 4, overflow: "hidden" }}>
        <Column title="Ideas" items={ideas} />
        <Column title="Draft Articles" items={drafts} />
        <Column title="Completed" items={completed} />
        <Column title="Published" items={published} />
      </Box>
    </Box>
  );
}
