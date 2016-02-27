/**
 * @providesModule Content.react
 * @flow
 */

'use strict';

const React = require('React');

const cx = require('cx');

class Content extends React.Component {

  render() {
    return (
      <div className={cx('Content/root')}>
        <div className={cx('Content/headerContainer')}>{this.props.children}</div>
      </div>
    );
  }

}

module.exports = Content;
