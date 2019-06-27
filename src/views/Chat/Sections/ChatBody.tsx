import React, { useState } from 'react';
import ChatMessage from './ChatMessage';
import '../../../styles/ChatBody';
import { ISocketFile } from '../../../interfaces';
import { createTextMessage } from '../../../services/message-service';
import { ISocketMessage, ITextMessage } from '../../../interfaces/IMessage';

interface IProps {
  messages: ITextMessage[];
}

const ChatBody = (props: IProps) => {

  const mapMessages = () => {
    return props.messages.map((message, index) => {
      return <ChatMessage key={index} message={message} />;
    });
  };

  return (
    <div className={'cb'}>
      <div className={'display'} id="message-display">
        <div className={'welcome-container'}>
          <p className="welcome-header">Velkommen til chaten!</p>
          <p className="welcome-body">
            Hvis du sender et vedlegg må du gjerne fjerne navnet ditt eller
            andre ting fra dokumentet som kan indentifisere deg.
          </p>
        </div>
        {mapMessages()}
      </div>
    </div>
  );
};

export default ChatBody;
