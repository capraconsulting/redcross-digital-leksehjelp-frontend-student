import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

export const SectionHelper = (props: RouteComponentProps) => {
  const { history } = props;
  return (
    <div className="cross-my-heart--helper" style={{ textAlign: 'left' }}>
      Fant du ikke det du lette etter?{' '}
      <a
        className="cross-my-heart--link"
        onClick={() => history.push('questions/new')}
      >
        Still et spørsmål
      </a>
    </div>
  );
};

export default withRouter(SectionHelper);
