import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'
import email_icon from '../assets/email.png'
import password_icon from '../assets/password.png'

const Login = () =>{
    const[username,setUsername]=useState('')
    const[password,setPassword]=useState('')
    const [isLoginFailed, setIsLoginFailed] = useState(false);
    const navigate = useNavigate();
    const handleLogin = async () =>{
        try{
            const response = await axios.post('http://localhost:3001/login',
            {
                username,
                password, 
            });
            console.log(response.data);
            navigate('/option')
        }catch(error){ //catches any errors thrown by the axios.post request
            console.error(error.response.data.message);
            setIsLoginFailed(true);
        }
    }
    return(
        <div className='container'>
            <div className ='header'>
                <div className='text'> Login</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className="input">
                    <img src = {email_icon} alt=""/>
                    <input type="email" placeholder='Email' onChange={(e)=>setUsername(e.target.value)}/>
                </div>
                <div className="input">
                    <img src = {password_icon} alt=""/>
                    <input type="password" placeholder='Password' onChange={(e)=>setPassword(e.target.value)}/>
                </div>
            </div>
            <div className='create-account'>Don't have an account? <span onClick = {()=>navigate('register')}> Click here!</span></div>
            <div className="submit-container">
                <div className="submit" onClick = {handleLogin}>Login</div>
            </div>

            {isLoginFailed && (
            <div className="popup">
              <p>Incorrect password!</p>
              <button onClick={() => setIsLoginFailed(false)}>Close</button>
            </div>
          )}
        </div>

    );
};

export default Login;