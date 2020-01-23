import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import withTheme from '../Theme';
import { makeStyles } from "@material-ui/core/styles";

import GroupsListMenu from './GroupsListMenu'

import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'

import { applyMiddleware } from 'redux';

import Drawer from "@material-ui/core/Drawer";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import GroupIcon from '@material-ui/icons/Group';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh';

const styles = theme => ({
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
            margin: '12px',
            borderRadius: '40px',
            width: '40px',
            height: '40px'
        }
    },
    wrapper: { top: "64px" },
    list: {
        width: '100%',
        '&:first-child': {
            border: '1px, solid, grey'
        },
        '&div': {
            border: '1px, solid, grey'
        }
    },
    fullList: {
        display: 'flex',
        top: "64px",
        flexGrow: 10
    }
});

class Header extends Component {
    constructor(props) {
        super(props);
        const cookies = new Cookies() // сделать добавление
        const userName = cookies.get('userName')
        const userPhoto = cookies.get('userPhoto')

        this.state = {
            top: false,
            isLoading: props.isFetching,
            isAuth: props.isAuth,
            isError: props.isError,
            userName,
            userPhoto
        }
    }

    renderGroupsList = () => (
        <div
            className={this.props.classes.fullList}
            role="presentation"
            onClick={this.handleClick}
            onKeyDown={this.handleClick}
        >
            <List className={this.props.classes.list}>
                {this.props.groups.map((group, i) => (
                    <ListItem
                        selected={group.id === this.props.currentGroup.info.id}
                        className={this.props.classes.listItem}
                        button key={i}
                        onClick={() => {
                            this.props.getGroup(group.id)
                            this.handleClick()
                        }}>
                        <ListItemIcon>
                            <GroupIcon />
                        </ListItemIcon>
                        <Typography variant="inherit" noWrap>{group.title}</Typography>
                    </ListItem>
                ))}
            </List>
        </div>
    )


    handleClick = () => {
        this.setState({ top: !this.state.top });
    };

    render() {
        const { classes } = this.props;

        return (
            <header className={classes.header}>
                <AppBar position="static" className={classes.AppBar}>
                    <Button className={classes.IconButton}>
                        <MenuIcon></MenuIcon>
                    </Button>
                    <Button
                        className={classes.GroupsList}
                        onClick={this.handleClick}
                    >
                        <ArrowRightIcon />
                        <Typography variant="inherit" noWrap>
                            {this.props.currentGroup.info.title}
                        </Typography>
                    </Button>
                    <Drawer
                        className={classes.wrapper}
                        anchor="top"
                        open={this.state.top}
                        onClose={this.handleClick}
                    >
                        {this.renderGroupsList()}
                    </Drawer>
                    <div className={classes.Avatar} >
                        <Avatar src={this.props.userPhoto} />
                    </div>
                </AppBar>
            </header>
        )
    }
}

const enhance = compose(
    withStyles(styles, { withTheme: true })
);

export default enhance(Header);
