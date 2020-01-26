import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { connect } from 'react-redux'

const useStyles = makeStyles({
    '&' : {
        borderRadius: 0
    },
    table: {
      minWidth: 250,
    },
  });

const renderTable = async (props) => {
    return await Promise.all(props.groupmembers[props.id].map(async member => {
        let user = await props.getUser(member.telegram_id)
        return (
            <TableRow key={member.telegram_id}>
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

    const grabUsers = () => {
        return Promise.all(props.groupmembers[props.currentGroup.info.id].map( async (user) => {
            return await props.getUser(user.telegram_id, props.currentGroup.info.id)
        }))
    }

    useEffect(() => {

    })

    if (props.groupmembers.empty || !props.groupmembers[props.id]) {
        if(!props.groupmembers[props.id]) {
            props.getGroupMembers(props.currentGroup.info.id)
        }
        return <p>Загрузка...</p> // прелоадер
    }

    if (!users.empty) {
        setUsers(() => { grabUsers(); return {empty:true}})
        return <p>Загрузка...</p> // прелоадер
    } // загружается только одна ава


    return (
        <div>
            <span>В чате {props.groupmembers[props.id].length} <span role="img" aria-label="banan">😊</span></span>
            <p></p>
            <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell onClick={() => { props.getUser(993298773) }}><span role="img" aria-label="banan">😊</span></TableCell>
                            <TableCell padding='none' align="center"><span role="img" aria-label="banan">✉️</span></TableCell>
                            <TableCell padding='none' align="center"><span role="img" aria-label="banan">🍌</span></TableCell>
                            <TableCell padding='none' align="center"><span role="img" aria-label="banan">🎂</span></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.groupmembers[props.id].map(member => {
                            debugger;
                            let avatar = ''
                            if (props.users[member.telegram_id] && props.users[member.telegram_id].avatar) {
                                avatar = props.users[member.telegram_id].avatar
                            }
                            if (!props.users[member.telegram_id]) {
                                return (
                                    <TableRow key=''>
                                        <TableCell>
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                            return (
                                <TableRow key={member.telegram_id}>
                                    <TableCell component="th" scope="row">
                                        <img src={avatar} alt='ava' width="10px" />
                                        {props.users[member.telegram_id].first_name}
                                    </TableCell>
                                    <TableCell align="center">{member.stats.messagesCount}</TableCell>
                                    <TableCell align="center">{member.banan.num}</TableCell>
                                    <TableCell align="center">{new Date(member.createdAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
    </div>
    )
}

let mapStateToProps = (state) => {
    return {
      users: state.App.users,
      currentGroup: state.App.currentGroup,
      groupmembers: state.App.groupmembers,
      id: state.App.currentGroup.info.id
    }
  }

export default connect(mapStateToProps)(MemberList)