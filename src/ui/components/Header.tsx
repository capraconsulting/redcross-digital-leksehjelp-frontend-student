import React, { useContext, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
//Styles
import '../../styles/Header.less';
//Services
import { SocketContext } from '../../providers';
import ModalComponent from './ModalComponent';
import { ICustomWindow } from '../../interfaces/ICustomWindow';
import { CHAT_TYPES } from '../../../config';
import { useOpeningHours } from '../../providers/OpeningHoursProvider';
import ResponsiveComponent from './ResponsiveComponent';
import { MediaQuery } from '../../enums/media-query';

declare const window: ICustomWindow;

export const Header = (props: RouteComponentProps) => {
  let { history } = props;

  const { inQueue, roomID, cleanState, studentInfo } = useContext(
    SocketContext,
  );

  const { openingMessage } = useOpeningHours();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const cancelQueueAndChat = () => {
    if (
      roomID &&
      (studentInfo.chatType === CHAT_TYPES.LEKSEHJELP_TEXT ||
        studentInfo.chatType === CHAT_TYPES.LEKSEHJELP_VIDEO)
    ) {
      window._gscq.push(['show', process.env.GETSITECONTROL_WIDGET_ID]);
    }
    cleanState();
    setIsModalOpen(false);
    history.push('/');
  };

  return (
    <div className="header">
      <a className="header--link" onClick={() => history.push('/')}>
        <span className="header--logo" id="header--logo">
          Digital Leksehjelp
        </span>
        <ResponsiveComponent
          threshold={MediaQuery.TABLET_PORTRAIT}
          belowThreshold={<br />}
        />
        <span className="header--serviceStatusMessage">{openingMessage}</span>
      </a>
      {inQueue && (
        <div className="header-button-container">
          <button
            className="header-button"
            onClick={() => setIsModalOpen(true)}
          >
            {roomID ? 'Avslutt samtale' : 'Forlat kø'}
          </button>
        </div>
      )}
      <span>
        <a
          href="https://www.rodekors.no/"
          target="_blank"
          rel="noopener noreferrer"
        >
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
