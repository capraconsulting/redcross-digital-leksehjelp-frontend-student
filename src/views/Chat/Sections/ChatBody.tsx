import React, { useState } from 'react';
import ChatMessage from './ChatMessage';
import '../../../styles/ChatBody';
import { ISocketFile } from '../../../interfaces';
import { createTextMessage } from '../../../services/message-service';
import { ISocketMessage, ITextMessage } from '../../../interfaces/IMessage';

interface IProps {
  messages: ITextMessage[];
  uniqueID;
  roomID;
  send;
}

const ChatBody = (props: IProps) => {
  const [message, setMessage] = useState('' as string);

  const mapMessages = () => {
    return props.messages.map((message, index) => {
      return <ChatMessage key={index} message={message} />;
    });
  };

  const sendTextMessage = event => {
    event.preventDefault();
    if (message.length > 0) {
      const msg: ISocketMessage = createTextMessage(message, props.uniqueID, props.roomID);
      setMessage('');
      props.send(msg);
    }
  };

  const uploadFile = () => {
    const fileInput = document.getElementById('msg-file-input');
    if (fileInput) {
      fileInput.click();
    }
  };

  const sendFileMessage = (file: File) => {
    const fr = new FileReader();
    console.log(file);
    fr.onload = () => {
      const socketFile: ISocketFile = {
        name: file.name,
        type: file.type,
        size: file.size,
        dataURL: String(fr.result),
      };
      const msg: ISocketMessage = createTextMessage(socketFile, props.uniqueID, props.roomID);
      props.send(msg);
    };
    fr.readAsDataURL(file);
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
      <div className={'message-form-container'}>
        <form className={'message-form'}>
          <input
            onChange={event =>
              event.target.files && sendFileMessage(event.target.files[0])
            }
            type="file"
            name="attachment"
            id="msg-file-input"
            accept="image/*|.pdf|.doc|.docx"
            className="file"
          />
          <button type="button" className="upload" onClick={() => uploadFile()}>
            <span className="plus">+</span>
            <div className="tooltip">
              Hvis du sender et vedlegg, må du gjerne fjerne navnet ditt eller
              andre ting fra dokumentet som kan identifisere deg.
            </div>
          </button>
          <input
            className={'message-text'}
            type="textarea"
            value={message}
            onChange={event => setMessage(event.target.value)}
          />
          <button onClick={event => sendTextMessage(event)} className={'send-message'}>
            <svg width="30px" height="30px" viewBox="0 0 30 30">
              <polygon
                className="arrow"
                points="30 15 0 30 5.5 15 0 0"
              ></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBody;
