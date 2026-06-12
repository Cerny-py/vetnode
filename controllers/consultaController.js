const db = require('../config/db');
const Consulta = require('../models/Consulta');

const listar = (req, res) => {
    db.query('SELECT * FROM consultas', (err, filas) => {
        if (err) {
            res.status(500).json({ error: 'Error al listar consultas' });
            return;
        }
        const consultas = filas.map((fila) => new Consulta(fila.id, fila.nombre, fila.fecha, fila.motivo));
        res.json(consultas);
    });
};

const agregar = (req, res) => {
    const {nombre, fecha, motivo } = req.body;

    if (!nombre || !fecha || !motivo) {
        res.status(400).json({error : 'Todos los campos son obligatorios'});
        return;
    }

    db.query('INSERT INTO consultas (nombre, fecha, motivo) VALUES (?, ?, ?)', [nombre, fecha, motivo], (err, resultado) => {
        if (err) {
            res.status(500).json({ error: 'Error al agregar consulta'});
            return;
        }
        const nueva = new Consulta(resultado.insertId, nombre, fecha, motivo);
        res.status(201).json(nueva);
    });
};

const editar = (req, res) => {
    const { id } = req.params;
    const { nombre, fecha, motivo} = req.body;

    if (!nombre || !fecha || !motivo) {
        res.status(400).json({error: 'Todos los campos son obligatorios'});
        return;
    }

    db.query('UPDATE consultas SET nombre = ?, fecha = ?, motivo = ? WHERE id = ?', [nombre, fecha, motivo, id], (err, resultado) => {
        if (err) {
            res.status(500).json({error: 'Error al editar consulta'});
            return;
        }
        if (resultado.affectedRows === 0) {
            res.status(404).json({error: 'Consulta no encontrada'});
            return;
        }
        res.json(new Consulta(id, nombre, fecha, motivo));
    });
};

const eliminar = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM consultas WHERE id = ?', [id], (err, resultado) => {
        if (err) {
            res.status(500).json({error: 'Error al eliminar consulta'});
            return;
        }
        if (resultado.affectedRows === 0) {
            res.status(404).json({error: 'Consulta no encontrada'});
            return;
        }
        res.json({ mensaje: 'Consulta eliminada correctamente'});
    });
};

module.exports = {listar, agregar, editar, eliminar};
