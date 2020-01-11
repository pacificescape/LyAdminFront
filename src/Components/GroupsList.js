import React, { Component } from 'react';
import { compose } from 'recompose';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {
      width: "50%",
      maxWidth: 360,
      margin: "auto",
      padding: 0,
      backgroundColor: "#555555"
    },
    nested: {
      paddingLeft: theme.spacing(4)
    },
    ListItem: {
        width: "60px"
    }
  }));

export default function GroupsList(props) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [groups] = React.useState(props.groups);


  const handleClick = () => {
      setOpen(!open);
  };

  const renderGroupsList = () => {
      return props.groups.map((group, i) => {
          return (
                <ListItem
                    button key={i}
                    className={classes.nested}
                    onClick={() => props.getGroup(group.id)}>
                    <ListItemText primary={group.title} />
                </ListItem>
          )
        })
  }


    return (
        <div>
            <Dialog
                open={props.open}
                onClose={props.handleClose}>
                <DialogTitle id="simple-dialog-title">Theme:</DialogTitle>
                {/* <DialogContent>{props.map((i)=>i.title)}</DialogContent> */}
            </Dialog>

            <List component="nav" className={classes.root}>
                <ListItem button onClick={handleClick}>
                    <ListItemText primary="Inbox" />
                    {open ? <span>-</span> : <span>+</span>}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {renderGroupsList(groups)}
                    </List>
                </Collapse>
            </List>
        </div>
    )

}
