/**
 * @providesModule Button.react
 * @flow
 */

'use strict';

const React = require('React');

const cx = require('cx');
const emptyFunction = require('emptyFunction');

type DefaultProps = {
  onClick?: Function,
  inline?: boolean,
};

class Button extends React.Component<DefaultProps> {
  static defaultProps = {
    onClick: emptyFunction.thatReturnsNull,
    inline: false,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const rootClass = cx('Button/root', 'Button/alignInline');

    return (
      <div className={rootClass} onClick={this.props.onClick}>
        <div className={cx('Button/buttonContainer')}>{this.props.label}</div>
      </div>
    );
  }

}

module.exports = Button;
