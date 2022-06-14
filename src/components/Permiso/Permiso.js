import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as ReactBootstrap from 'react-bootstrap';
import MUIDataTable from "mui-datatables";
import Select from 'react-select';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { BASE_URL } from '../../env'
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})



function Permiso() {

    const [permisos, setPermisos] = useState([]);
    const [tipoPermisos, setTipoPermisos] = useState([]);
    const [labelButtonAdd, setLabelButtonAdd] = useState('NUEVO REGISTRO');
    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [permisoViewModel, setPermisoViewModel] = useState({
        idPermiso: 0,
        nombreEmpleado: '',
        apellidoEmpleado: '',
        nombreCompletoEmpleado: '',
        fechaPermiso: '',
        idTipoPermiso: 0
    });

    const modelo = {
        idPermiso: 0,
        nombreEmpleado: '',
        apellidoEmpleado: '',
        nombreCompletoEmpleado: '',
        fechaPermiso: '',
        idTipoPermiso: 0
    }

    const showSweetAlert = (success, message) => {
        Toast.fire({
            icon: success ? 'success' : 'error',
            title: message
        })
    }

    const handleChange = e => {
        const { name, value } = e.target;
        setPermisoViewModel(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleChangeSelect = (value) => {
        setPermisoViewModel(prevState => ({
            ...prevState,
            idTipoPermiso: value
        }));
    }

    const abrirCerrarModalInsertar = () => {
        setModalInsertar(!modalInsertar);
    }

    const abrirCerrarModalEditar = () => {
        setModalEditar(!modalEditar);
    }

    const getDataPrmisos = async () => {

        await axios.get(BASE_URL + "Permiso/getAll").then(
            (response) => {
                const data = response.data.data;
                setPermisos(data);
               
            }
        ).catch((error) => {
            //console.log(error);
            showSweetAlert(error.response.data.msg ? error.response.data.success : false, error.response.data.msg ? error.response.data.msg : "¡Verifique la información!");
            //showSweetAlert(false, error.data.response.msg);
        })
    }


    const getTipoPermisosList = async () => {

        await axios.get(BASE_URL + "TipoPermiso/getAll").then(
            (response) => {
                const data = response.data.data;
                setTipoPermisos(data);
            }
        ).catch((error) => {
            //console.log(error);
            showSweetAlert(error.response.data.msg ? error.response.data.success : false, error.response.data.msg ? error.response.data.msg : "¡Verifique la información!");
            //showSweetAlert(false, error.data.response.msg);
        });
    };

    const postPermisoViewModel = async () => {

        await axios.post(BASE_URL + "Permiso/add", permisoViewModel).then(
            (response) => {
                const data = response.data.data;
                getDataPrmisos();
                abrirCerrarModalInsertar();
                showSweetAlert(response.data.success, response.data.msg);
                
                setPermisoViewModel(modelo);
                //showSweetAlert(true, response.data.msg);
            }
        ).catch((error) => {
            //console.log(error);
            
            showSweetAlert(error.response.data.msg ? error.response.data.success : false, error.response.data.msg ? error.response.data.msg : "¡Verifique la información!");
        });
    }


    const putPermisoViewModel = async () => {

        console.log("HARÉ UNA PETICIÓN PUT", permisoViewModel);
        await axios.put(BASE_URL + "Permiso/modify", permisoViewModel).then(
            (response) => {
                const newModel = response.data.data;
                getDataPrmisos();
                abrirCerrarModalEditar();
                showSweetAlert(response.data.success, response.data.msg);
                
                setPermisoViewModel(modelo);
            }
        ).catch((error) => {
            //console.log(error);
            showSweetAlert(error.response.data.msg ? error.response.data.success : false, error.response.data.msg ? error.response.data.msg : "¡Verifique la información!");
        });
    }


    const seleccionarPermisoRow = (row) => {
        setPermisoViewModel(row);
    }

    const [row, setRow] = useState([]);

    const setJsonPermiso = (fila) => {
        let rowData = {
            idPermiso: fila[0],
            nombreEmpleado: fila[1],
            apellidoEmpleado: fila[2],
            nombreCompletoEmpleado: fila[3],
            fechaPermiso: fila[4].split('T')[0],
            idTipoPermiso: fila[6]
        };
        setRow(rowData);
        setPermisoViewModel(rowData);
        abrirCerrarModalEditar();
    }



    const bodyInsertar = (
        <>

            <ReactBootstrap.Row>

                <h5>Información del Empleado</h5>
                <ReactBootstrap.Col className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12'>
                    <ReactBootstrap.FloatingLabel
                        controlId="nombreEmpleado"
                        label="Nombre del Empleado"
                        className="mb-1"
                    >
                        <ReactBootstrap.Form.Control
                            type="text"
                            name="nombreEmpleado"
                            onChange={handleChange}
                        />
                    </ReactBootstrap.FloatingLabel>
                </ReactBootstrap.Col>
                <ReactBootstrap.Col className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12'>
                    <>
                        <ReactBootstrap.FloatingLabel
                            controlId="apellidoEmpleado"
                            label="Apellido del Empleado"
                            className="mb-3"
                        >
                            <ReactBootstrap.Form.Control type="text" name='apellidoEmpleado' onChange={handleChange} />
                        </ReactBootstrap.FloatingLabel>

                    </>
                </ReactBootstrap.Col>

            </ReactBootstrap.Row>

            <ReactBootstrap.Row>
                <h5>Información del Permiso</h5>
                <ReactBootstrap.Col className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12'>
                    <ReactBootstrap.FloatingLabel
                        controlId="idTipoPermiso"
                        className="mb-3"
                    >
                        <TipoPermisoSelect
                            lstTipoPermisos={tipoPermisos}
                            name='idTipoPermiso'
                            esModificado={false}
                            getInputValue={handleChangeSelect}
                        ></TipoPermisoSelect>

                    </ReactBootstrap.FloatingLabel>
                </ReactBootstrap.Col>
                <ReactBootstrap.Col className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12'>
                    <>
                        <ReactBootstrap.FloatingLabel
                            controlId="fechaPermiso"
                            label="Fecha de Permiso"
                            className="mb-3"
                        >
                            <ReactBootstrap.Form.Control type="date" name='fechaPermiso' onChange={handleChange} />
                        </ReactBootstrap.FloatingLabel>

                    </>
                </ReactBootstrap.Col>

            </ReactBootstrap.Row>
        </>


    );

    const bodyInsertarFooter = (
        <>
            <ReactBootstrap.Button variant="primary" onClick={() => postPermisoViewModel()}>Guardar</ReactBootstrap.Button>
            <ReactBootstrap.Button variant="secondary" onClick={() => abrirCerrarModalInsertar()}>
                Cancelar
            </ReactBootstrap.Button>
        </>


    );



    const bodyModificar = (
        <>

            <ReactBootstrap.Row>

                <h5>Información del Empleado</h5>
                <ReactBootstrap.Col className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12'>
                    <ReactBootstrap.FloatingLabel
                        controlId="nombreEmpleado"
                        label="Nombre del Empleado"
                        className="mb-1"
                    >
                        <ReactBootstrap.Form.Control
                            type="text"
                            name="nombreEmpleado"
                            onChange={handleChange}
                            value={permisoViewModel && permisoViewModel.nombreEmpleado}
                        />
                    </ReactBootstrap.FloatingLabel>
                </ReactBootstrap.Col>
                <ReactBootstrap.Col className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12'>
                    <>
                        <ReactBootstrap.FloatingLabel
                            controlId="apellidoEmpleado"
                            label="Apellido del Empleado"
                            className="mb-3"
                        >
                            <ReactBootstrap.Form.Control type="text" name='apellidoEmpleado' onChange={handleChange}
                                value={permisoViewModel && permisoViewModel.apellidoEmpleado}
                            />
                        </ReactBootstrap.FloatingLabel>

                    </>
                </ReactBootstrap.Col>

            </ReactBootstrap.Row>

            <ReactBootstrap.Row>
                <h5>Información del Permiso</h5>
                <ReactBootstrap.Col className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12'>
                    <ReactBootstrap.FloatingLabel
                        controlId="idTipoPermiso"
                        className="mb-3"
                    >
                        <TipoPermisoSelect
                            lstTipoPermisos={tipoPermisos}
                            name='idTipoPermiso'
                            value={permisoViewModel && permisoViewModel.idTipoPermiso}
                            esModificado={true}
                            getInputValue={() => handleChangeSelect(permisoViewModel.idTipoPermiso)}

                        ></TipoPermisoSelect>

                    </ReactBootstrap.FloatingLabel>
                </ReactBootstrap.Col>
                <ReactBootstrap.Col className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12'>
                    <>
                        <ReactBootstrap.FloatingLabel
                            controlId="fechaPermiso"
                            label="Fecha de Permiso"
                            className="mb-3"
                        >
                            <ReactBootstrap.Form.Control type="date" name='fechaPermiso' onChange={handleChange}
                                value={permisoViewModel && permisoViewModel.fechaPermiso}
                            />
                        </ReactBootstrap.FloatingLabel>

                    </>
                </ReactBootstrap.Col>

            </ReactBootstrap.Row>
        </>


    );

    const bodyModificarFooter = (
        <>
            <ReactBootstrap.Button variant="primary" onClick={() => putPermisoViewModel()}>Actualizar</ReactBootstrap.Button>
            <ReactBootstrap.Button variant="secondary" onClick={() => abrirCerrarModalEditar()}>
                Cancelar
            </ReactBootstrap.Button>
        </>


    );


    const buttonGetRowTable = (
        {
            options: {
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <Button variant="contained" data-row={tableMeta.rowData} onClick={(ev) => setJsonPermiso(tableMeta.rowData)}>
                            Modificar
                        </Button>
                    )
                }
            }
        }
    )




    useEffect(() => {
        getDataPrmisos();
        getTipoPermisosList();
    }, []);

    return (
        <div>
            <ReactBootstrap.Card>

                <ButtonAdd
                    label={labelButtonAdd}
                    click={abrirCerrarModalInsertar}
                />
                <ModalAgregar
                    open={modalInsertar}
                    onClose={abrirCerrarModalInsertar}
                    body={bodyInsertar}
                    footer={bodyInsertarFooter}
                >
                </ModalAgregar>

                <ModalEditar
                    open={modalEditar}
                    onClose={abrirCerrarModalEditar}
                    body={bodyModificar}
                    footer={bodyModificarFooter}
                >
                </ModalEditar>
            </ReactBootstrap.Card>
            <Datatable
                listaPermisos={permisos}
                getRowPermisoViewModel={seleccionarPermisoRow}
                opciones={buttonGetRowTable}
            />
        </div>
    )
}


