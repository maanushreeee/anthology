import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Snackbar,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE = "anthology-production.up.railway.app";

export default function CompletedReader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [article, setArticle] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [publishOption, setPublishOption] = useState("now");
  const [selectedDateTime, setSelectedDateTime] = useState(dayjs().add(1, "day"));
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
    const fetchArticle = async () => {
      const res = await fetch(`${API_BASE}/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setArticle(data);
    };

    fetchArticle();
  }, [id]);

  const handlePublish = async () => {
    try {
      let publishTime = new Date();

      if (publishOption === "later") {
        publishTime = selectedDateTime.toDate();
        
        if (publishTime <= new Date()) {
          setAlert({
            open: true,
            message: "Please select a time in the future",
            severity: "error"
          });
          return;
        }
      }

      const res = await fetch(`${API_BASE}/articles/${id}/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          publish_at: publishTime.toISOString(),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to publish article");
      }

      setAlert({
        open: true,
        message: publishOption === "now" 
          ? "Article published successfully!" 
          : "Article scheduled for publication!",
        severity: "success"
      });

      setOpenDialog(false);
      setTimeout(() => navigate("/publications"), 2000);
    } catch (error) {
      setAlert({
        open: true,
        message: "Failed to publish article",
        severity: "error"
      });
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
      {/* Buttons */}
      <Box sx={{ mb: 4, display: "flex", gap: 2, justifyContent: "space-between" }}>
        <Button
          variant="outlined"
          onClick={() => navigate("/completed")}
          sx={{ color: "var(--color-primary)" }}
        >
          Back to Completed Articles
        </Button>
        <Button
          variant="outlined"
          onClick={() => setOpenDialog(true)}
          sx={{ color: "var(--color-primary)" }}
        >
          Publish Article
        </Button>
      </Box>

      {/* Publish Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Cardo", serif', fontWeight: 700, pb: 1 }}>
          Publish Article
        </DialogTitle>
        <DialogContent sx={{ overflowY: "auto", maxHeight: "60vh", py: 1 }}>
          <Typography sx={{ fontFamily: '"Cardo", serif', mb: 1.5, mt: 1, fontSize: "0.95rem" }}>
            When would you like to publish this article?
          </Typography>
          <RadioGroup
            value={publishOption}
            onChange={(e) => setPublishOption(e.target.value)}
            sx={{ mb: 1 }}
          >
            <FormControlLabel
              value="now"
              control={<Radio size="small" />}
              label="Publish Now"
              sx={{ fontFamily: '"Cardo", serif', mb: 0.5 }}
            />
            <FormControlLabel
              value="later"
              control={<Radio size="small" />}
              label="Schedule for Later"
              sx={{ fontFamily: '"Cardo", serif' }}
            />
          </RadioGroup>

          {publishOption === "later" && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Select Date & Time"
                value={selectedDateTime}
                onChange={(newValue) => setSelectedDateTime(newValue)}
                slotProps={{
                  popper: {
                    modifiers: [
                      {
                        name: 'flip',
                        enabled: true,
                      }
                    ]
                  },
                  textField: {
                    size: "small"
                  }
                }}
                sx={{ width: "70%", mt: 1 }}
              />
            </LocalizationProvider>
          )}
        </DialogContent>
        <DialogActions sx={{ pt: 1, pb: 1.5 }}>
          <Button size="small" onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            size="small"
            onClick={handlePublish}
            variant="contained"
            sx={{ backgroundColor: "var(--color-primary)" }}
          >
            {publishOption === "now" ? "Publish" : "Schedule"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Article Content Box */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 1000,
          minHeight: "60vh",
          margin: "0 auto",
          backgroundColor: "var(--color-secondary)",
          borderRadius: "20px",
          p: 5,
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >

        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Cardo", serif',
            fontWeight: 700,
            mb: 3,
            color: "var(--color-primary)",
          }}
        >
          {article.title}
        </Typography>

        {/* Full Content */}
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
