import {
  Drawer,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AppDrawer({ open, onClose }) {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Ideas", path: "/ideas" },
    { label: "Draft Articles", path: "/articles" },
    { label: "Completed", path: "/completed" },
    { label: "Published", path: "/published" },
  ];

  return (
    <Drawer open={open} onClose={onClose}>
      <Box
        sx={{
          width: 260,
          height: "100%",
          backgroundColor: "var(--color-secondary)",
          p: 3,
        }}
      >
        {/* Brand */}
        <Typography
          variant="h5"
          sx={{
            fontFamily: '"Cardo", serif',
            fontWeight: 700,
            mb: 4,
            color: "var(--color-primary)",
            borderBottom: "1px solid var(--color-bg-default)",
            pb: 1,
          }}
        >
          Anthology
        </Typography>

        {/* Menu Links */}
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.path}
              onClick={() => {
                navigate(item.path);
                onClose(); // ✅ close drawer after navigation
              }}
              sx={{
                borderRadius: 3,
                mb: 1,
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.15)",
                },
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontFamily: '"Cardo", serif',
                  fontSize: "1rem",
                  color: "var(--color-primary)",
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
