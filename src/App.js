/**
 * @providesModule App
 */

const React = require('React');
const ReactDOM = require('ReactDOM');

const PageLayout = require('PageLayout.react');
const Header = require('Header.react');
const Content = require('Content.react');

class App extends React.Component {

  render() {
    return (
      <PageLayout>
        <Header>Hello world!</Header>
        <Content>Content</Content>
      </PageLayout>
    );
  }

}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
