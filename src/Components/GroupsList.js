import React, { Component } from 'react';
import { compose } from 'recompose';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


export default  function GroupsList (props) {


    // const handleRefresh = () => {
    //     this.setState({ open: false });
    //     window.location.reload();
    // };

        return (
            <Dialog
                open={props.open}
                onClose={props.handleClose}>
                <DialogTitle id="simple-dialog-title">Set backup account</DialogTitle>
                {/* <DialogContent>{props.map((i)=>i.title)}</DialogContent> */}
            </Dialog>
        )

}