function Datatable({ listaPermisos, getRowPermisoViewModel, opciones }) {
    const columns = [
        {
            name: "idPermiso",
            label: "ID",
            options:
            {
                display: "false"
            }
        },
        {
            name: "nombreEmpleado",
            label: "Empleado",
            options:
            {
                display: "false"
            }
        },
        {
            name: "apellidoEmpleado",
            label: "Empleado",
            options:
            {
                display: "false"
            }
        },
        {
            name: "nombreCompletoEmpleado",
            label: "Empleado"
        },
        {
            name: "fechaPermiso",
            label: "Fecha de Permiso"
        },
        {
            name: "descripcionTipoPermiso",
            label: "Tipo Permiso"
        },
        {
            name: "idTipoPermiso",
            label: "idTipoPermiso",
            options:
            {
                display: "false"
            }
        },
        {
            name: "actions",
            label: "Acciones",
            options: opciones.options
        }
    ];

    const [row, setRow] = useState([]);

    const setJsonPermiso = (row) => {
        let rowData = {
            idPermiso: row[0],
            nombreEmpleado: row[1],
            apellidoEmpleado: row[2],
            nombreCompletoEmpleado: row[3],
            fechaPermiso: row[4].split('T')[0],
            idTipoPermiso: row[6]
        };
        setRow(rowData);
        //getRowPermisoViewModel(row);
    }


    return (
        <>
            <MUIDataTable
                title={"Lista de Permisos"}
                data={listaPermisos}
                columns={columns}
            />
        </>

    )
}

