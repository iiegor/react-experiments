/**
 * @providesModule App
 */

const React = require('React');
const ReactDOM = require('ReactDOM');

const PageLayout = require('PageLayout.react');
const Header = require('Header.react');
const Content = require('Content.react');
const Button = require('Button.react');

class App extends React.Component {

  render() {
    const reactStyle = {
      display: 'block',
      color: '#61dafb',
      fontSize: 64,
      fontWeight: 'bold',
    };

    const logoStyle = {
      display: 'block',
      position: 'absolute',
      color: '#C62828',
      fontSize: 28,
      left: 161,
      top: 47,
      fontWeight: '600',
    };

    return (
      <PageLayout>
        <Content>
          <strong style={reactStyle}>React</strong>
          <strong style={logoStyle}>Experiments</strong>

          <div style={{textAlign: 'center', padding: 12, backgroundColor: '#f6f8f8', marginTop: 12, borderRadius: 3}}>
            <Button label="Get started" inline></Button>
            <Button label="GitHub" onClick={() => window.open('http://github.com/iiegor/react-experiments')} inline></Button>
          </div>
        </Content>
      </PageLayout>
    );
  }

}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
