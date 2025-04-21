import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Link,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Collapse,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
  CheckCircle,
  Error as ErrorIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import authBack from "../assets/authBack.png";

// Styled components with enhanced aesthetics
const BlueSide = styled(Box)(({ theme }) => ({
  backgroundColor: '#59BBF6',
  height: '100vh',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  padding: theme.spacing(6),
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url(${authBack})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.7,
    zIndex: 0,
  }
}));

const FloatingShape = styled(motion.div)(({
  size = 100,
  top,
  left,
  right,
  bottom,
  rotate = 0,
  opacity = 0.2
}) => ({
  position: 'absolute',
  width: size,
  height: size,
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  borderRadius: '10px',
  top,
  left,
  right,
  bottom,
  transform: `rotate(${rotate}deg)`,
  filter: 'blur(4px)',
  opacity,
}));

const FormSide = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(3),
  transition: 'all 0.5s ease',
}));

const FormContainer = styled(motion.div)(() => ({
  maxWidth: 400,
  width: '100%',
  margin: '0 auto',
}));

const TabsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  borderRadius: '50px',
  backgroundColor: '#F0F0F0',
  padding: '4px',
  position: 'relative',
  width: 'fit-content',
  marginBottom: theme.spacing(4),
  overflow: 'hidden',
}));

const TabButton = styled(Button)(({ active }) => ({
  borderRadius: '50px',
  padding: '10px 24px',
  minWidth: '120px',
  fontWeight: 500,
  color: active ? '#000' : '#666',
  backgroundColor: active ? '#fff' : 'transparent',
  boxShadow: active ? '0px 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  zIndex: 2,
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: active ? '#fff' : 'rgba(255, 255, 255, 0.5)',
    transform: 'translateY(-2px)',
  },
  '&::before': active ? {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '3px',
    backgroundColor: '#1DA1F2',
    borderRadius: '3px 3px 0 0',
    transition: 'all 0.3s ease'
  } : {},
}));

const StyledTextField = styled(TextField)(({ isValid, isTouched }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#fff',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    borderRadius: '8px',
    '& fieldset': {
      borderColor: isTouched ? (isValid ? '#4CAF50' : isValid === false ? '#f44336' : '#e0e0e0') : '#e0e0e0',
      transition: 'border-color 0.3s ease',
    },
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
      '& fieldset': {
        borderColor: isTouched ? (isValid ? '#4CAF50' : isValid === false ? '#f44336' : '#bdbdbd') : '#bdbdbd',
      },
    },
    '&.Mui-focused': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      '& fieldset': {
        borderColor: isTouched ? (isValid ? '#4CAF50' : isValid === false ? '#f44336' : '#59BBF6') : '#59BBF6',
      },
    },
  },
  '& .MuiInputLabel-root': {
    color: '#666',
    transition: 'color 0.3s ease',
    '&.Mui-focused': {
      color: isTouched ? (isValid ? '#4CAF50' : isValid === false ? '#f44336' : '#59BBF6') : '#59BBF6',
    },
  },
  '& .MuiInputAdornment-root': {
    '& .MuiSvgIcon-root': {
      transition: 'color 0.3s ease',
      color: isTouched ? (isValid ? '#4CAF50' : isValid === false ? '#f44336' : 'text.secondary') : 'text.secondary',
    }
  }
}));

const CreateButton = styled(Button)(() => ({
  borderRadius: '50px',
  padding: '12px',
  background: 'linear-gradient(45deg, #1DA1F2 30%, #00c6ff 90%)',
  fontSize: '16px',
  fontWeight: 500,
  textTransform: 'none',
  boxShadow: '0 4px 10px rgba(29, 161, 242, 0.3)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 15px rgba(29, 161, 242, 0.4)',
  },
  '&:active': {
    transform: 'translateY(1px)',
    boxShadow: '0 2px 8px rgba(29, 161, 242, 0.5)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '5px',
    height: '5px',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    opacity: 0,
    borderRadius: '50%',
    transform: 'scale(1, 1) translate(-50%, -50%)',
    transformOrigin: '50% 50%',
  },
  '&:focus::after': {
    animation: 'ripple 1s ease-out',
  },
  '@keyframes ripple': {
    '0%': {
      opacity: 1,
      transform: 'scale(0, 0) translate(-50%, -50%)',
    },
    '100%': {
      opacity: 0,
      transform: 'scale(20, 20) translate(-50%, -50%)',
    }
  }
}));