function ButtonAdd({ label, click }) {


    return (
        <div className="d-grid gap-2">
            <ReactBootstrap.Button
                variant="outline-success"
                size='lg'
                onClick={click}
            //</div>onClick={() => abrirCerrarModalInsertar()}
            >
                <h4> {label} </h4>
            </ReactBootstrap.Button>
        </div>

    )
}

function ModalAgregar({ open, onClose, body, footer }) {
    return (
        <>
            <ReactBootstrap.Modal
                show={open}
                onHide={onClose}
                backdrop="static"
                keyboard={false}
            >
                <ReactBootstrap.Modal.Header closeButton>
                    <ReactBootstrap.Modal.Title>Agregra nuevo permiso</ReactBootstrap.Modal.Title>
                </ReactBootstrap.Modal.Header>
                <ReactBootstrap.Modal.Body>
                    {body}
                </ReactBootstrap.Modal.Body>
                <ReactBootstrap.Modal.Footer>
                    {/* <ReactBootstrap.Button variant="primary">Guardar</ReactBootstrap.Button>
                    <ReactBootstrap.Button variant="secondary" onClick={onClose}>
                        Close
                    </ReactBootstrap.Button> */}
                    {footer}
                </ReactBootstrap.Modal.Footer>
            </ReactBootstrap.Modal>
        </>
    );
}

function ModalEditar({ open, onClose, body, footer }) {
    return (
        <>
            <ReactBootstrap.Modal
                show={open}
                onHide={onClose}
                backdrop="static"
                keyboard={false}
            >
                <ReactBootstrap.Modal.Header closeButton>
                    <ReactBootstrap.Modal.Title>Modificar permiso</ReactBootstrap.Modal.Title>
                </ReactBootstrap.Modal.Header>
                <ReactBootstrap.Modal.Body>
                    {body}
                </ReactBootstrap.Modal.Body>
                <ReactBootstrap.Modal.Footer>
                    {/* <ReactBootstrap.Button variant="primary">Guardar</ReactBootstrap.Button>
                    <ReactBootstrap.Button variant="secondary" onClick={onClose}>
                        Close
                    </ReactBootstrap.Button> */}
                    {footer}
                </ReactBootstrap.Modal.Footer>
            </ReactBootstrap.Modal>
        </>
    );
}

function TipoPermisoSelect({ lstTipoPermisos, getInputValue, esModificado }) {
    const [selectedOption, setSelectedOption] = useState("none");
    const handleTypeSelect = e => {
        setSelectedOption(e.value);
        console.log("Desde selct: ", selectedOption);
    };

    return (
        <div>
            <Select
                options={lstTipoPermisos.map(key => ({
                    label: key.descripcion, value: key.idTipoPermiso
                }))}
                defaultValue={{ label: 'Seleccione un elemento', value: 'empty' }}
                onChange={(ev) => getInputValue(ev.value)}
            />
        </div>
    )
}



export default Permiso