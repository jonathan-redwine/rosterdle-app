import React from 'react';
import './PageNotFound.scss';
import { ENTITIES } from '../../constants/entities';

const PageNotFound = props => {
  return (
    <div className="page-not-found">
      <div>How did you get here?</div>
      <div>
        Click{' '}
        <span className="link" onClick={() => props.entitySelected(ENTITIES.HOME)}>
          here
        </span>{' '}
        to return home.
      </div>
    </div>
  );
};

export default PageNotFound;
