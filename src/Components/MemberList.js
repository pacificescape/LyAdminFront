import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TablePagination from '@material-ui/core/TablePagination'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Avatar from '@material-ui/core/Avatar'
import Paper from '@material-ui/core/Paper'
import { grey } from '@material-ui/core/colors'

import { connect } from 'react-redux'

const useStyles = makeStyles({
    avatarWrapper: {
        display: 'flex',
        borderCollapse: 'none !important'
    },
    avatar: {
        marginRight: '10px',
        width: '25px',
        height: '25px',
        backgroundColor: grey[500]
    },
    table: {
      minWidth: 250,
    },
    tebleRow: {
        '&': {
            borderCollapse: 'none'
        }
    }
  })

function MemberList(props) {
    const classes = useStyles();

    // const [users, setUsers] = useState({empty: false})
    const [page, setPage] = useState(0)

    if (!props.groupmembers[props.id]) {
        if(!props.isLoading.getGroupMembers) {
            if (props.id) {
                props.getGroupMembers(props.id)
            }
        }
        return <p>Загрузка...</p>
    }

    if (!props.users[props.id] && !props.isLoading.getUser) {
        props.getUser(props.groupmembers[props.id], props.id)
        return <p>Загрузка...</p>
    }

    const handleChangePage = (event, newPage) => {
        // debugger
        setPage(newPage);
      }

    return (
        <div>
            <span>В чате {props.groupmembers[props.id].length} <span role="img" aria-label="banan">😊</span></span>
            <p></p>
            <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell><span role="img" aria-label="banan">😊</span></TableCell>
                            <TableCell padding='none' align="center"><span role="img" aria-label="banan">✉️</span></TableCell>
                            <TableCell padding='none' align="center"><span role="img" aria-label="banan">🍌</span></TableCell>
                            <TableCell padding='none' align="center"><span role="img" aria-label="banan">🎂</span></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {props.groupmembers[props.id].sort((a, b) => b.stats.messagesCount - a.stats.messagesCount).slice(page * 10, page + 10).map(member => {
                            if (!props.users[props.id] || !props.users[props.id][member.telegram_id]) {
                                return (
                                    <TableRow key={member.telegram_id} className={classes.tableRow}>
                                        <TableCell>
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                            let user = props.users[props.id][member.telegram_id]

                            let avatar = user.username ? `https://t.me/i/userpic/320/${user.username}.jpg` : ''

                            return (
                                <TableRow key={member.telegram_id} className={classes.tebleRow}>
                                    <TableCell component="th" scope="row">
                                        <div className={classes.avatarWrapper}>
                                            <Avatar
                                                // alt={user.first_name}
                                                src={avatar}
                                                className={classes.avatar}
                                                >
                                                {user.last_name ? user.first_name[0] + ' ' + user.last_name[0] : user.first_name[0]}
                                            </Avatar>
                                            {(() => (user.last_name ? user.first_name + ' ' + user.last_name : user.first_name))()}
                                        </div>
                                    </TableCell>
                                    <TableCell padding='none' align="center">{member.stats.messagesCount}</TableCell>
                                    <TableCell align="center">{member.banan.num}</TableCell>
                                    <TableCell padding='none' align="center">{new Date(member.createdAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[]}
                labelDisplayedRows={({from, count}) => `${Math.ceil(from / 10)} of ${Math.ceil(count / 10)}`}
                component="div"
                count={props.groupmembers[props.id].length}
                rowsPerPage={10}
                page={page}
                onChangePage={handleChangePage}
            />
    </div>
    )
}

let mapStateToProps = (state) => {
    return {
      users: state.Users.users,
      currentGroup: state.App.currentGroup,
      id: state.App.currentGroupId,
      groupmembers: state.Users.groupmembers,
    //   id: state.App.currentGroup.info.id,
      isLoading: {
          getUser: state.App.api.getUser,
          getGroupMembers: state.App.api.getGroupMembers
      }
    }
  }

export default connect(mapStateToProps)(MemberList)
