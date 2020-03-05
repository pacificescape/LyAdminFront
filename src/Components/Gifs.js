import React, { useState, useCallback } from 'react'
import { withStyles } from '@material-ui/core'
import { compose } from 'recompose'
import { useSelector, useDispatch } from 'react-redux'
import {
    getGroupSettingsThunk
  } from '../redux/reducers/Groups'
import Typography from '@material-ui/core/Typography';
import TablePagination from '@material-ui/core/TablePagination';


const styles = theme => ({
    GifsHeader: {
        padding: '10px',
        backgroundColor: theme.palette.grey[700] + '11'
    },
    gifs: {
        margin: '5px',
        display: 'flex',
        flexWrap: 'wrap'
    },
    gif: {
        margin: '5px auto',
        width: 'fit-content',
        height: '90px',
        '& video': {
            transition: '1s',
            opacity: theme.palette.type === 'dark' ? 0.6 : 0.8,
            borderRadius: '5px',
            width: '100%px',
            height: '90px'
        }
    }
})

function Gifs(props) {
    const dispatch = useDispatch()
    const currentGroupId = (useSelector(state => state.App.currentGroupId))
    const isFetchingSettings = (useSelector(state => state.Groups.isFetchingSettings))

    const getGroupSettings = useCallback(groupId => {
        dispatch(getGroupSettingsThunk(groupId))
    }, [])


    const gifs = useSelector(state => {
        debugger
        if(state.Groups.settings[currentGroupId]) {
            return state.Groups.settings[currentGroupId].welcome.gifs
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

    function handlePlay(event) {
        // debugger
        event.target.onplaying = (event) => {
            event.target.style.opacity = 1
        };
        event.target.style.opacity = '100%'
        event.target.play()
        event.target.onended = (event) => {
            event.target.style.opacity = 0.6
        }
    }

    if (!gifs) {
        return (
            <p>
                Loading Gifs
            </p>
        )
    }

    if (gifs.length === 0) {
        return ''
    }

    return (
        <div>
            <Typography className={classes.GifsHeader}>Gifs {(() => {if (gifs.length === 0) return '(empty)'})()}</Typography>
            <div className={classes.gifs}>
                {gifs.slice(page * 5, (page + 1) * 5).map((gif) => {
                    return (
                        <div
                            className={classes.gif}
                            key={gif}>
                            <video
                                onMouseOver={handlePlay}
                                src={`/file/${gif}`}
                            />
                        </div>
                    )
                })}
            </div>
            {(() => {
                // debugger
                if (gifs.length === 0) {
                    return
                }

                return (
                    <TablePagination //вычислить ширину, подогнать количество на странице
                        rowsPerPageOptions={[]}
                        labelDisplayedRows={({ from, count }) => `${Math.ceil(from / 5)} of ${Math.ceil(count / 5)}`}
                        component="div"
                        count={gifs.length}
                        rowsPerPage={5}
                        page={page}
                        onChangePage={handleChangePage}
                    />)
            })()}
        </div>
    )
}

const enhance = compose(
    withStyles(styles, { withTheme: true })
)

export default enhance(Gifs)
