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
import API_BASE from "../config";

const calendarSx = {
  borderRadius: 3,
  boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
  backgroundColor: "var(--color-secondary)",
  "& *": {
    fontFamily: '"Cardo", serif !important',
  },
  "& .MuiDateCalendar-root": {
    width: 260,
    height: "auto",
  },
  "& .MuiDayCalendar-header, & .MuiDayCalendar-weekContainer": {
    justifyContent: "space-around",
  },
  "& .MuiMultiSectionDigitalClock-root": {
    width: 100,
  },
  "& .MuiPickersDay-root": {
    width: 30,
    height: 30,
    fontSize: "0.8rem",
    color: "var(--color-primary)",
    fontFamily: '"Cardo", serif',
  },
  "& .MuiPickersDay-root:hover": {
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  "& .MuiPickersDay-root.Mui-selected": {
    backgroundColor: "var(--color-primary) !important",
    color: "var(--color-secondary) !important",
  },
  "& .MuiPickersDay-today": {
    borderColor: "var(--color-primary) !important",
  },
  "& .MuiDayCalendar-weekDayLabel": {
    color: "var(--color-primary)",
    opacity: 0.5,
  },
  "& .MuiPickersCalendarHeader-label": {
    color: "var(--color-primary)",
  },
  "& .MuiPickersArrowSwitcher-button": {
    color: "var(--color-primary)",
  },
  "& .MuiPickersCalendarHeader-switchViewButton": {
    color: "var(--color-primary)",
  },
  "& .MuiMultiSectionDigitalClock-root": {
    color: "var(--color-primary)",
  },
  "& .MuiMenuItem-root": {
    color: "var(--color-primary)",
    fontFamily: '"Cardo", serif',
  },
  "& .MuiMenuItem-root.Mui-selected": {
    backgroundColor: "var(--color-primary) !important",
    color: "var(--color-secondary) !important",
  },
  "& .MuiMenuItem-root:hover": {
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  "& .MuiPickersYear-yearButton.Mui-selected": {
    backgroundColor: "var(--color-primary) !important",
    color: "var(--color-secondary) !important",
  },
  "& .MuiPickersMonth-monthButton.Mui-selected": {
    backgroundColor: "var(--color-primary) !important",
    color: "var(--color-secondary) !important",
  },
  "& .MuiDialogActions-root .MuiButton-root": {
    color: "var(--color-primary)",
    fontFamily: '"Cardo", serif',
  },
  "& .MuiMultiSectionDigitalClockSection-item": {
  fontSize: "0.8rem",
  minHeight: 30,
  padding: "4px 8px",
},
};

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
    severity: "success",
  });

  useEffect(() => {
    const fetchArticle = async () => {
      const res = await fetch(`${API_BASE}/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
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
          setAlert({ open: true, message: "Please select a time in the future", severity: "error" });
          return;
        }
      }

      const res = await fetch(`${API_BASE}/articles/${id}/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ publish_at: publishTime.toISOString() }),
      });

      if (!res.ok) throw new Error();

      setAlert({
        open: true,
        message: publishOption === "now" ? "Article published successfully!" : "Article scheduled for publication!",
        severity: "success",
      });

      setOpenDialog(false);
      setTimeout(() => navigate("/publications"), 2000);
    } catch {
      setAlert({ open: true, message: "Failed to publish article", severity: "error" });
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
      {/* Top Buttons */}
      <Box sx={{ mb: 4, display: "flex", gap: 2, justifyContent: "space-between" }}>
        <Button
          variant="outlined"
          onClick={() => navigate("/completed")}
          sx={{
            color: "var(--color-primary)",
            borderColor: "var(--color-primary)",
            fontFamily: '"Cardo", serif',
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Back to Completed Articles
        </Button>
        <Button
          variant="outlined"
          onClick={() => setOpenDialog(true)}
          sx={{
            color: "var(--color-primary)",
            borderColor: "var(--color-primary)",
            fontFamily: '"Cardo", serif',
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Publish Article
        </Button>
      </Box>

      {/* Publish Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="xs"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "var(--color-secondary)",
            borderRadius: 4,
            overflow: "visible",
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: '"Cardo", serif', fontWeight: 700, color: "var(--color-primary)" }}>
          Publish Article
        </DialogTitle>

        <DialogContent sx={{ overflow: "visible" }}>
          <Typography sx={{ fontFamily: '"Cardo", serif', mb: 2, fontSize: "0.95rem", color: "var(--color-primary)" }}>
            When would you like to publish this article?
          </Typography>

          <RadioGroup value={publishOption} onChange={(e) => setPublishOption(e.target.value)} sx={{ mb: 2 }}>
            <FormControlLabel
              value="now"
              control={<Radio size="small" sx={{ color: "var(--color-primary)", "&.Mui-checked": { color: "var(--color-primary)" } }} />}
              label={<Typography sx={{ fontFamily: '"Cardo", serif', color: "var(--color-primary)" }}>Publish Now</Typography>}
            />
            <FormControlLabel
              value="later"
              control={<Radio size="small" sx={{ color: "var(--color-primary)", "&.Mui-checked": { color: "var(--color-primary)" } }} />}
              label={<Typography sx={{ fontFamily: '"Cardo", serif', color: "var(--color-primary)" }}>Schedule for Later</Typography>}
            />
          </RadioGroup>

          {publishOption === "later" && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Select Date & Time"
                value={selectedDateTime}
                onChange={(newValue) => setSelectedDateTime(newValue)}
                disablePast
                reduceAnimations
                slotProps={{
                  popper: { placement: "top", disablePortal: true },
                  textField: {
                    size: "small",
                    fullWidth: true,
                    sx: {
                      "& .MuiOutlinedInput-root": {
                        fontFamily: '"Cardo", serif',
                        borderRadius: 2,
                        color: "var(--color-primary)",
                      },
                      "& .MuiInputLabel-root": {
                        fontFamily: '"Cardo", serif',
                        color: "var(--color-primary)",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "var(--color-primary)",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "var(--color-primary)",
                      
                      },
                    },
                  },
                  desktopPaper: { sx: calendarSx },
                }}
              />
            </LocalizationProvider>
          )}
        </DialogContent>

        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{ fontFamily: '"Cardo", serif', textTransform: "none", color: "var(--color-primary)" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePublish}
            variant="contained"
            sx={{
              fontFamily: '"Cardo", serif',
              textTransform: "none",
              backgroundColor: "var(--color-primary)",
              borderRadius: 2,
              px: 3,
              "&:hover": { opacity: 0.9 },
            }}
          >
            {publishOption === "now" ? "Publish" : "Schedule"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Article Content */}
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
        <Typography
          variant="h4"
          sx={{ fontFamily: '"Cardo", serif', fontWeight: 700, mb: 3, color: "var(--color-primary)" }}
        >
          {article.title}
        </Typography>

        <Typography
          sx={{ fontFamily: '"Cardo", serif', fontSize: "1.1rem", lineHeight: 1.9, whiteSpace: "pre-wrap", opacity: 0.9 }}
        >
          {article.content}
        </Typography>
      </Box>

      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ open: false, message: "", severity: "" })}
      >
        <Alert onClose={() => setAlert({ open: false, message: "", severity: "" })} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}