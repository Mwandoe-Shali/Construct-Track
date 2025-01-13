import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Alert,
  CircularProgress,
  Link
} from '@mui/material';
import { authService } from '../services/auth';
import { roles } from '../services/roles';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/authSlice';

export default function AuthPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fullName, setFullName] = useState('');
  const [contact, setContact] = useState('');

  const validateForm = () => {
    if (!email || !password) {
      setErrorMessage('Please fill in all fields');
      return false;
    }
    if (!email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }
    if (!isLogin && !roles.isValidRoleEmail(email)) {
      setErrorMessage('Please use your Gmail address with +manager or +supervisor (e.g., your.email+manager@gmail.com)');
      return false;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return false;
    }
    if (!isLogin && (!fullName || !contact)) {
      setErrorMessage('Please fill in all fields');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data, error } = isLogin
        ? await authService.signIn(email, password)
        : await authService.signUp(email, password, fullName, contact);

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (data?.user) {
        dispatch(setUser({
          id: data.user.id,
          email: data.user.email!,
          role: roles.getRoleFromEmail(data.user.email!)
        }));
        
        if (isLogin) {
          navigate('/dashboard');
        } else {
          setErrorMessage('Registration successful! Please check your email to verify your account.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardContent className="space-y-6">
          <div className="text-center">
            <Typography variant="h5" component="h2">
              {isLogin ? 'Sign In' : 'Create Account'}
            </Typography>
            {!isLogin && (
              <Typography variant="body2" color="textSecondary" className="mt-2">
                Use your Gmail with +manager or +supervisor<br />
                Example: <code>your.email+manager@gmail.com</code>
              </Typography>
            )}
          </div>

          {errorMessage && (
            <Alert severity="error" onClose={() => setErrorMessage('')}>
              {errorMessage}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                  required
                />
                <TextField
                  fullWidth
                  label="Contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  disabled={loading}
                  required
                />
              </>
            )}
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              helperText={!isLogin && "Add +manager or +supervisor to your Gmail address"}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                isLogin ? 'Sign In' : 'Sign Up'
              )}
            </Button>
          </form>

          <Box textAlign="center">
            <Button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMessage('');
              }}
              color="primary"
              disabled={loading}
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </Button>
          </Box>

          {!isLogin && (
            <Typography variant="body2" color="textSecondary" className="text-center">
              <Link href="https://gmail.googleblog.com/2008/03/2-hidden-ways-to-get-more-from-your.html" target="_blank">
                Learn more about Gmail plus addressing
              </Link>
            </Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
}