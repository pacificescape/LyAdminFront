import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
      minWidth: 250,
    },
  });

export default function MemberList(props) {
    const classes = useStyles();

    if (props.groupmembers.empty) {
        return 'загрузка...'
    }

    return (
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Имя</TableCell>
              <TableCell align="right">messages</TableCell>
              <TableCell align="right">banan</TableCell>
              <TableCell align="right">first</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.groupmembers[props.id].map(member => (
              <TableRow key={member.telegram_id}>
                <TableCell component="th" scope="row">
                  {member.telegram_id}
                </TableCell>
                <TableCell align="right">{member.stats.messagesCount}</TableCell>
                <TableCell align="right">{member.banan.num}</TableCell>
                <TableCell align="right">{Date(member.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
}
