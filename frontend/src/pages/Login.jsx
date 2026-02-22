import { useState } from "react";
import { Box, Button, TextField, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login/signup
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    try {
      const response = await fetch("anthology-production.up.railway.app/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      localStorage.setItem("access_token", data.access_token);

      navigate("/");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  const handleSignup = async () => {
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("anthology-production.up.railway.app/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Signup failed");
      }

      // Auto-login after signup with the credentials we just signed up with
      const loginResponse = await fetch("anthology-production.up.railway.app/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username,
          password,
        }),
      });

      if (!loginResponse.ok) {
        throw new Error("Auto-login failed after signup");
      }

      const loginData = await loginResponse.json();
      localStorage.setItem("access_token", loginData.access_token);
      navigate("/");
    } catch (err) {
      setError("Signup failed. Username may already exist.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      isLogin ? handleLogin() : handleSignup();
    }
  };

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-bg-default)",
      }}
    >
    
      <Box
        sx={{
          width: 500,
          backgroundColor: 'var(--color-secondary)',
          padding: 3,
          borderRadius: 4,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        {/* Logo/Brand */}
        <Typography
          variant="h4"
          sx={{
            mb: 1,
            fontFamily: '"Cardo", serif',
            fontWeight: 700,
            color: "var(--color-primary)",
            textAlign: "center",
          }}
        >
          Anthology
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mb: 4,
            fontFamily: '"Cardo", serif',
            color: 'var(--color-primary)',
            textAlign: "center",
          }}
        >
          {isLogin
            ? "Welcome back! Please login to your account."
            : "Create your account to start writing."}
        </Typography>

        {/* Username Field */}
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          size="small"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontFamily: '"Cardo", serif',
              fontSize: "0.875rem",
              borderRadius: 2,
            },
            "& .MuiInputLabel-root": {
              fontFamily: '"Cardo", serif',
            },
          }}
        />

        {/* Email Field - Only for Signup */}
        {!isLogin && (
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontFamily: '"Cardo", serif',
                fontSize: "0.875rem",
                borderRadius: 2,
              },
              "& .MuiInputLabel-root": {
                fontFamily: '"Cardo", serif',
              },
            }}
          />
        )}

        {/* Password Field */}
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          size="small"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontFamily: '"Cardo", serif',
              fontSize: "0.875rem",
              borderRadius: 2,
            },
            "& .MuiInputLabel-root": {
              fontFamily: '"Cardo", serif',
            },
          }}
        />

        {/* Confirm Password - Only for Signup */}
        {!isLogin && (
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            size="small"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontFamily: '"Cardo", serif',
                fontSize: "0.875rem",
                borderRadius: 2,
              },
              "& .MuiInputLabel-root": {
                fontFamily: '"Cardo", serif',
              },
            }}
          />
        )}

        {/* Error Message */}
        {error && (
          <Typography
            color="error"
            sx={{
              mt: 2,
              fontFamily: '"Cardo", serif',
              fontSize: "0.875rem",
            }}
          >
            {error}
          </Typography>
        )}

        {/* Submit Button */}
        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            py: 1.5,
            backgroundColor: "var(--color-primary)",
            fontFamily: '"Cardo", serif',
            fontSize: "1rem",
            fontWeight: 600,
            borderRadius: 2,
            textTransform: "none",
            maxWidth: "300px",
            "&:hover": {
              backgroundColor: "var(--color-primary)",
              opacity: 0.9,
            },
          }}
          onClick={isLogin ? handleLogin : handleSignup}
        >
          {isLogin ? "Login" : "Sign Up"}
        </Button>

        {/* Toggle Link */}
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography
            variant="body2"
            sx={{ fontFamily: '"Cardo", serif', color: "text.secondary" }}
          >
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link
              component="button"
              onClick={toggleMode}
              sx={{
                color: "var(--color-primary)",
                textDecoration: "none",
                fontWeight: 600,
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {isLogin ? "Sign up" : "Login"}
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}