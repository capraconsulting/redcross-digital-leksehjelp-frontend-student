import React, { useEffect, useState } from 'react';
import ChatBody from './Sections/ChatBody';
import ChatHeader from './Sections/ChatHeader';
import { ISocketMessage, ITextMessage } from '../../interfaces/IMessage';
import '../../styles/Chat.less';
import { createEnterQueueMessage } from '../../services/message-service';

const Chat = () => {
  const [socket, setSocket] = useState(null as any);
  const [messages, setMessages] = useState([] as ITextMessage[]);
  const [roomID, setRoomID] = useState('' as string);
  const [uniqueID, setUniqueID] = useState('' as string);

  useEffect(() => {
    setSocket(new WebSocket('ws://localhost:3001/events'));
  }, []);

  const socketHandler = message => {
    const parsedMessage: ISocketMessage = JSON.parse(message.data);

    if (parsedMessage.type === 'textMessage') {
      const msg: ITextMessage = {
        author: parsedMessage.payload['author'],
        roomID: parsedMessage.payload['roomID'],
        uniqueID: parsedMessage.payload['uniqueID'],
        message: parsedMessage.payload['message'],
        datetime: parsedMessage.payload['datetime'],
      };
      setMessages(messages => [...messages, msg]);
    } else if (parsedMessage.type === 'distributeRoomMessage') {
      setRoomID(parsedMessage.payload['roomID']);
    } else if (parsedMessage.type === 'connectionMessage') {
      setUniqueID(parsedMessage.payload['uniqueID']);
    } 
  };

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = socketHandler;
  });

  useEffect(() => {
    const display = document.querySelector('.display');
    if (display) {
      display.scrollTo(0, display.scrollHeight);
    }
  }, [messages]);

  const sendTextMessage = (message: ISocketMessage) => {
    socket.send(JSON.stringify(message));
  };

  const sendEnterQueueMessage = () => {
    const msg = createEnterQueueMessage(uniqueID);
    socket.send(JSON.stringify(msg));
  };
  return (
    <div className={'chat'}>
      <ChatHeader connectedWith="Caroline Sandsbråten" course="Engelsk" />
      <button onClick={() => sendEnterQueueMessage()}>Enter queue</button>
      <ChatBody
        uniqueID={uniqueID}
        roomID={roomID}
        messages={messages}
        send={sendTextMessage}
      />
    </div>
  );
};

export default Chat;
