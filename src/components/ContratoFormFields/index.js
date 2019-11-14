import React from 'react';
import { Form, Dropdown } from 'semantic-ui-react';
import { text } from '../../services/locales';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function ContratoFormFields({values, 
                             setField,
                             tipoContratoOptions,
                             pessoasJuridicasOptions,
                             pessoasFisicasOptions,
                             handleHabilita,
                             selectLocalizacao}) {
   
    return (
        <>
            <Form.Group widths='equal'>
                <div className="field required">
                    <label>{text("contrato.numero-contrato")}</label>
                    <InputText
                        name="numero"
                        autoComplete={"off"}
                        value={values.numero}
                        onChange={(e) => setField('numero', e.target.value)}
                        onBlur={() => handleHabilita(values)}
                    />
                </div>

                <div className="field required">
                    <label>{text("contrato.tipo-contrato")}</label>
                    <Dropdown
                        placeholder="Escolha uma opção"
                        options={tipoContratoOptions}
                        selection
                        search
                        onChange={(e, { value }) => setField("tipoContrato", value)}
                        onBlur={() => handleHabilita(values)}
                        value={values.tipoContrato}
                        name="tipoContrato"
                    />
                </div>  
            </Form.Group>

            <Form.Group widths='equal'>
                <div className="field required">
                    <label>{text("contrato.contratante")}</label>
                    <Dropdown
                        options={pessoasJuridicasOptions}
                        selection
                        search
                        fluid
                        value={values.contratante}
                        onBlur={() => handleHabilita(values)}
                        onChange={(e, { value }) => {
                            setField("contratante", value);
                        }}
                        name="contratante"
                    />
                </div>

                <div className="field required">
                    <label>{text("contrato.contratado")}</label>
                    <Dropdown
                        options={pessoasJuridicasOptions}
                        selection
                        search
                        fluid
                        value={values.contratado}
                        onBlur={() => handleHabilita(values)}
                        onChange={(e, { value }) => {
                            setField("contratado", value);
                            selectLocalizacao(value);
                        }}
                        name="contratado"
                    />
                </div>
            </Form.Group>

            <Form.Group widths='equal'>

                <div className="field required">
                    <label>{text("contrato.contato-interno")}</label>
                    <Dropdown
                        options={pessoasFisicasOptions}
                        selection
                        search
                        fluid
                        value={values.contatoInterno}
                        onBlur={() => handleHabilita(values)}
                        onChange={(e, { value }) => {
                            setField("contatoInterno", value);
                        }}
                        name="contatoInterno"
                    />
                </div>

                <div className="field required">
                    <label>{text("contrato.contato-cliente")}</label>
                    <Dropdown
                        options={pessoasFisicasOptions}
                        selection
                        search
                        fluid
                        value={values.contatoCliente}
                        onBlur={() => handleHabilita(values)}
                        onChange={(e, { value }) => {
                            setField("contatoCliente", value);
                        }}
                        name="contatoCliente"
                    />
                </div>
            </Form.Group>
        </>
    )
}

export default ContratoFormFields;