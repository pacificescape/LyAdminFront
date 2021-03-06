import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ChatIcon from '@material-ui/icons/Chat'
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    menuButton: {
        height: '64px',
        borderRadius: '32px',
        padding: 0,
        boxShadow: 'none',
        userSelect: 'none',
        '&:hover': {
            boxShadow: 'none',
            backgroundColor: theme.palette.primary.main
        }
    },
    IconButton: {
        userSelect: 'none'
    },
    StyledMenuItem: {
        borderRadius: 0
    }
}));

const StyledMenu = withStyles({
    list: {
        paddingTop: 0,
        paddingBottom: 0,
        borderRadius: 0,

    },
    paper: {
        border: 'none',
        padding: 0,
        borderRadius: 0
    },
})(props => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles(theme => ({
    root: {
        borderRadius: 0,
    },
    selected: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    }

}))(MenuItem);

export default function GroupsListMenu(props) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [groups] = React.useState(props.groups);

    const renderGroupsList = () => {
        return props.groups.map((group, i) => {
            return (
                <StyledMenuItem
                    border={1}
                    button
                    key={i}
                    className={classes.StyledMenuItem}
                    onClick={() => {
                        props.getGroup(group.id)
                        handleClose()
                        }}>
                    <ListItemIcon>
                        <ChatIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={group.title} />
                </StyledMenuItem>
            )
        })
    }

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    return (

        <div>
            <Button onClick={handleClick}>Open Top</Button>
            <Button
                id={'headerMenuButton'}

                className={classes.menuButton}
                aria-controls="customized-menu"
                aria-haspopup="true"
                variant="contained"
                color="primary"
                onClick={handleClick}
            ><Typography
                    noWrap
                    component={"button"}
                    variant="button"
                    className={classes.Typography}>
                    <span>{props.title}</span>
                </Typography>
            </Button>

            <StyledMenu
                className={classes.menuList}
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {renderGroupsList(groups)}
            </StyledMenu>
        </div>
    )

}
