import React from 'react';
import { Form, Dropdown } from 'semantic-ui-react';

function AssociacaoContratoForm({
    contratante,
    contratantesOptions, 
    setContratante,    
    contrato,
    contratosOptions,
    setContrato,
    modelo,
    modelosItensOptions,
    setModelo,
    labelContrato,
    labelContratante,
    labelModelo,
    children}) 
{


    return (
        <>
                {!contratante &&
                    <Form.Group widths='equal'>
                        <div className="field required">
                            <label>{labelContratante}</label>
                            <Dropdown
                                placeholder="Escolha uma opção"
                                options={contratantesOptions}
                                selection
                                search
                                onChange={(e, { value }) => setContratante(value)}
                                name="contratante"
                            />
                        </div>
                    </Form.Group>
                }

                {contratante && 
                    !contrato && 

                    <Form.Group widths='equal'>
                        <div className="field required">
                            <label>{labelContrato}</label>
                            <Dropdown
                                placeholder="Escolha uma opção"
                                options={contratosOptions}
                                selection
                                search
                                onChange={(e, { value }) => setContrato(value)}
                                name="contrato"
                            />
                        </div>
                    </Form.Group>                
                }

                { contratante &&
                    contrato &&
                        !modelo &&

                    <Form.Group widths='equal'>
                        <div className="field required">
                            <label>{labelModelo}</label>
                            <Dropdown
                                placeholder="Escolha uma opção"
                                options={modelosItensOptions}
                                selection
                                search
                                onChange={(e, { value }) => setModelo(value)}
                                name="modelo"
                            />
                        </div>
                    </Form.Group>   
                }

                {children}
        </>
    );

}

export default AssociacaoContratoForm;
