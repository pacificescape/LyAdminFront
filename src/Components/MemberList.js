import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';

import { connect } from 'react-redux'

const useStyles = makeStyles({
    avatarWrapper: {
        display: 'flex',
        borderCollapse: 'none !important'
    },
    avatar: {
        marginRight: '10px',
        width: '25px',
        height: '25px'
    },
    table: {
      minWidth: 250,
    },
    tebleRow: {
        '&': {
            borderCollapse: 'none'
        }
    }
  });

const renderTable = async (props) => {
    return await Promise.all(props.groupmembers[props.id].map(async member => {
        let user = await props.getUser(member.telegram_id)
        return (
            <TableRow key={member.telegram_id} >
                <TableCell component="th" scope="row">
                    <img img={user.link} alt="ava" />
                    {member.telegram_id}
                </TableCell>
                <TableCell align="center">{member.stats.messagesCount}</TableCell>
                <TableCell align="center">{member.banan.num}</TableCell>
                <TableCell align="center">{member.createdAt.split('T')[0].split('-').reverse().join('.')}</TableCell>
            </TableRow>
        )
    }
    ))
}

function MemberList(props) {
    const classes = useStyles();

    const [users, setUsers] = useState({empty: false})
    const [page, setPage] = React.useState(0)

    if (props.groupmembers.empty || !props.groupmembers[props.id]) {
        if(!props.isLoading.getGroupMembers) {
            props.getGroupMembers(props.id)
        }
        return <p>Загрузка...</p>
    }

    if (!props.users[props.id] && !props.isLoading.getUser) {
        props.getUser(props.groupmembers[props.id], props.id)
        return <p>Загрузка...</p>
    }

    const handleChangePage = (event, newPage) => {
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
                        {props.groupmembers[props.id].map(member => {
                            if (!props.users[props.id] || !props.users[props.id][member.telegram_id]) {
                                return (
                                    <TableRow key={member.telegram_id} className={classes.tableRow}>
                                        <TableCell>
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                            let avatar = ''
                            if (props.users[props.id][member.telegram_id] && props.users[props.id][member.telegram_id].avatar) {
                                avatar = props.users[props.id][member.telegram_id].avatar
                            }
                            return (
                                <TableRow key={member.telegram_id} className={classes.tebleRow}>
                                    <TableCell component="th" scope="row">
                                        <div className={classes.avatarWrapper}>
                                            <Avatar src={`/file/${avatar}`} className={classes.avatar}>{avatar ? null: props.users[props.id][member.telegram_id].first_name[0]}</Avatar>
                                            {props.users[props.id][member.telegram_id].first_name}
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
      users: state.App.users,
      currentGroup: state.App.currentGroup,
      groupmembers: state.App.groupmembers,
    //   id: state.App.currentGroup.info.id,
      isLoading: {
          getUser: state.App.api.getUser,
          getGroupMembers: state.App.api.getGroupMembers
      }
    }
  }

export default connect(mapStateToProps)(MemberList)
