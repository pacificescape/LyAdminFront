import React, { useState, useEffect } from 'react'
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
        float: 'left',
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
    tdName: {
        width: '60%',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        padding: '1%',
        overflow: 'hidden',
    },
    tdMessages: {
        width: '18%',
        minWidth: '55px',
        padding: '0px',
        '& > div': {
            width: 'fit-content',
            margin: 'auto'
        }
    },
    tdBanan: {
        width: '5%',
        maxWidth: '70px',
        padding: '0px',
        '& > div': {
            width: 'fit-content',
            margin: 'auto'
        }
    },
    noselect: {
        userSelect: 'none !important'
    }
    // overrides: {
    //     MuiTableCell: {
    //         width: '7% !important',
    //         overflow: 'hidden',
    //         paddingRight: '15px'
    //     }
    // }
})

function MemberList(props) {
    const users = useSelector(state => state.Users.users)
    const currentGroupId = useSelector(state => state.App.currentGroupId)
    const groupmembers = useSelector(state => state.Users.groupmembers)
    const isLoading = {
        getUser: useSelector(state => state.App.api.getUser),
        getGroupMembers: useSelector(state => state.App.api.getGroupMembers)
    }

    useEffect(() => {
        setPage(0);
    }, [currentGroupId]);

    const classes = useStyles();

    const [page, setPage] = useState(0)

    if (!groupmembers[currentGroupId]) {
        if (!isLoading.getGroupMembers) {
            if (currentGroupId) {
                props.getGroupMembers(currentGroupId)
            }
        }
        return <p>Загрузка...</p>
    }

    if (!users[currentGroupId] && !isLoading.getUser) {
        props.getUser(groupmembers[currentGroupId], currentGroupId)
        return <p>Загрузка...</p>
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const renderList = () => {
        let currentPage = groupmembers[currentGroupId].sort((a, b) => b.stats.messagesCount - a.stats.messagesCount).slice(page * 10, page * 10 + 10)

        currentPage = currentPage.map((member) => {
            if (!users[currentGroupId] || !users[currentGroupId][member.telegram_id]) {
                return (
                    <TableRow key={member.telegram_id} className={classes.tableRow}>
                        <TableCell component="th" scope="row">
                            <div className={classes.avatarWrapper}>
                                <Avatar
                                    className={`${classes.avatar} ${classes.avatarEmpty}`}
                                >
                                </Avatar>
                            </div>
                        </TableCell>
                        <TableCell>
                            Загрузка...
                        </TableCell>
                    </TableRow>
                )
            }
            let user = users[currentGroupId][member.telegram_id]

            let avatar = user.username ? `https://t.me/i/userpic/320/${user.username}.jpg` : ''

            return (
                <TableRow key={member.telegram_id} className={classes.tebleRow}>
                    <TableCell component="td" className={classes.tdName}>
                        <div className={classes.avatarWrapper}>
                            <Avatar
                                src={avatar}
                                className={classes.avatar}
                            >
                                {user.last_name ? user.first_name[0] + ' ' + user.last_name[0] : user.first_name[0]}
                            </Avatar>
                        </div>
                        <span>
                            {user.last_name ? (user.first_name + ' ' + user.last_name) : user.first_name}
                        </span>
                    </TableCell>
                    <TableCell styles={{ 'min-width': '50px' }} align="center" className={classes.tdMessages}>
                        <div >
                            {member.stats.messagesCount}
                        </div>
                        </TableCell>
                    <TableCell align="center" className={classes.tdBanan}><div>{member.banan.num}</div></TableCell>
                    <TableCell align="center" className={classes.tdDate}>{new Date(member.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
            )
        })

        if (currentPage.length < 10) {
            let length = groupmembers[currentGroupId] > 9 ? 10 : groupmembers[currentGroupId]

            for (let i = currentPage.length; i < length; i++) {
                currentPage.push(
                    <TableRow key={`empty-${i}`}>
                        <TableCell component="td" scope="row">
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
            <span>В чате {groupmembers[currentGroupId].length} <span role="img" aria-label="banan">😊</span></span>
            <p></p>
            <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell><span role="img" aria-label="banan">😊</span></TableCell>
                            <TableCell padding='none' align="center"><span role="img" aria-label="banan">✉️</span></TableCell>
                            <TableCell className={classes.banan} padding='none' align="center"><span role="img" aria-label="banan">🍌</span></TableCell>
                            <TableCell padding='none' align="center"><span role="img" aria-label="banan">🎂</span></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {renderList()}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                className={classes.noselect}
                rowsPerPageOptions={[]}
                labelDisplayedRows={({ from, count }) => `${Math.ceil(from / 10)} of ${Math.ceil(count / 10)}`}
                component="div"
                count={groupmembers[currentGroupId].length}
                rowsPerPage={10}
                page={page}
                onChangePage={handleChangePage}
            />
        </div>
    )
}

export default (MemberList)
