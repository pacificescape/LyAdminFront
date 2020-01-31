import React, { useState, useEffect, useReducer } from 'react'
import { withStyles } from '@material-ui/core'
import { compose } from 'recompose'
import { connect } from 'react-redux'


import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

const styles = theme => ({
    GroupSettingsHeader: {
        padding: '10px',
        backgroundColor: theme.palette.grey[700] + '11'
    },
    SwitchSettingsBlock: {
        margin: '0 0px 0 0px',
        display: 'flex',
        justifyContent: 'center'
    },
    formControl: {
        display: 'inline-block',
        margin: '5px'
    },
    GreetingsBlock: {
        display: 'inline-block',
        textAlign: 'left',
    },
})

function GroupSettings(props) {
    const { classes } = props

    const [welcome, setWelcome] = useState(props.currentGroup.settings.welcome.enable)
    const [cas, setCAS] = useState(props.currentGroup.settings.cas)

    const handleWelcomeChange = (event) => {
        setWelcome(event.target.checked)
    }

    const handleCASChange = (event) => {
        setCAS(event.target.checked)
    }

    return (
        <div>
            <Typography className={classes.GroupSettingsHeader}>Settings</Typography>

            <div className={classes.SwitchSettingsBlock}>
                <div className={classes.GreetingsBlock}>
                    <Typography className={classes.formControl}>Greetings:</Typography>
                    <FormControlLabel
                        className={classes.formControl}
                        control={
                            <Switch checked={welcome} onChange={handleWelcomeChange} value="welcome" />
                        }
                    />
                </div>

                <div className={classes.CASBlock}>
                    <Typography className={classes.formControl}>CAS:</Typography>
                    <FormControlLabel
                        className={classes.formControl}
                        control={
                            <Switch checked={cas} onChange={handleCASChange} value="welcome" />
                        }
                    />
                </div>
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
