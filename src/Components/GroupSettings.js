import React, { useState } from 'react'
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
        flexDirection: 'row',
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
    CASBlock: {
        display: 'inline-block',
        textAlign: 'left',
    },
    setSettingsInputs: {
        margin: '10px 0px 0 10px',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    bananField: {
        display: 'inline-block',
        maxWidth: '130px',
        width: '80px',
        margin: '0 10px 10px'
    },
    timerField: {
        display: 'inline-block',
        maxWidth: '130px',
        width: '80px',
        margin: '0 10px 10px'
    }
})

function GroupSettings(props) {
    const { classes } = props



    const [welcome, setWelcome] = useState(true)
    const [cas, setCAS] = useState(true)
    const [banan, setBanan] = useState(300)
    const [timer, setTimer] = useState(180)
    const [bananError, setBananError] = useState(false)
    const [timerError, setTimerError] = useState(false)

    if ((!props.groups && !props.currentGroupId) || props.groups[props.currentGroupId]) {
        return <Typography className={classes.GroupSettingsHeader}>Settings</Typography>
    } else {
        const currentGroup = props.groups[props.currentGroupId]
        setWelcome(currentGroup.settings.welcome.enable)
        setCAS(currentGroup.settings.cas)
        setBanan(currentGroup.settings.banan.default)
        setTimer(currentGroup.settings.welcome.timer)
        setBananError(false)
        setTimerError(false)
    }

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
        if (event.target.value < 60) {
            setBananError(true)
            return
        }
        setBanan(event.target.value)
        setBananError(false)
    }

    const handleTimerChange = (event) => {
        if (RegExp(/\D/).test(event.target.value)) {
            setTimerError(true)
            return
        }
        if (event.target.value < 300) {
            setTimerError(true)
            return
        }
        setTimer(event.target.value)
        setTimerError(false)
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
            </div>
            <Divider />
            <div className={classes.setSettingsInputs}>
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
                <div>
                    <TextField
                        className={classes.timerField}
                        onChange={handleTimerChange}
                        error={timerError}
                        id="timerField"
                        label="timer"
                        defaultValue={timer}
                        variant="outlined"
                        margin={'dense'}
                    />
                </div>
            </div>
        </div>
    )
}

let mapStateToProps = (state) => {
    return {
        isError: state.App.isError,
        currentGroupId: state.App.currentGroupId,
        groups: state.App.groups,
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
