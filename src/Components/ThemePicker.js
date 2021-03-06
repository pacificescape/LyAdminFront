import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import {
    changeThemeThunk,
  } from '../redux/reducers/App'

import { withStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { green, red, orange, amber, indigo, deepPurple } from '@material-ui/core/colors';

import Switch from '@material-ui/core/Switch';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const styles = theme => ({
    formControl: {
        width: '175px',
        margin: 'auto'
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
const getColorString = value => {
    switch (value) {
        case red['500']:
            return 'red';
        case orange['500']:
            return 'orange';
        case amber['500']:
            return 'amber';
        case green['500']:
            return 'green';
        case '#5B8AF1':
            return 'blue';
        case indigo['500']:
            return 'indigo';
        case deepPurple['500']:
            return 'deepPurple';
        default:
            return null;
        }

};

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
    const dispatch = useDispatch()

    const toggleTheme = useCallback((type, primary) => {
        dispatch(changeThemeThunk(type, primary))
    }, [])

    const type = useSelector( state => state.App.theme.type )
    const primary = useSelector( state => state.App.theme.primary )

    const { classes } = props

    const [color, setColor] = useState(getColorString(props.theme.palette.primary.main))
    const [darkMode, setDarkMode] = React.useState(props.theme.palette.type === 'dark' ? true : false);

    const handleAccentChange = (event) => {
        setColor(event.target.value)
        let dark = darkMode ? 'dark' : 'light'
        toggleTheme(dark, getColor(event.target.value))
    }

    const handleDarkModeChange = event => {
        if (event.target.checked) {
            setDarkMode(true)

            toggleTheme('dark', getColor(color))
        } else {
            setDarkMode(false)

            toggleTheme('light', getColor(color))
        }
      }

    return (
        <Dialog
            onClose={props.onClose}
            aria-labelledby="simple-dialog-title"
            open={props.open}
            fullWidth={false}
            maxWidth={'xl'}>

            <DialogTitle id="simple-dialog-title">Color theme picker</DialogTitle>
            <FormControlLabel
              className={classes.formControl}
              control={
                <Switch checked={darkMode} onChange={handleDarkModeChange} value="fullWidth" />
              }
              label="Dark mode"
            />
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

export default withStyles(styles, { withTheme: true })(ThemePicker);
