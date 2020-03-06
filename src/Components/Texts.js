import React, { useState, useCallback } from 'react'
import { withStyles } from '@material-ui/core'
import { compose } from 'recompose'
import { useSelector, useDispatch } from 'react-redux'
import {
    getGroupSettingsThunk
  } from '../redux/reducers/Groups'
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import TablePagination from '@material-ui/core/TablePagination';


const styles = theme => ({

    TextsHeader: {
        padding: '10px',
        backgroundColor: theme.palette.grey[700] + '11'
    },
    texts: {
        margin: '10px auto',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        width: '100%',

    },
    text: {
        margin: '10px auto',
        // width: '80%', class="MuiFormControl-root MuiTextField-root"
        width: '90%',
        '& video': {
            transition: '1s',
            opacity: theme.palette.type === 'dark' ? 0.6 : 0.8,
            borderRadius: '5px',
            width: '100%px',
            height: '90px'
        }
    }
})

function Texts(props) {
    const dispatch = useDispatch()
    const currentGroupId = (useSelector(state => state.App.currentGroupId))
    const isFetchingSettings = (useSelector(state => state.Groups.isFetchingSettings))

    const getGroupSettings = useCallback(groupId => {
        dispatch(getGroupSettingsThunk(groupId))
    }, [])


    const texts = useSelector(state => {
        debugger
        if(state.Groups.settings[currentGroupId]) {
            return state.Groups.settings[currentGroupId].welcome.texts
        }   else if (!isFetchingSettings) {
            getGroupSettings(currentGroupId)
            return null
        } else {
            return null
        }
    })



    const { classes } = props

    const [page, setPage] = useState(0)

    function handleChangePage(event, newPage) {
        setPage(newPage)
    }

    if (!texts) {
        return (
            <p>
                Loading Texts
            </p>
        )
    }

    if (texts.length === 0) {
        return ''
    }

    return (
        <div>
            <Typography className={classes.TextsHeader}>Texts {(() => {if (texts.length === 0) return '(empty)'})()}</Typography>
            <form className={classes.texts}>
                {texts.slice(page * 5, (page + 1) * 5).map((text, i) => {
                    return (
                        <div
                            width='80%'
                            className={classes.text}
                            key={`text${i}`}>
                                <TextField
                                    className={classes.text}
                                    width='80%'
                                    id="outlined-basic"
                                    label="Outlined"
                                    variant="outlined"
                                    value={text}
                                    multiline={true}
                                    rowsMax={5}
                                />
                        </div>
                    )
                })}
            </form>
            {(() => {
                if (texts.length === 0) {
                    return
                }

                return (
                    <TablePagination //вычислить ширину, подогнать количество на странице
                        rowsPerPageOptions={[]}
                        labelDisplayedRows={({ from, count }) => `${Math.ceil(from / 5)} of ${Math.ceil(count / 5)}`}
                        component="div"
                        count={texts.length}
                        rowsPerPage={5}
                        page={page}
                        onChangePage={handleChangePage}
                    />)
            })()}
            <Button>
                +
            </Button>
            <Button>
                save
            </Button>
        </div>
    )
}

const enhance = compose(
    withStyles(styles, { withTheme: true })
)

export default enhance(Texts)
