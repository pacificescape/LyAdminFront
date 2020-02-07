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

    const currentGroup = props.groups[props.currentGroupId]

    let use_welcome = (currentGroup && currentGroup.settings && currentGroup.settings.welcome && currentGroup.settings.welcome.enable) || true
    let use_cas = (currentGroup && currentGroup.settings && currentGroup.settings.cas) || true
    let use_banan = (currentGroup && currentGroup.settings && currentGroup.settings.banan && currentGroup.settings.banan.default) || 300
    let use_timer = (currentGroup && currentGroup.settings && currentGroup.settings.welcome && currentGroup.settings.welcome.timer) || 180
    let use_bananError = false
    let use_timerError = false

    const [welcome, setWelcome] = useState(use_welcome)
    const [cas, setCAS] = useState(use_cas)
    const [banan, setBanan] = useState(use_banan)
    const [timer, setTimer] = useState(use_timer)
    const [bananError, setBananError] = useState(use_bananError)
    const [timerError, setTimerError] = useState(use_timerError)

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
