import React, { useState } from 'react';
import { connect } from 'react-redux'
import {
    changeThemeThunk,
  } from '../redux/reducers/App'

import { makeStyles, withStyles, getStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { blue, green, red, orange, amber, indigo, deepPurple } from '@material-ui/core/colors';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const styles = theme => ({
    formControl: {
        margin: '10px'
    },
    group: {
        margin: '10px'
    },
    redRoot: {
        color: red[600],
        '&$checked': {
            color: red[500]
        }
    },
    orangeRoot: {
        color: orange[600],
        '&$checked': {
            color: orange[500]
        }
    },
    amberRoot: {
        color: amber[600],
        '&$checked': {
            color: amber[500]
        }
    },
    greenRoot: {
        color: green[600],
        '&$checked': {
            color: green[500]
        }
    },
    blueRoot: {
        color: '#5B8AF1',
        '&$checked': {
            color: '#5B8AF1'
        }
    },
    indigoRoot: {
        color: indigo[600],
        '&$checked': {
            color: indigo[500]
        }
    },
    deepPurpleRoot: {
        color: deepPurple[600],
        '&$checked': {
            color: deepPurple[500]
        }
    },
    checked: {}
});

const getColor = value => {
    switch (value) {
        case 'red':
            return red;
        case 'orange':
            return orange;
        case 'amber':
            return amber;
        case 'green':
            return green;
        case 'blue':
            return { main: '#5B8AF1' };
        case 'indigo':
            return indigo;
        case 'deepPurple':
            return deepPurple;
        default:
            return null
    }
};

function SimpleDialog(props) {
    const { classes } = props

    const [color, setColor] = useState(props.theme.palette.primary.main)

    const handleAccentChange = (event) => {
        setColor(event.target.value)

        props.toggleTheme('dark', getColor(event.target.value))
    }

    return (
        <Dialog
            onClose={props.onClose}
            aria-labelledby="simple-dialog-title"
            open={props.open}
            fullWidth={true}
            maxWidth={'xl'}>

            <DialogTitle id="simple-dialog-title">Color theme picker</DialogTitle>
            <FormControl component='fieldset' className={classes.formControl}>
                <FormLabel focused component='legend'>
                    Accent
                        </FormLabel>
                <RadioGroup
                    aria-label='accent'
                    name='accent1'
                    className={classes.group}
                    value={color}
                    onChange={handleAccentChange}>
                    <FormControlLabel
                        value='red'
                        control={
                            <Radio
                                color='primary'
                                classes={{
                                    root: classes.redRoot,
                                    checked: classes.checked
                                }}
                            />
                        }
                        label='Red'
                    />
                    <FormControlLabel
                        value='orange'
                        control={
                            <Radio
                                color='primary'
                                classes={{
                                    root: classes.orangeRoot,
                                    checked: classes.checked
                                }}
                            />
                        }
                        label='Orange'
                    />
                    <FormControlLabel
                        value='amber'
                        control={
                            <Radio
                                color='primary'
                                classes={{
                                    root: classes.amberRoot,
                                    checked: classes.checked
                                }}
                            />
                        }
                        label='Amber'
                    />
                    <FormControlLabel
                        value='green'
                        control={
                            <Radio
                                color='primary'
                                classes={{
                                    root: classes.greenRoot,
                                    checked: classes.checked
                                }}
                            />
                        }
                        label='Green'
                    />
                    <FormControlLabel
                        value='blue'
                        control={
                            <Radio
                                color='primary'
                                classes={{
                                    root: classes.blueRoot,
                                    checked: classes.checked
                                }}
                            />
                        }
                        label='Blue'
                    />
                    <FormControlLabel
                        value='indigo'
                        control={
                            <Radio
                                color='primary'
                                classes={{
                                    root: classes.indigoRoot,
                                    checked: classes.checked
                                }}
                            />
                        }
                        label='Indigo'
                    />
                    <FormControlLabel
                        value='deepPurple'
                        control={
                            <Radio
                                color='primary'
                                classes={{
                                    root: classes.deepPurpleRoot,
                                    checked: classes.checked
                                }}
                            />
                        }
                        label='Deep Purple'
                    />
                </RadioGroup>
            </FormControl>

        </Dialog>
    );
}

function ThemePicker(props) {
    const handleClose = () => {
        props.onClose();
    };

    return (
        <div>
            <SimpleDialog {...props} open={props.open} onClose={handleClose} />
        </div>
    );
}

let mapDispatchToProps = (dispatch) => {
    return {
        toggleTheme: (type, primary) => {
            dispatch(changeThemeThunk(type, primary))
        }
    }
}

let mapStateToProps = state => {
    return {
        type: state.App.theme.type,
        primary: state.App.theme.primary
    }
}

const ThemePickerContainer = connect(mapStateToProps, mapDispatchToProps)(ThemePicker)

export default withStyles(styles, { withTheme: true })(ThemePickerContainer);

// <List>
// <ListItem autoFocus button onClick={props.onClose}>
//   <ListItemAvatar>
//     <Avatar>
//       <AddIcon />
//     </Avatar>
//   </ListItemAvatar>
//   <ListItemText primary="Add account" />
// </ListItem>
// </List>
