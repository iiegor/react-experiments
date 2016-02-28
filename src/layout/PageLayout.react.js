/**
 * @providesModule PageLayout
 * @flow
 */

var React = require('React');
var cx = require('cx');

class PageLayout extends React.Component {

  render() {
    return (
      <div className={cx('PageLayout/root')}>
        <div className={cx('PageLayout/layoutContainer')}>{this.props.children}</div>
      </div>
    );
  }

}

module.exports = PageLayout;
