import React, { FunctionComponent } from 'react';
import '../../styles/Header.less';

type HeaderState = {
  isOpen?: boolean,
  day?: number
}

const Header: FunctionComponent<HeaderState> = ({isOpen, day = 1}) => (
  <div className="header">
    <a className="header--link" href="https://www.digitalleksehjelp.no/">
      <span className="header--logo">
        Digital Leksehjelp 
      </span> 
      <span className="header--serviceStatusMessage">
        {!isOpen && day >= 5 ? " åpner mandag kl. 17:00" : ""}
        {!isOpen && day < 5 ? " åpner kl. 17:00" : ""}
        {isOpen ? " åpen" : ""}
      </span> 
    </a>
    <span>
      <img className="header--rk_logo" src={require('../../assets/images/rk_logo.png')} />
    </span>
  </div>
);

export default Header;