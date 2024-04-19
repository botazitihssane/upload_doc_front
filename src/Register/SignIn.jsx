import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Avatar, FormControlLabel, Checkbox, Grid, Link, createTheme, CssBaseline } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const defaultTheme = createTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const handleSuccessfulSignIn = (email) => {
   
    localStorage.setItem('userEmail', email);
  };
  
  const handleSignIn = (e) => {
    e.preventDefault();
    setLoading(true);

    axios.post('http://localhost:8081/api/auth/signin', { email, password })
      .then(response => {
        setMessage(response.data);
        setLoading(false);
        if (response.status === 200 && response.data === 'User authenticated successfully!') {
            navigate('/docs');
            handleSuccessfulSignIn(email);
        }
      })
      .catch(error => {
        if (error.response) {
        
          if (!error.response.status === 200) {
            setMessage('Email or password is incorrect.');
          } else {
            setMessage('Email or password is incorrect.');
          }
        } else {
          setMessage('Unable to connect to the server. Please try again later.');
        }
        setLoading(false);
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate onSubmit={handleSignIn} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/login" variant="body2">
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
            {message && (
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                {message}
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default SignIn;
