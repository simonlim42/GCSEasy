import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import email_icon from '../assets/email.png';
import password_icon from '../assets/password.png';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage,setErrorMessage]=useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:3001/register', {
        username,
        password,
      });
      console.log(response.data);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error(error.response.data.error);
      setErrorMessage(error.response.data.error);
      setShowErrorPopup(true);
    }
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    navigate('/option');
  };
  const handleCloseErrorPopup = () => {
    setShowErrorPopup(false);
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text"> Register</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <img src={email_icon} alt="" />
          <input type="email" placeholder="Email" onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        </div>
      </div>
      <div className="submit-container">
        <div className="submit" onClick={handleRegister}>
          Register
        </div>
      </div>
      {showSuccessPopup && (
        <div className="popup">
          <p>Successfully registered!</p>
          <button onClick={handleCloseSuccessPopup}>Close</button>
        </div>
      )}
        {showErrorPopup && (
        <div className="popup">
          <p>{errorMessage}</p>
          <button onClick={handleCloseErrorPopup}>Try again</button>
        </div>
      )}
    </div>
  );
};

export default Register;
