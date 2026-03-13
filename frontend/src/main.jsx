import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1A3636",
      light: "#1A3636",
      dark: "#1A3636",
    },
    secondary: {
      main: "#677D6A",
    },
  },
  typography: {
    fontFamily: '"Cardo", serif',
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1A3636",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: "#1A3636",
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#1A3636",
          "&.Mui-checked": { color: "#1A3636" },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: "#1A3636",
          "&.Mui-checked": { color: "#1A3636" },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          "&.Mui-checked": { color: "#1A3636" },
          "&.Mui-checked + .MuiSwitch-track": { backgroundColor: "#1A3636" },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: { color: "#1A3636" },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: { color: "#1A3636" },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        bar: { backgroundColor: "#1A3636" },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: "#1A3636" },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          "&.Mui-selected": { color: "#1A3636" },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: { color: "#1A3636" },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: { backgroundColor: "#1A3636", color: "#D6BD98" },
      },
    },
  },
});


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
