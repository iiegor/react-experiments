/**
 * @providesModule Header.react
 * @flow
 */

'use strict';

const React = require('React');

const cx = require('cx');

class Header extends React.Component {

  render() {
    return (
      <div className={cx('Header/root')}>
        <div className={cx('Header/headerContainer')}>{this.props.children}</div>
      </div>
    );
  }

}

module.exports = Header;
