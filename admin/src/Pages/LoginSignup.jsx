import React, { useState } from "react";
import "./CSS/LoginSignup.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await axios.get('http://localhost:4000/api/auth/user', {
        headers: { 'auth-token': token }
      });
      return response.data.user;
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      throw error;
    }
  };

  const handleRedirect = async () => {
    try {
      const user = await fetchUserDetails();
      if (user.role === 'admin') {
        window.location.replace('/listproduct')
      } else {
        alert('please try with correct email/password');
      }
    } catch (error) {
      alert('Failed to fetch user details');
    }
  };

  const login = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', formData);
      localStorage.setItem('auth-token', response.data.token);
      await handleRedirect();
    } catch (error) {
      alert("Login failed: " + error.response.data.errors);
    }
  };

  const signup = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/auth/signup', formData);
      localStorage.setItem('auth-token', response.data.token);
      localStorage.setItem('role', response.data.role);
      navigate('/login');
      console.log('Signup successful:', response.data);
    } catch (error) {
      alert("Signup failed: " + error.response.data.errors);
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up" ? <input type="text" placeholder="Your name" name="username" value={formData.username} onChange={changeHandler} /> : null}
          <input type="email" placeholder="Email address" name="email" value={formData.email} onChange={changeHandler} />
          <input type="password" placeholder="Password" name="password" value={formData.password} onChange={changeHandler} />
        </div>
        <button onClick={() => { state === "Login" ? login() : signup() }}>Continue</button>
        {state === "Login" ?
          <p className="loginsignup-login">Create an account? <span onClick={() => { setState("Sign Up") }}>Click here</span></p>
          : <p className="loginsignup-login">Already have an account? <span onClick={() => { setState("Login") }}>Login here</span></p>}
        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
