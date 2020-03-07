import React, { useState, useCallback, useEffect } from 'react'
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
        minHeight: '405px'

    },
    text: {
        margin: '10px auto',
        width: '95%',
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
    const { classes } = props
    const dispatch = useDispatch()
    const currentGroupId = (useSelector(state => state.App.currentGroupId))
    const isFetchingSettings = (useSelector(state => state.Groups.isFetchingSettings))

    const getGroupSettings = useCallback(groupId => {
        dispatch(getGroupSettingsThunk(groupId))
    }, [])

    useEffect(() => {
        setPage(0);
      }, [currentGroupId]);

    const texts = useSelector(state => {
        if(state.Groups.settings[currentGroupId]) {
            return state.Groups.settings[currentGroupId].welcome.texts
        }   else if (!isFetchingSettings) {
            getGroupSettings(currentGroupId)
        }
        return []
    })

    const [textValues, setTextValues] = useState(null)
    const [textErrors, setTextErrors] = useState(false)

    if(!textValues && texts.length !== 0) {
        setTextValues(texts.reduce((acc, v, i) => {return {...acc, [i]: v}}, {}))
        setTextErrors(Object.assign({}, texts.map(t => false)))
    }

    function textValidator(event) {
        if(event.target.value.indexOf('%name%') === -1) {
            setTextErrors({...textErrors, [+event.target.id]: true})
        } else {
            setTextErrors({...textErrors, [+event.target.id]: false})
        }
        setTextValues({...textValues, [+event.target.id]: event.target.value})
    }

    const [page, setPage] = useState(0)
    function handleChangePage(event, newPage) {
        setPage(newPage)
    }

    function deleteText(event) {
        delete textValues[Object.keys(textValues)[0]]
        setTextValues(textValues)
    }

    if (!texts) {
        return (
            <p>
                Loading Texts
            </p>
        )
    }

    if (!textValues) {
        return ''
    }

    return (
        <div>
            <Typography className={classes.TextsHeader}>{(() => {if (texts.length !== 0) return 'Приветствия:'})()}</Typography>
            <form className={classes.texts}>
                {texts.slice(page * 3, (page + 1) * 3).map((text, i) => {
                    return (
                        <div
                            className={classes.text}
                            key={`text${i}`}>
                                <TextField
                                    className={classes.text}
                                    id={`${page * 3 + i}`}
                                    label={textErrors[`${page * 3 + i}`] ? textValues[`${page * 3 + i}`].length !== 0 ? 'Добавьте %name%' : "Приветсвие будет удалено" : "Приветствие"}
                                    variant="outlined"
                                    value={textValues[`${page * 3 + i}`]}
                                    multiline={true}
                                    rowsMax={3}
                                    onChange={textValidator}
                                    error={textErrors[`${page * 3 + i}`]}
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
                    <TablePagination
                        rowsPerPageOptions={[]}
                        labelDisplayedRows={({ from, count }) => `${Math.ceil(from / 5)} of ${Math.ceil(count / 5)}`}
                        component="div"
                        count={texts.length}
                        rowsPerPage={5}
                        page={page}
                        onChangePage={handleChangePage}
                    />)
            })()}
            <Button
            onClick={deleteText}>
                -
            </Button>
            <Button
            >
                save
            </Button>
        </div>
    )
}

const enhance = compose(
    withStyles(styles, { withTheme: true })
)

export default enhance(Texts)
