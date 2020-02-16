import React, { useState } from 'react'
import { useSelector } from 'react-redux'
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
    avatarEmpty: {
        opacity: 0.2
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
          const users = useSelector(state => state.Users.users)
          const currentGroup = useSelector(state => state.App.currentGroup )
          const id = useSelector(state => state.App.currentGroupId)
          const groupmembers = useSelector(state => state.Users.groupmembers)
          const isLoading =  {
              getUser: useSelector(state => state.App.api.getUser),
              getGroupMembers: useSelector(state => state.App.api.getGroupMembers)
          }




    const classes = useStyles();

    // const [users, setUsers] = useState({empty: false})
    const [page, setPage] = useState(0)

    if (!groupmembers[id]) {
        if(!isLoading.getGroupMembers) {
            if (id) {
                props.getGroupMembers(id)
            }
        }
        return <p>Загрузка...</p>
    }

    if (!users[id] && !isLoading.getUser) {
        props.getUser(groupmembers[id], id)
        return <p>Загрузка...</p>
    }

    const handleChangePage = (event, newPage) => {
        // debugger
        setPage(newPage);
    }

    const renderList = () => {
        let currentPage = groupmembers[id].sort((a, b) => b.stats.messagesCount - a.stats.messagesCount).slice(page * 10, page * 10 + 10)

        currentPage = currentPage.map((member) => {
            if (!users[id] || !users[id][member.telegram_id]) {
                return (
                    <TableRow key={member.telegram_id} className={classes.tableRow}>
                        <TableCell>
                            Loading...
                        </TableCell>
                    </TableRow>
                )
            }
            let user = users[id][member.telegram_id]

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
        })

        if (currentPage.length < 10) {
            for (let i = currentPage.length; i < 10; i++) {
                currentPage.push(
                <TableRow key={`empty-${i}`}>
                <TableCell component="th" scope="row">
                <div className={classes.avatarWrapper}>
                            <Avatar
                                className={`${classes.avatar} ${classes.avatarEmpty}`}
                            >
                            </Avatar>
                        </div>
                </TableCell>
                <TableCell padding='none' align="center"> </TableCell>
                <TableCell align="center"> </TableCell>
                <TableCell padding='none' align="center"> </TableCell>
                </TableRow>)
            }
        }

        return currentPage
    }

    return (
        <div>
            <span>В чате {groupmembers[id].length} <span role="img" aria-label="banan">😊</span></span>
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
                    <TableBody>
                        {renderList()}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[]}
                labelDisplayedRows={({from, count}) => `${Math.ceil(from / 10)} of ${Math.ceil(count / 10)}`}
                component="div"
                count={groupmembers[id].length}
                rowsPerPage={10}
                page={page}
                onChangePage={handleChangePage}
            />
    </div>
    )
}

export default (MemberList)
