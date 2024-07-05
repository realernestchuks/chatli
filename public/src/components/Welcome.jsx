import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
export default function Welcome() {
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedData = localStorage.getItem(process.env.CHATLI_LOCALHOST_KEY);
        if (storedData) {
          const data = JSON.parse(storedData);
          if (data && data.username) {
            setUserName(data.username);
          } else {
            console.log('Username not found in stored data');
          }
        } else {
          console.log('No data found in localStorage');
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };
  
    fetchUsername();
  }, []);
  // useEffect(async () => {
  //   setUserName(
  //     await JSON.parse(
  //       localStorage.getItem(process.env.CHATLI_LOCALHOST_KEY)
  //     ).username
  //   );
  // }, []);
  return (
    <Container>
      <img src={Robot} alt="" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;
