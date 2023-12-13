import React, {useState} from 'react';
import axios from 'axios';
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import './Tutor.css'
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    TypingIndicator,
  } from "@chatscope/chat-ui-kit-react";

const Tutor = () =>{
    const botName = "Turtle the Tutor";
    const [typing,setTyping] = useState(false);
    const [messages,setMessages] = useState([{
        message: "Say Hello!",
        sender:"Turtle"
    }])
    const handleSend = async (message)=>{
        const newMessage = {
            message: message,
            sender: "user",
            direction: "outgoing"
        }
        const newMessages=[...messages,newMessage];//old+new messages
        setMessages(newMessages)
        setTyping(true);
        //update state
        try{
            const response = await axios.post('http://localhost:5000/api/tutor',{
                newMessages
            });
            console.log(response.data)
            const botResponse = { message: response.data[0].message, sender: 'bot' };
            const finalMessages = [...newMessages, botResponse]; // old+new messages
            setMessages(finalMessages);
            // console.log(messages)
        }catch(error){
            console.log("activate")
            console.error(error);
          }
        
        setTyping(false);
    };

    return(
        <div className="container mx-auto max-w-[700px]">
        <MainContainer>
            <ChatContainer className="my-chat-container">
            <MessageList typingIndicator ={typing ? <TypingIndicator content= {botName + ' is typing'}/> : null}>
                {messages.map((message,i)=>{
                    return <Message key={i} model={message}/>
                })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend}/>
            </ChatContainer>
        </MainContainer>
        </div>
    )
}
    

export default Tutor;