const PasswordStrengthBar = styled(Box)(({ strength }) => ({
  height: '4px',
  width: '100%',
  backgroundColor: '#f0f0f0',
  borderRadius: '2px',
  marginTop: '8px',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: `${Math.min(100, strength * 25)}%`,
    backgroundColor:
      strength === 0 ? '#f0f0f0' :
        strength === 1 ? '#f44336' :
          strength === 2 ? '#ff9800' :
            strength === 3 ? '#ffeb3b' :
              '#4caf50',
    transition: 'width 0.5s ease, background-color 0.5s ease'
  }
}));

const RadioButtonLabel = styled(FormControlLabel)(({ checked }) => ({
  '& .MuiFormControlLabel-label': {
    transition: 'color 0.3s ease',
    color: checked ? '#1DA1F2' : 'text.primary',
    fontWeight: checked ? 500 : 400,
  },
  '& .MuiRadio-root': {
    transition: 'transform 0.3s ease',
    transform: checked ? 'scale(1.1)' : 'scale(1)',
  }
}));

const ValidationIcon = styled(Box)(({ isValid }) => ({
  display: 'flex',
  alignItems: 'center',
  color: isValid ? '#4CAF50' : '#f44336',
  fontSize: '0.75rem',
  marginTop: '4px',
  transition: 'opacity 0.3s ease',
  opacity: 0.8,
  '&:hover': {
    opacity: 1
  }
}));

