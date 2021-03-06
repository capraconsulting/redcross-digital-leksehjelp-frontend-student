import React, { useState, useCallback, useContext } from 'react';
import { useDropzone } from 'react-dropzone';

//Services
import { TextMessageBuilder } from '../../../services/message-service';
import { uploadFileToAzureBlobStorage } from '../../../services/azure-service';

//Styles
import '../../../styles/ChatInput.less';
import Cross from '../../../assets/Cross';

//Interfaces
import { IFile } from '../../../interfaces';
import { SocketContext } from '../../../providers';
import { addMessageAction } from '../../../reducers';

interface IProps {
  uniqueID: string;
  roomID: string;
}

const ChatInput = (props: IProps) => {
  const [message, setMessage] = useState<string>('');
  const [tempFiles, setTempFiles] = useState([] as any[]);
  const { socketSend, dispatchMessages } = useContext(SocketContext);
  const { uniqueID, roomID } = props;

  const uploadPromises = tempFiles => {
    return tempFiles.map(async file => {
      return uploadFileToAzureBlobStorage('chatfiles', roomID, file);
    });
  };

  const sendTextMessage = (event, files) => {
    event.preventDefault();
    if (message.length > 0 || files.length > 0) {
      const msg = new TextMessageBuilder(uniqueID)
        .withMessage(message)
        .withFiles(files)
        .toRoom(roomID)
        .withImgUrl(message)
        .build();

      const socketMessage = msg.createMessage;
      if (socketMessage) {
        socketSend(socketMessage);
        dispatchMessages(addMessageAction(socketMessage));
        setMessage('');
        setTempFiles([] as any[]);
      }
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    return Promise.all<IFile>(uploadPromises(tempFiles)).then(results => {
      sendTextMessage(event, results);
    });
  };

  const openFileDialog = () => {
    const ref = document.getElementById('file-dialog');
    ref && ref.click();
  };

  const onDrop = useCallback(
    acceptedFiles => {
      setTempFiles([...tempFiles, ...acceptedFiles]);
    },
    [tempFiles],
  );
  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop,
  });

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files) {
      const newFiles: (File | null)[] = [];
      for (let i = 0; i < files.length; i++) {
        newFiles.push(files.item(i));
      }
      setTempFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  const FileList = () => {
    return (
      <div className="subject--list">
        {tempFiles &&
          tempFiles.map((file, index) => {
            const { name } = file;
            return (
              <div key={index} className="subject--list-element">
                <p>{name}</p>
                <button
                  className="leksehjelp--button-close chip-btn-x"
                  onClick={() => {
                    setTempFiles(tempFiles.filter((_, i) => i !== index));
                  }}
                >
                  <Cross color="#8b51c6" />
                </button>
              </div>
            );
          })}
      </div>
    );
  };

  function renderInput() {
    return (
      <input
        className="message-text"
        type="textarea"
        placeholder="Skriv her"
        value={message}
        onChange={event => {
          setMessage(event.target.value);
        }}
      />
    );
  }

  return (
    <div className="chat-input">
      <FileList />
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <input
          onChange={onFileChange}
          type="file"
          name="attachment"
          id="msg-file-input"
          accept="image/*|.pdf|.doc|.docx"
          className="file"
        />
        <div className="message-form-container">
          <form className="message-form">
            <button type="button" className="upload" onClick={openFileDialog}>
              <input
                type="file"
                id="file-dialog"
                className="input-file"
                accept="image/*|.pdf|.doc|.docx|.csv"
                onChange={onFileChange}
              />
              <span className="plus">+</span>
              <div className="tooltip">
                Hvis du sender et vedlegg, må du gjerne fjerne navnet ditt eller
                andre ting fra dokumentet som kan identifisere deg.
              </div>
            </button>
            {renderInput()}
            <button onClick={handleSubmit} className="send-message">
              <svg width="30px" height="30px" viewBox="0 0 30 30">
                <polygon className="arrow" points="30 15 0 30 5.5 15 0 0" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
