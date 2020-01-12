import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import withTheme from '../Theme';

import GroupsListMenu from './GroupsListMenu'

import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography';
import { applyMiddleware } from 'redux';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const styles = theme => ({
    header: {

    },
    AppBar: {
        height: '64px',
        flexDirection: 'row',
        marginBottom: '10px'
    },
    IconButton: {
        marginLeft: '5px',
        flexGrow: 0
    },
    Typography: {
        verticalAlign: 'middle',
        lineHeight: '64px',
        textAlign: 'left',
        flexGrow: 2
    },
    GroupsList: {
        flexGrow: 10
    },
    Avatar: {
        height: '64px',
        width: '64px',
        flexGrow: 0,
        '& > *': {
            borderRadius: '40px',
            width: '40px',
            height: '40px'
        }
    }
});
class Header extends Component {
    constructor(props) {
        super(props);
        const cookies = new Cookies() // сделать добавление
        const userName = cookies.get('userName')
        const userPhoto = cookies.get('userPhoto')

        this.state = {
            isLoading: props.isFetching,
            isAuth: props.isAuth,
            isError: props.isError,
            userName,
            userPhoto
        }
    }

    handleClick = () => {
        this.setState({ open: !this.state.open })
    }

    render() {
        const { classes } = this.props;

        let title = this.props.currentGroup.info.title || 'Group title'

        if (this.props.isError) {
            title = 'isError'
        }
        return (
            <header className={classes.header}>
                <AppBar position="static" className={classes.AppBar}>
                    <GroupsListMenu
                    className={classes.GroupsList}
                    open={this.state.open}
                    groups={this.props.groups}
                    getGroup={this.props.getGroup}
                    handleClose={this.handleClick}
                    />
                    <Typography
                        variant="h6"
                        className={classes.Typography}>
                        <span>{this.props.currentGroup.info.title}</span>
                    </Typography>
                    <Avatar src={this.state.userPhoto} className={classes.Avatar} />
                </AppBar>
                <span>{this.state.userName}</span>
                <Button variant="outlined" color="primary" onClick={this.handleClick}>
                    {title}
                </Button>
            </header>
        )
    }
}

const enhance = compose(
    withStyles(styles, { withTheme: true })
);

export default enhance(Header);
