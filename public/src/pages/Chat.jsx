import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const settingCurrentUser = async () => {
      if (!localStorage.getItem(process.env.CHATLI_LOCALHOST_KEY)) {
        navigate("/login");
      } else {
        try {
          const userData = JSON.parse(
            localStorage.getItem(process.env.CHATLI_LOCALHOST_KEY)
          );
          setCurrentUser(userData);
        } catch (error) {
          console.error("Error parsing user data:", error);
          navigate("/login");
        }
      }
    };
    settingCurrentUser();
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          try {
            const response = await axios.get(`${allUsersRoute}/${currentUser._id}`);
            setContacts(response.data);
          } catch (error) {
            console.error('Error fetching contacts:', error);
          }
        } else {
          navigate("/setAvatar");
        }
      }
    };
  
    fetchContacts();
  }, [currentUser, navigate]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <Container>
      <div className="container">
        <Contacts contacts={contacts} changeChat={handleChatChange} />
        {currentChat === undefined ? (
          <Welcome />
        ) : (
          <ChatContainer currentChat={currentChat} socket={socket} />
        )}
      </div>
    </Container>
  );
}




// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { io } from "socket.io-client";
// import styled from "styled-components";
// import { allUsersRoute, host } from "../utils/APIRoutes";
// import ChatContainer from "../components/ChatContainer";
// import Contacts from "../components/Contacts";
// import Welcome from "../components/Welcome";

// export default function Chat() {
//   const navigate = useNavigate();
//   const socket = useRef();
//   const [contacts, setContacts] = useState([]);
//   const [currentChat, setCurrentChat] = useState(undefined);
//   const [currentUser, setCurrentUser] = useState(undefined);
//   useEffect(async () => {
//     const settingCurrentUser = async () => {
//       if (!localStorage.getItem(process.env.CHATLI_LOCALHOST_KEY)) {
//         navigate("/login");
//       } else {
//         setCurrentUser(
//           await JSON.parse(
//             localStorage.getItem(process.env.CHATLI_LOCALHOST_KEY)
//           )
//         );
//       }
//     }
//     settingCurrentUser();
//   }, []);
//   useEffect(() => {
//     if (currentUser) {
//       socket.current = io(host);
//       socket.current.emit("add-user", currentUser._id);
//     }
//   }, [currentUser]);

//   useEffect(() => {
//     const fetchContacts = async () => {
//       if (currentUser) {
//         if (currentUser.isAvatarImageSet) {
//           try {
//             const response = await axios.get(`${allUsersRoute}/${currentUser._id}`);
//             setContacts(response.data);
//           } catch (error) {
//             console.error('Error fetching contacts:', error);
//           }
//         } else {
//           navigate("/setAvatar");
//         }
//       }
//     };
  
//     fetchContacts();
//   }, [currentUser, navigate]);

//   // useEffect(async () => {
//   //   if (currentUser) {
//   //     if (currentUser.isAvatarImageSet) {
//   //       const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
//   //       setContacts(data.data);
//   //     } else {
//   //       navigate("/setAvatar");
//   //     }
//   //   }
//   // }, [currentUser]);
//   const handleChatChange = (chat) => {
//     setCurrentChat(chat);
//   };
//   return (
//     <>
//       <Container>
//         <div className="container">
//           <Contacts contacts={contacts} changeChat={handleChatChange} />
//           {currentChat === undefined ? (
//             <Welcome />
//           ) : (
//             <ChatContainer currentChat={currentChat} socket={socket} />
//           )}
//         </div>
//       </Container>
//     </>
//   );
// }

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
