const tbody = document.getElementById('cuerpo-tabla');
const plantilla = document.getElementById('plantilla-fila');
const inputId = document.getElementById('consulta-id');
const inputNombre = document.getElementById('input-nombre');
const inputFecha = document.getElementById('input-fecha');
const inputMotivo = document.getElementById('input-motivo');
const tituloForm = document.getElementById('titulo-formulario');
const btnGuardar = document.getElementById('btn-guardar');
const btnCancelar = document.getElementById('btn-cancelar');

const cargarConsultas = async () => {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">Cargando...</td></tr>';
    try {
        const respuesta = await fetch('/api/consultas');
        const consultas = await respuesta.json();

        tbody.innerHTML = '';
        if (consultas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay consultas registradas</td></tr>';
        } else {
            consultas.forEach((consulta) => {
                const fila = crearFila(consulta);
                tbody.appendChild(fila);
            });
        }

    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-danger text-center">Error: ${err.message}</td></tr>`;
    }
};

const crearFila = (consulta) => {
    const clon = plantilla.content.cloneNode(true);

    clon.querySelector('.col-id').textContent = consulta.id;
    clon.querySelector('.col-nombre').textContent = consulta.nombre;
    clon.querySelector('.col-fecha').textContent = consulta.fecha.slice(0, 10);
    clon.querySelector('.col-motivo').textContent = consulta.motivo;

    clon.querySelector('.btn-editar').addEventListener('click', () => {
        prepararEdicion(consulta);
    });

    clon.querySelector('.btn-eliminar').addEventListener('click', () => {
        eliminar(consulta.id);
    });

    return clon;
};

const guardar = async () => {
    const id = inputId.value;
    const nombre = inputNombre.value.trim();
    const fecha = inputFecha.value;
    const motivo = inputMotivo.value.trim();

    if (!nombre || !fecha || !motivo) {
        alert('Todos los campos son obligatorios.');
        return;
    }

    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `/api/consultas/${id}` : '/api/consultas';

    try {
        const respuesta = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, fecha, motivo })
        });

        if (respuesta.ok) {
            limpiarFormulario();
            cargarConsultas();
        } else {
            alert('No se pudo guardar la consulta');
        }

    } catch (err) {
        alert(`Error al guardar: ${err.message}`);
    }
};

const prepararEdicion = (consulta) => {
    inputId.value = consulta.id;
    inputNombre.value = consulta.nombre;
    inputFecha.value = consulta.fecha.slice(0, 10);
    inputMotivo.value = consulta.motivo;
    tituloForm.textContent = 'Editar Consulta';
};

const eliminar = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar esta consulta?')) return;

    try {
        const respuesta = await fetch(`/api/consultas/${id}`, { method: 'DELETE' });

        if (respuesta.ok) {
            cargarConsultas();
        } else {
            alert('No se pudo eliminar la consulta');
        }

    } catch (err) {
        alert(`Error al eliminar: ${err.message}`);
    }
};

const limpiarFormulario = () => {
    inputId.value = '';
    inputNombre.value = '';
    inputFecha.value = '';
    inputMotivo.value = '';
    tituloForm.textContent = 'Agregar Consulta';
};

btnGuardar.addEventListener('click', guardar);
btnCancelar.addEventListener('click', limpiarFormulario);

cargarConsultas();