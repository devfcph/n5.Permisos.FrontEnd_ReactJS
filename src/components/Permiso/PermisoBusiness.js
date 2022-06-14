import React, { useState, useEffect } from 'react';

import * as ReactBootstrap from 'react-bootstrap';
import Permiso from './Permiso';


function PermisoBusiness() {
    return (
        <>
            <div className='container-fluid'>
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12'>
                        <Permiso />
                    </ReactBootstrap.Col >
                </ReactBootstrap.Row>
            </div>
        </>
    )
}

export default PermisoBusiness