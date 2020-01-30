import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles';

import ThemePicker from './ThemePicker'

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PaletteIcon from '@material-ui/icons/Palette';
import SendIcon from '@material-ui/icons/Send';


const StyledMenu = withStyles(theme => ({
    paper: {
        border: theme.palette.info.main,
    },
}))(props => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles(theme => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);

export default function HeaderMenu(props) {
    const [anchorEl, setAnchorEl] = useState()
    const [openThemePicker, setOpenThemePicker] = useState(false)

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                className={props.IconButton}
                onClick={handleClick}>
                <MenuIcon></MenuIcon>
            </Button>
            <StyledMenu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <StyledMenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <SendIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Sent mail" />
                </StyledMenuItem>
                <StyledMenuItem
                    onClick={() => {handleClose(); return openThemePicker ? null: setOpenThemePicker(true)}}
                >
                    <ThemePicker
                        open={openThemePicker}
                        onClose={() => openThemePicker ? setOpenThemePicker(false) : null}
                        onChangeTheme={props.onChangeTheme}
                    />
                    <ListItemIcon>
                        <PaletteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Theme" />
                </StyledMenuItem>
            </StyledMenu>
        </>
    )
}
