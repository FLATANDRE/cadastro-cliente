import React, { Component } from 'react';

import { Button, Form, Header, Divider, Icon, Message, Dropdown } from 'semantic-ui-react'
import { Formik } from "formik";
import api from '../../../../services/api';
import { text } from '../../../../services/locales';
import { Link, Redirect } from 'react-router-dom'

import {limparCampo} from '../../../../utils/functions';

//Reactprime
import { InputMask } from 'primereact/inputmask';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';


export default class Formulario extends Component {

    state = {
        redirect: false,
        item: null,
        error: null,
        sucesses: null,
        submitting: false,
        loading: true,
        tipos: [],
        tipo: null,
        modelos: [],
        modelo: null
    };

    async componentDidMount() {

        this.setState({ loading: true });

        if (this.props.match.params.id) {
            const { id } = this.props.match.params;
            const response = await api.get("/dispositivos/" + id);
            this.setState({ item: response.data });
        }

        const responseTipos = await api.get("/dispositivos/tipos?size=999");
        const tiposOptions = responseTipos.data.content.map((item) => ({
            key: item.id,
            text: item.nome + " (" + item.codigo + ")",
            value: item.id,
        }))
        const responseModelos = await api.get("/dispositivos/modelos?size=999");
        const modelosOptions = responseModelos.data.content.map((item) => ({
            key: item.id,
            text: item.nome + " (" + item.fabricante.nome + ")",
            value: item.id,
        }))
        this.setState({ tipos: tiposOptions, modelos: modelosOptions });

        this.setState({ loading: false });
    }


    handleChangeDropdown = (e, { name, value }) => this.setState({ [name]: value })


