import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import '../../../css/pagingMenu.css';

export default class SubPagingMenu extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div styleName={'pagingMenuContainer'}>
        <div styleName={'menuButtonBar'}>
          {['code','usage','style'].map(element => {
           return (
             <NavLink to={`${this.props.currentPageUrl}/${element}`} activeClassName={'activePagingButton'}>
               <div styleName={'menuButton'}>{element}</div>
             </NavLink>
           );
          })}
        </div>
      </div>
    );
  }

}

SubPagingMenu.displayName = 'SubPagingMenu';

SubPagingMenu.propTypes = {
  currentPageUrl: PropTypes.string.isRequired
};

SubPagingMenu.defaultProps = {
};
