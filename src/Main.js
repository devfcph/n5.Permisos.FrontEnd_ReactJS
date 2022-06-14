
import React, { useState, useEffect } from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/background.css'
import Header from './components/common/Header';
import PermisoBusiness from './components/Permiso/PermisoBusiness';


function Main() {

    const [header, setHeader] = useState('Administración de Permisos');

    return (
        <div className='bg'>
            <Header
                encabezado={header}
            />
            <PermisoBusiness />
        </div>
    )
}


export default Main;
