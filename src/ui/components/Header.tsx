import React, { useState, useEffect, useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import Zoom from 'react-reveal/Zoom';

//Styles
import '../../styles/Header.less';

//Services
import getApplicationTitle from '../../services/header-service';
import { SocketContext } from '../../providers';
import ModalComponent from './ModalComponent';

export const Header = (props: RouteComponentProps) => {
  let { history } = props;

  const { inQueue, roomID, cleanState } = useContext(SocketContext);
  const [time, setTime] = useState<Date>(new Date());
  const [isOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setInterval(() => setTime(new Date()), 10 * 1000);
  }, []);

  const cancelQueueAndChat = () => {
    cleanState();
    setIsModalOpen(false);
    history.push('/');
  };

  return (
    <div className="header">
      <a className="header--link" onClick={() => history.push('/')}>
        <span className="header--logo" id="header--logo">
          {getApplicationTitle('Digital Leksehjelp')}
        </span>
        <span className="header--serviceStatusMessage">
          {!isOpen && time.getDay() >= 5 && ' åpner mandag kl. 17:00'}
          {!isOpen && time.getDay() < 5 && ' åpner kl. 17:00'}
          {isOpen && ' åpen'}
        </span>
      </a>

      {inQueue && (
        <div className="header-button-container">
          <p>
            {roomID ? 'Du er i en samtale med en frivillig' : 'Du står i kø'}
          </p>
          <button
            className="header-button"
            onClick={() => setIsModalOpen(true)}
          >
            Avslutt
          </button>
        </div>
      )}
      <span>
        <a href="https://www.rodekors.no/">
          <img
            className="header--rk_logo"
            src={require('../../assets/images/rk_logo.png')}
          />
        </a>
      </span>

      {isModalOpen && (
        <ModalComponent
          content={
            roomID
              ? 'Er du sikker på at du vil avslutte samtalen?'
              : 'Er du sikker på at du vil avslutte køen?'
          }
          warningButtonText="Avslutt"
          warningCallback={() => cancelQueueAndChat()}
          closingCallback={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default withRouter(Header);
