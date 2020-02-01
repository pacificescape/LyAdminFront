import React, { useState, useEffect, useReducer } from 'react'
import { withStyles } from '@material-ui/core'
import { compose } from 'recompose'
import { connect } from 'react-redux'


import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Divider from '@material-ui/core/Divider'

const styles = theme => ({
    GroupSettingsHeader: {
        padding: '10px',
        backgroundColor: theme.palette.grey[700] + '11'
    },
    SetSettingsBlock: {
        margin: '10px 0px 0 10px',
        display: 'flex',
        justifyContent: 'center',
        '& div:nth-child(odd)': {
            margin: '0 5px'
        }
    },
    formControl: {
        display: 'inline-block',
        margin: '5px'
    },
    GreetingsBlock: {
        display: 'inline-block',
        textAlign: 'left',
    },
    inputs: {
        display: 'flex',
        justifyContent: 'center'
    },
    bananField: {
        maxWidth: '130px',
        width: '80px'
    }
})

function GroupSettings(props) {
    const { classes } = props

    const [welcome, setWelcome] = useState(props.currentGroup.settings.welcome.enable)
    const [cas, setCAS] = useState(props.currentGroup.settings.cas)
    const [banan, setBanan] = useState(props.currentGroup.settings.banan.default)
    const [bananError, setBananError] = useState(false)

    const handleWelcomeChange = (event) => {
        setWelcome(event.target.checked)
    }

    const handleCASChange = (event) => {
        setCAS(event.target.checked)
    }

    const handleBananChange = (event) => {
        if (RegExp(/\D/).test(event.target.value)) {
            setBananError(true)
            return
        }
        if (event.target.value < 300) {
            setBananError(true)
            return
        }
        setBanan(event.target.value)
        setBananError(false)
    }

    return (
        <div>
            <Typography className={classes.GroupSettingsHeader}>Settings</Typography>

            <div className={classes.SetSettingsBlock}>
                <div className={classes.GreetingsBlock}>
                    <Typography className={classes.formControl}>Greetings:</Typography>
                    <FormControlLabel
                        className={classes.formControl}
                        control={
                            <Switch
                                color={'secondary'}
                                checked={welcome}
                                onChange={handleWelcomeChange}
                                value="welcome" />
                        }
                    />
                </div>

                <div className={classes.CASBlock}>
                    <Typography className={classes.formControl}>CAS:</Typography>
                    <FormControlLabel
                        className={classes.formControl}
                        control={
                            <Switch
                            color={'secondary'}
                                checked={cas}
                                onChange={handleCASChange}
                                value="welcome" />
                        }
                    />
                </div>
                <div>
                    <TextField
                        className={classes.bananField}
                        onChange={handleBananChange}
                        error={bananError}
                        id="bananField"
                        label="Banan"
                        defaultValue={banan}
                        variant="outlined"
                        margin={'dense'}
                    />
                </div>
            </div>
            <div className={classes.inputs}>

            </div>
            <Divider />
        </div>
    )
}

let mapStateToProps = (state) => {
    return {
        isError: state.App.isError,
        currentGroup: state.App.currentGroup,
        groupmembers: state.App.groupmembers
    }
}

let mapDispatchTooProps = (dispatch) => {
    return {

    }
}


const GroupSettingsContainer = connect(mapStateToProps, mapDispatchTooProps)(GroupSettings)

const enhance = compose(
    withStyles(styles, { withTheme: true })
)

export default enhance(GroupSettingsContainer)
