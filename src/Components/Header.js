import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';

import {
    getGroupSettingsThunk,
    setCurrentGroupIdThunk
  } from '../redux/reducers/App'

import HeaderMenu from './HeaderMenu'

import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'

import Drawer from "@material-ui/core/Drawer";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import GroupIcon from '@material-ui/icons/Group';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { connect } from 'react-redux';

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
    wrapper: {
        top: "64px"
    },
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
        // const cookies = new Cookies() // сделать добавление
        // const userName = cookies.get('userName')
        // const userPhoto = cookies.get('userPhoto')

        this.state = {
            top: false,
            isLoading: props.isFetching,
            isAuth: props.isAuth,
            isError: props.isError,
            // userName,
            // userPhoto
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
                        selected={group.id === this.props.currentGroupId}
                        className={this.props.classes.listItem}
                        button key={i}
                        onClick={() => {
                            this.props.setCurrentGroupId(group.id)
                            // this.props.getGroup(group.id)
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
        const groupId = this.props.currentGroupId
        let groupPhoto

        this.props.groups.forEach((i) => {
            if (groupId === i.id && i.photo) {
                groupPhoto = `/file/${i.photo.small_file_id}`
            }
        })

        return (
            <header className={classes.header}>
                <AppBar position="static" className={classes.AppBar}>
                    <HeaderMenu
                        IconButton={classes.IconButton}
                    />
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
                        <Avatar src={groupPhoto}>{this.props.currentGroup.info.title}</Avatar>
                    </div>
                </AppBar>
            </header>
        )
    }
}


const mapStateToProps = (state) => ({
    currentGroupId: state.App.currentGroupId
})

let mapDispatchToProps = (dispatch) => {
    return {
        getGroup: (groupId) => {
            dispatch(getGroupSettingsThunk(groupId))
          },
          setCurrentGroupId: (groupId) => {
              dispatch(setCurrentGroupIdThunk(groupId))
          }
    }
}

const HeaderContainer = connect(mapStateToProps, mapDispatchToProps)(Header)

const enhance = compose(
    withStyles(styles, { withTheme: true })
);

export default enhance(HeaderContainer);