// Create animated components using motion
const MotionGrid = motion.create(Grid);
const MotionTypography = motion.create(Typography);

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [tabValue, setTabValue] = useState('signup');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false
  });
  const [validations, setValidations] = useState({
    name: null,
    email: null,
    password: null
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const floatingShapeVariants = {
    animate: (custom) => ({
      y: [custom.y, custom.y + 20, custom.y],
      rotate: [custom.rotate, custom.rotate + 5, custom.rotate],
      transition: {
        duration: custom.duration,
        repeat: Infinity,
        ease: "easeInOut"
      }
    })
  };

  // Function to check password strength
  const checkPasswordStrength = (password) => {
    if (!password) return 0;

    let strength = 0;

    // Check length
    if (password.length >= 8) strength += 1;

    // Check for lowercase and uppercase letters
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;

    // Check for numbers
    if (/\d/.test(password)) strength += 1;

    // Check for special characters
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

    return strength;
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleTabChange = (tabName) => {
    if (tabName === 'signin') {
      navigate('/signin');
    } else {
      setTabValue(tabName);
    }
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    navigate('/signin');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    validateField(name, value);

    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let isValid = true;

    switch (name) {
      case 'name':
        isValid = value.trim().length > 0;
        break;
      case 'email':
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        break;
      case 'password':
        isValid = value.length >= 6;
        break;
      default:
        break;
    }

    setValidations(prev => ({
      ...prev,
      [name]: isValid || value === '' ? isValid : false
    }));

    return isValid;
  };

  const validateForm = () => {
    const nameValid = validateField('name', formData.name);
    const emailValid = validateField('email', formData.email);
    const passwordValid = validateField('password', formData.password);

    // Set all fields as touched for UI feedback
    setTouched({
      name: true,
      email: true,
      password: true
    });

    const newErrors = {};
    if (!nameValid) newErrors.name = 'Name is required';
    if (!emailValid) {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else {
        newErrors.email = 'Email is invalid';
      }
    }
    if (!passwordValid) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0: return "";
      case 1: return "Weak";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Strong";
      default: return "";
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return "text.secondary";
      case 1: return "#f44336";
      case 2: return "#ff9800";
      case 3: return "#ffeb3b";
      case 4: return "#4caf50";
      default: return "text.secondary";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await axios.post('http://localhost:3000/api/auth/signup', formData);

      if (response.status === 201) {
        localStorage.setItem('token', response.data.token);
        setSubmitSuccess(true);
        setTimeout(() => {
          navigate('/signin');
        }, 1500);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.data.errors) {
          const backendErrors = {};
          error.response.data.errors.forEach(err => {
            backendErrors[err.path] = err.msg;
          });
          setErrors(backendErrors);
        } else if (error.response.data.message === 'Email already in use.') {
          setErrors({ email: 'Email is already in use' });
          setSubmitError('Email is already in use. Please try a different email address.');
        } else {
          setSubmitError('An error occurred. Please try again.');
          console.error('Signup error:', error.response.data);
        }
      } else {
        setSubmitError('Network error. Please check your connection and try again.');
        console.error('Signup error:', error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Grid container sx={{ height: '100vh' }}>
      {/* Left side - Enhanced with animations */}
      <MotionGrid
        item
        xs={12}
        md={6}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <BlueSide>
          {/* Floating shapes animation */}
          <FloatingShape
            size={80}
            top="15%"
            left="10%"
            rotate={15}
            opacity={0.3}
            custom={{ y: 0, rotate: 15, duration: 5 }}
            variants={floatingShapeVariants}
            animate="animate"
          />
          <FloatingShape
            size={120}
            top="60%"
            right="15%"
            rotate={45}
            opacity={0.2}
            custom={{ y: 0, rotate: 45, duration: 7 }}
            variants={floatingShapeVariants}
            animate="animate"
          />
          <FloatingShape
            size={60}
            bottom="20%"
            left="20%"
            rotate={30}
            opacity={0.25}
            custom={{ y: 0, rotate: 30, duration: 6 }}
            variants={floatingShapeVariants}
            animate="animate"
          />

          {/* Content with animation */}
          <Box sx={{ position: "relative", zIndex: 1, mb: 4, p: 3 }}>
            <MotionTypography
              variant="h3"
              component="h1"
              color="white"
              fontWeight="bold"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Create Your Account
            </MotionTypography>
            <MotionTypography
              variant="h6"
              color="white"
              sx={{ mt: 2, opacity: 0.9 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 0.9 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Join our community and start organizing or attending amazing events.
            </MotionTypography>
          </Box>
        </BlueSide>
      </MotionGrid>

      {/* Right side with form - Enhanced with animations */}
      <Grid item xs={12} md={6}>
        <FormSide>
          <FormContainer
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Animated Tab Buttons */}
            <motion.div variants={itemVariants}>
              <TabsContainer>
                <TabButton
                  active={tabValue === 'signin'}
                  onClick={() => handleTabChange('signin')}
                  disableRipple
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In
                </TabButton>
                <TabButton
                  active={tabValue === 'signup'}
                  onClick={() => handleTabChange('signup')}
                  disableRipple
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Up
                </TabButton>
              </TabsContainer>
            </motion.div>

            {/* Success and Error messages */}
            <Collapse in={submitSuccess || !!submitError}>
              <Box mb={3}>
                {submitSuccess && (
                  <Alert
                    severity="success"
                    icon={<CheckCircle />}
                    sx={{
                      animation: 'fadeIn 0.5s',
                      '@keyframes fadeIn': {
                        '0%': { opacity: 0, transform: 'translateY(-10px)' },
                        '100%': { opacity: 1, transform: 'translateY(0)' }
                      }
                    }}
                  >
                    Account created successfully! Redirecting you...
                  </Alert>
                )}

                {submitError && (
                  <Alert
                    severity="error"
                    icon={<ErrorIcon />}
                    sx={{
                      animation: 'shake 0.5s',
                      '@keyframes shake': {
                        '0%, 100%': { transform: 'translateX(0)' },
                        '20%, 60%': { transform: 'translateX(-5px)' },
                        '40%, 80%': { transform: 'translateX(5px)' }
                      }
                    }}
                  >
                    {submitError}
                  </Alert>
                )}
              </Box>
            </Collapse>

            {/* Form fields */}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <motion.div variants={itemVariants}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  Full name
                </Typography>
                <StyledTextField
                  margin="none"
                  required
                  fullWidth
                  id="name"
                  name="name"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.name}
                  helperText={errors.name}
                  isValid={validations.name}
                  isTouched={touched.name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                    endAdornment: touched.name && (
                      <InputAdornment position="end">
                        {validations.name && <CheckCircle color="success" />}
                        {validations.name === false && <ErrorIcon color="error" />}
                      </InputAdornment>
                    )
                  }}
                  sx={{ mb: 3 }}
                  variant="outlined"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  Email address
                </Typography>
                <StyledTextField
                  margin="none"
                  required
                  fullWidth
                  id="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.email}
                  helperText={errors.email}
                  isValid={validations.email}
                  isTouched={touched.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                    endAdornment: touched.email && (
                      <InputAdornment position="end">
                        {validations.email && <CheckCircle color="success" />}
                        {validations.email === false && <ErrorIcon color="error" />}
                      </InputAdornment>
                    )
                  }}
                  sx={{ mb: 3 }}
                  variant="outlined"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  Password
                </Typography>
                <StyledTextField
                  margin="none"
                  required
                  fullWidth
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.password}
                  helperText={errors.password}
                  isValid={validations.password}
                  isTouched={touched.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        {touched.password && (
                          validations.password ? <CheckCircle color="success" /> :
                            validations.password === false ? <ErrorIcon color="error" /> : null
                        )}
                        <Box component={motion.div} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} ml={1}>
                          {showPassword ? (
                            <VisibilityOff
                              sx={{ color: 'text.secondary', cursor: 'pointer' }}
                              onClick={handleClickShowPassword}
                            />
                          ) : (
                            <Visibility
                              sx={{ color: 'text.secondary', cursor: 'pointer' }}
                              onClick={handleClickShowPassword}
                            />
                          )}
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 1 }}
                  variant="outlined"
                />

                {/* Password strength indicator */}
                {formData.password && (
                  <Box sx={{ mb: 2 }}>
                    <PasswordStrengthBar strength={passwordStrength} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                      <Typography variant="caption" color={getPasswordStrengthColor()}>
                        {getPasswordStrengthText()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {passwordStrength < 3 && "Add special characters & numbers"}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </motion.div>

              {/* New Role Selection Section with enhanced UI */}
              <motion.div variants={itemVariants}>
                <FormLabel component="legend" sx={{
                  mb: 1,
                  fontWeight: 500,
                  color: 'text.primary',
                  fontSize: '0.875rem',
                  transform: 'scale(1)'
                }}>
                  Sign up as:
                </FormLabel>
                <RadioGroup
                  row
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  sx={{ mb: 3 }}
                >
                  <RadioButtonLabel
                    value="customer"
                    checked={formData.role === 'customer'}
                    control={
                      <Radio
                        color="primary"
                        sx={{
                          '&.Mui-checked': {
                            color: '#1DA1F2',
                            transform: 'scale(1.1)',
                            transition: 'transform 0.3s ease'
                          }
                        }}
                      />
                    }
                    label="Customer"
                    sx={{ mr: 3 }}
                  />
                  <RadioButtonLabel
                    value="organiser"
                    checked={formData.role === 'organiser'}
                    control={
                      <Radio
                        color="primary"
                        sx={{
                          '&.Mui-checked': {
                            color: '#1DA1F2',
                            transition: 'transform 0.3s ease'
                          }
                        }}
                      />
                    }
                    label="Event Organiser"
                  />
                </RadioGroup>
              </motion.div>

              {/* Submit Button with loading state */}
              <motion.div variants={itemVariants}>
                <CreateButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{ mt: 2, mb: 2 }}
                  component={motion.button}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Create Account"
                  )}
                </CreateButton>
              </motion.div>

              {/* Terms and Conditions */}
              <motion.div variants={itemVariants}>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                  By signing up, you agree to our{' '}
                  <Link href="#" sx={{
                        color: "#1DA1F2",
                        textDecoration: "none",
                        position: "relative",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          width: "100%",
                          transform: "scaleX(0)",
                          height: "2px",
                          bottom: "-2px",
                          left: 0,
                          backgroundColor: "#1DA1F2",
                          transformOrigin: "bottom right",
                          transition: "transform 0.3s ease-out"
                        },
                        "&:hover::after": {
                          transform: "scaleX(1)",
                          transformOrigin: "bottom left"
                        }
                      }}>
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <br/>
                  <Link href="#" sx={{
                        color: "#1DA1F2",
                        textDecoration: "none",
                        position: "relative",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          width: "100%",
                          transform: "scaleX(0)",
                          height: "2px",
                          bottom: "-2px",
                          left: 0,
                          backgroundColor: "#1DA1F2",
                          transformOrigin: "bottom right",
                          transition: "transform 0.3s ease-out"
                        },
                        "&:hover::after": {
                          transform: "scaleX(1)",
                          transformOrigin: "bottom left"
                        }
                      }}>
                    Privacy Policy
                  </Link>.
                </Typography>
              </motion.div>

              {/* Already have an account */}
              {/* <motion.div variants={itemVariants}>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
                  Already have an account?{' '}
                  <Link
                    href="#"
                    color="primary"
                    underline="hover"
                    onClick={handleSignIn}
                    component={motion.span}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign in
                  </Link>
                </Typography>
              </motion.div> */}


              <motion.div variants={itemVariants}>
                <Box sx={{ textAlign: "center", mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{' '}
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/signin");
                      }}
                      sx={{
                        color: "#1DA1F2",
                        textDecoration: "none",
                        position: "relative",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          width: "100%",
                          transform: "scaleX(0)",
                          height: "2px",
                          bottom: "-2px",
                          left: 0,
                          backgroundColor: "#1DA1F2",
                          transformOrigin: "bottom right",
                          transition: "transform 0.3s ease-out"
                        },
                        "&:hover::after": {
                          transform: "scaleX(1)",
                          transformOrigin: "bottom left"
                        }
                      }}
                    >
                      Sign in
                    </Link>
                  </Typography>
                </Box>
              </motion.div>
            </Box>
          </FormContainer>
        </FormSide>
      </Grid>
    </Grid>
  );
};

export default SignupPage;