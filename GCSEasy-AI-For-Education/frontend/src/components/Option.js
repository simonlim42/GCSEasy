import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'

const Option = () =>{
    const navigate = useNavigate();
    const tutorPortal = async () =>{
        try{
            navigate('/tutor')
        }catch(error){ //catches any errors thrown by the axios.post request
            console.error(error.response.data.message);
        }
    }
    const plannerPortal = async () =>{
        try{
            navigate('/planner')
        }catch(error){ //catches any errors thrown by the axios.post request
            console.error(error.response.data.message);
        }
    }
    return(
        <div className='container'>
            <div className="submit-container">
                <div className="submit" onClick = {tutorPortal}>Tutor</div>
                <div className="submit" onClick = {plannerPortal}>Planner</div>
            </div>

        </div>

    );
};

export default Option;