    render() {

        const { item, loading, submitting, tipos, modelos, redirect, sucesses } = this.state;

        if (redirect === true) {
            return <Redirect to={{
                pathname: '/gerencia/dispositivos',
                state: { sucesses: sucesses }
            }}
            />
        }

        return (
            <>
                <Header as="h1">
                    {text("gerencia-dispositivos.titulo-form")}
                </Header>

                {this.state.error && <Message negative>{this.state.error}</Message>}

                <Formik
                    initialValues={{
                        mac: item ? item.mac : '',
                        modelo: item ? item.modelo : '',
                        tipo: item ? item.tipo : '',
                        nameSpace: item ? item.nameSpace : '',
                        versaoHardware: item ? item.versaoHardware : '',
                        versaoFirmware: item ? item.versaoFirmware : '',
                        operativo: item ? item.operativo : true,
                    }}
                    enableReinitialize={true}
                    onSubmit={(values, { resetForm }) => {
                        this.setState({ error: null, submitting: true, sucesses: null });

                        if (item) {//editando um item
                            api.put('/dispositivos/' + item.id,
                                {
                                    "operativo": values.operativo,
                                    "versaoFirmware": values.versaoFirmware,
                                    "versaoHardware": values.versaoHardware,
                                    "nameSpace": values.nameSpace,
                                    "idTipo": this.state.tipo,
                                    "modelo": this.state.modelo
                                }
                            )
                                .then((response) => {
                                    if (response.data.error != null) {
                                        this.setState({ submitting: false, error: response.data  });
                                    } else {
                                        this.setState({ submitting: false, error: null, sucesses: text("gerencia-dispositivos.atualizado-sucesso"), redirect: true });
                                    }
                                })
                                .catch((error) => {
                                    var mensagemErro = text("formularios.erro");
                                    if (error.response && error.response.data.message) {
                                        mensagemErro = error.response.data.message;
                                    } else if (error.request) {
                                        mensagemErro = text("formularios.erro_request")
                                    }
                                    this.setState({
                                        submitting: false,
                                        error: mensagemErro
                                    });
                                });
                        } else {//novo item
                            api.post('/dispositivos',
                                {
                                    "mac": limparCampo(values.mac),
                                    "operativo": values.operativo,
                                    "versaoFirmware": values.versaoFirmware,
                                    "versaoHardware": values.versaoHardware,
                                    "nameSpace": values.nameSpace,
                                    "idTipo": this.state.tipo,
                                    "modelo": this.state.modelo
                                }
                            )
                                .then((response) => {
                                    if (response.data.error != null) {
                                        this.setState({ submitting: false, error: response.data  });
                                    } else {
                                        resetForm()
                                        this.setState({ submitting: false, error: null, sucesses: text("gerencia-dispositivos.criado-sucesso"), redirect: true });
                                    }
                                })
                                .catch((error) => {
                                    var mensagemErro = text("formularios.erro");
                                    if (error.response && error.response.data.message) {
                                        mensagemErro = error.response.data.message;
                                    } else if (error.request) {
                                        mensagemErro = text("formularios.erro_request")
                                    }
                                    this.setState({
                                        submitting: false,
                                        error: mensagemErro
                                    });
                                });
                        }
                    }}
                    render={({
                        values,
                        handleChange,
                        handleBlur,
                        handleSubmit
                    }) => (
                            <Form
                                onSubmit={handleSubmit}
                                loading={loading}
                                submitting={submitting}
                            >

                                <Form.Group widths='equal'>
                                    <div className={item ? "field" : "field  required"}>
                                        <label>{text("gerencia-dispositivos.mac")}</label>
                                        <InputMask
                                            mask="**:**:**:**:**:**"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.mac}
                                            disabled={item}
                                            name="mac"
                                        />
                                    </div>

                                    <div className="field">
                                        <label>{text("gerencia-dispositivos.operativo")}</label>
                                        <InputSwitch
                                            onChange={handleChange}
                                            checked={values.operativo}
                                            name="operativo"
                                        />
                                    </div>

                                </Form.Group>

                                <Form.Group widths='equal'>

                                    <div className="field">
                                        <label>{text("gerencia-dispositivos.tipo")}</label>
                                        <Dropdown
                                            placeholder={text("gerencia-dispositivos.tipo")}
                                            search
                                            selection
                                            options={tipos}
                                            onChange={this.handleChangeDropdown}
                                            onBlur={handleBlur}
                                            value={this.state.tipo ? this.state.tipo : values.tipo.id}
                                            name="tipo"
                                            noResultsMessage={text("geral.nenhum-resultado-encontrado")}
                                        />
                                    </div>

                                    <div className="field">
                                        <label>{text("gerencia-dispositivos.modelo")}</label>
                                        <Dropdown
                                            placeholder={text("gerencia-dispositivos.modelo")}
                                            search
                                            selection
                                            options={modelos}
                                            onChange={this.handleChangeDropdown}
                                            onBlur={handleBlur}
                                            value={this.state.modelo ? this.state.modelo : values.modelo.id}
                                            name="modelo"
                                            noResultsMessage={text("geral.nenhum-resultado-encontrado")}
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group widths='equal'>

                                    <div className="field">
                                        <label>{text("gerencia-dispositivos.namespace")}</label>
                                        <InputText
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.nameSpace}
                                            name="nameSpace"
                                        />
                                    </div>

                                    <div className="field">
                                        <label>{text("gerencia-dispositivos.versaohardware")}</label>
                                        <InputText
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.versaoHardware}
                                            name="versaoHardware"
                                        />
                                    </div>

                                    <div className="field">
                                        <label>{text("gerencia-dispositivos.versaofirmware")}</label>
                                        <InputText
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.versaoFirmware}
                                            name="versaoFirmware"
                                        />
                                    </div>
                                </Form.Group>

                                <br />
                                <Divider />

                                <Button
                                    floated='left'
                                    icon labelPosition='left'
                                    size='large'
                                    as={Link}
                                    to="/gerencia/dispositivos"
                                    disabled={loading}
                                >
                                    <Icon name={item ? 'cancel' : 'angle left'} /> {item ? text("formularios.cancelar") : text("formularios.voltar")}
                                </Button>

                                <Button
                                    primary
                                    loading={submitting}
                                    type='submit'
                                    floated='right'
                                    icon labelPosition='right'
                                    size="huge"
                                    disabled={loading || submitting}
                                >
                                    <Icon name='save' /> {item ? text("formularios.atualizar") : text("formularios.salvar")}
                                </Button>

                            </Form>
                        )}
                />
            </>
        );
    }

}