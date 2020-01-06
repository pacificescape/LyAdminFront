import React, { Component } from 'react';
import withTheme from './HOC/Theme'
import { compose } from 'recompose'
import './App.css';

class LyAdminApp extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  render() {

    return (
      <div id="app">
        <header className="">
        LyAdminBot
        </header>
      </div>
    )
  }
}

// const Theme = styled.div`
//     background-color: #181a1b;
//     color: #ffffff;
//     margin: auto;
//     height: 100vh;
// `

const enhance = compose(
  // withLanguage,
  // withTranslation(),
  withTheme,
  // withStyles(styles, { withTheme: true })
);

export default enhance(LyAdminApp);
