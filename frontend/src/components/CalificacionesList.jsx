//import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Button } from "@mui/material";

const CalificacionesList = ({ calificaciones }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Alumno</TableCell>
          <TableCell>Asignatura</TableCell>
          <TableCell>Calificación</TableCell>
          <TableCell>Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {calificaciones.map((cal) => (
          <TableRow key={cal.id}>
            <TableCell>{cal.alumno}</TableCell>
            <TableCell>{cal.asignatura}</TableCell>
            <TableCell>{cal.nota}</TableCell>
            <TableCell>
              <Button variant="contained" color="primary">Editar</Button>
              <Button variant="contained" color="secondary">Eliminar</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CalificacionesList;