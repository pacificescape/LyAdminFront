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

    useEffect(() => console.log('effect'))

    if (props.groupmembers.empty || !props.groupmembers[props.id]) {
        if(!props.isLoading) {
            props.getGroupMembers(props.currentGroup.info.id)
        }
        return <p>Загрузка...</p> // прелоадер
    }

    if (!users.empty) {
        setUsers(() => { grabUsers(); return {empty:true}})
        return <p>Загрузка...</p> // прелоадер
    } // загружается только одна ава


    return (
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell onClick={ () => { props.getUser(993298773) } }>Имя</TableCell>
              <TableCell padding='none' align="center">messages</TableCell>
              <TableCell padding='none' align="center">banan</TableCell>
              <TableCell padding='none' align="center">first</TableCell>
            </TableRow>
          </TableHead>
                <TableBody>
                    {props.groupmembers[props.id].map(member => {
                        debugger;
                        let avatar = ''
                        if (props.users[member.telegram_id] && props.users[member.telegram_id].avatar) {
                            avatar = props.users[member.telegram_id].avatar
                        }
                        return (
                            <TableRow key={member.telegram_id}>
                                <TableCell component="th" scope="row">
                                    <img src={avatar} alt='ava' width="10px"/>
                                    {member.telegram_id}
                                </TableCell>
                                <TableCell align="center">{member.stats.messagesCount}</TableCell>
                                <TableCell align="center">{member.banan.num}</TableCell>
                                <TableCell align="center">{member.createdAt.split('T')[0].split('-').reverse().join('.')}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
        </Table>
      </TableContainer>
    )
}

let mapStateToProps = (state) => {
    return {
      users: state.App.users
    }
  }

export default connect(mapStateToProps)(MemberList)
