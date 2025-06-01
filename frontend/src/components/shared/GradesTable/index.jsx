import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const mockGradesData = [
  { subject: 'Matemática', grade: 85, status: 'Aprovado' },
  { subject: 'Português', grade: 78, status: 'Aprovado' },
  { subject: 'História', grade: 92, status: 'Aprovado' },
  { subject: 'Geografia', grade: 88, status: 'Aprovado' },
  { subject: 'Ciências', grade: 95, status: 'Aprovado' }
];

export default function GradesTable() {
  return (
    <Card sx={{width: '100%'}}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Notas do Semestre
        </Typography>
        <TableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Disciplina</TableCell>
                <TableCell align="right">Nota</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockGradesData.map((row) => (
                <TableRow key={row.subject}>
                  <TableCell component="th" scope="row">
                    {row.subject}
                  </TableCell>
                  <TableCell align="right">{row.grade}</TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      color: row.status === 'Aprovado' ? 'success.main' : 'error.main'
                    }}
                  >
                    {row.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}