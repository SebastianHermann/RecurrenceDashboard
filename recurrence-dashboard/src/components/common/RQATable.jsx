import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import * as RPS from '../../actions/RPActions';
import { Button } from '@mui/material';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function RQATable(props) {
  const dispatch = useDispatch();
  const { rps, selectedRP } = useSelector((state) => state.RecurrenceAnalysis);

  const handleReload = () => {
    dispatch(RPS.GetRPSInfo({ project_id: props.project._id.$oid }));
  };

  return (
    <TableContainer
      style={{ background: 'white', height: '26.5vh', marginTop: '12px' }}
    >
      <Table size="small" aria-label="a dense table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>RP Title</TableCell>
            <TableCell
              align="right"
              style={{ fontSize: 12, padding: '8px 4px' }}
            >
              RR
            </TableCell>
            <TableCell
              align="right"
              style={{ fontSize: 12, padding: '8px 4px' }}
            >
              DET
            </TableCell>
            <TableCell
              align="right"
              style={{ fontSize: 12, padding: '8px 4px' }}
            >
              LAM
            </TableCell>
            <TableCell
              align="right"
              style={{ fontSize: 12, padding: '8px 4px' }}
            >
              LL
            </TableCell>
            <TableCell
              align="right"
              style={{ fontSize: 12, padding: '8px 4px' }}
            >
              TT
            </TableCell>
            <TableCell
              align="right"
              style={{ fontSize: 12, padding: '8px 4px' }}
            >
              ENTR
            </TableCell>
            <TableCell
              align="right"
              style={{ fontSize: 12, padding: '8px 12px 8px 4px' }}
            >
              ENTR-V
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody style={{ maxHeight: '40vh' }}>
          {rps.length ? (
            rps.map((row) => (
              <TableRow
                key={row._id.$oid}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row" style={{ fontSize: 12 }}>
                  {row.rp_title}
                </TableCell>
                {!_.isEmpty(row.rqa) ? (
                  <>
                    <TableCell
                      align="right"
                      style={{ fontSize: 12, padding: '8px 4px' }}
                    >
                      {row.rqa.rr.toFixed(4)}
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{ fontSize: 12, padding: '8px 4px' }}
                    >
                      {row.rqa.det.toFixed(4)}
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{ fontSize: 12, padding: '8px 4px' }}
                    >
                      {row.rqa.lam.toFixed(4)}
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{ fontSize: 12, padding: '8px 4px' }}
                    >
                      {row.rqa.ll.toFixed(4)}
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{ fontSize: 12, padding: '8px 4px' }}
                    >
                      {row.rqa.tt.toFixed(4)}
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{ fontSize: 12, padding: '8px 4px' }}
                    >
                      {row.rqa.entr.toFixed(4)}
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{ fontSize: 12, padding: '8px 12px 4px 4px' }}
                    >
                      {row.rqa['entr-v'].toFixed(4)}
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell
                      align="right"
                      style={{ fontSize: 12, padding: '8px 12px 4px 4px' }}
                    >
                      Calculating...
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{ fontSize: 12, padding: '8px 12px 4px 4px' }}
                    >
                      <Button size="small" onClick={handleReload}>
                        Reload
                      </Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))
          ) : (
            <></>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
