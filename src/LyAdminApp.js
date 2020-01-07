import React, { Component } from 'react';
import withTheme from './Theme'
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, componentFromStream } from 'recompose'
import Button from '@material-ui/core/Button';
import GroupsList from './Components/GroupsList'
import './LyAdminApp.css';

const styles = theme => ({
  '@global': {
      a: {
          color: theme.palette.primary.main
      },
      code: {
          color: theme.palette.primary.dark
      },
      pre: {
          borderColor: theme.palette.divider,
          color: theme.palette.primary.dark,
          // background: theme.palette.primary.main + '11'
          '&::selection': {
              color: theme.palette.text.primary,
              backgroundColor: 'highlight'
          }
      },
      body: {
          textAlign: 'center',
          background: theme.palette.type === 'dark' ? theme.palette.grey[900] : '#ffffff',
          color: theme.palette.text.primary
      }
  }
});



class LyAdminApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    }
  }

  handleClickOpen = () => {
    this.setState({open: true})
  }

  handleClose = () => {
    this.setState({open: false})
  }

  render() {

    return (
      <div id="app">
        <header className="">
        LyAdminBot
        </header>
        <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
          Open simple dialog
        </Button>
        <GroupsList open={this.state.open} handleClose={this.handleClose}/>
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
  withStyles(styles, { withTheme: true })
);

export default enhance(LyAdminApp);
