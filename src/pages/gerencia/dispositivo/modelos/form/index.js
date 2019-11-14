import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Header, Divider, Icon, Message, Dropdown } from 'semantic-ui-react';
import { Formik } from "formik";
import api from '../../../../../services/api';
import { text } from '../../../../../services/locales';
import { Link, Redirect } from 'react-router-dom';
// import * as actions from '../../../../../store/actions';
//Reactprime
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/components/chips/Chips.css';
import { addModeloDispositivo, editModeloDispositivo } from '../../../../../store/actionCreators/modelosDispositivosAction';

class ModeloDispositivoForm extends Component {

    state = {
        modeloDispositivo: null,
        fabricanteOptions: null,
        carregandoForm: false,
        disabled: true,
        habilitado: false,
        autocompletepessoa: [],
        perfis: [],
        editarSenha: true,
        id: this.props.match.params.id
    };

    async componentDidMount() {
        this.setState({ loading: true });

        if (this.state.id) {
            const response = await api.get("/dispositivos/modelos/" + this.props.match.params.id);
            this.setState({ modeloDispositivo: response.data });
        }

        const fabricanteResponse = await api.get("/dispositivos/fabricantes?size=999");
        const fabricanteOptions = fabricanteResponse.data.content.map((item) => ({
            key: item.id,
            text: item.nome,
            value: item.id,
        }))
        this.setState({ fabricanteOptions });

        this.setState({ loading: false });
    }

    render() {

        const { id, modeloDispositivo, loading, fabricanteOptions } = this.state;
        const { sucesso, erro } = this.props;

        if (sucesso) {
            return <Redirect to={{
                pathname: '/gerencia/dispositivos-modelos',
                state: { sucesses: sucesso }
            }}
            />
        }

        return (
            <div>
                <Header as="h1">
                    {text('dispositivos_modelos.titulo-form')}
                </Header>

                {erro && <Message negative>{erro}</Message>}

                <Formik
                    initialValues={{
                        nome: modeloDispositivo ? modeloDispositivo.nome : '',
                        fabricante: modeloDispositivo ? modeloDispositivo.fabricante.id : '',
                        tensaoMinimaBateria: modeloDispositivo ? modeloDispositivo.tensaoMinimaBateria : '',
                        tensaoMaximaBateria: modeloDispositivo ? modeloDispositivo.tensaoMaximaBateria : '',
                        intervaloManutencaoObrigatoria: modeloDispositivo ? modeloDispositivo.intervaloManutencaoObrigatoria : 0,
                    }}
                    enableReinitialize={true}
                    onSubmit={async (values, { setErrors, resetForm }) => {
                        const { nome, fabricante, tensaoMinimaBateria, tensaoMaximaBateria, intervaloManutencaoObrigatoria } = values;
                        if (id) {
                            this.props.editModeloDispositivo({
                                nome,
                                fabricante,
                                tensaoMinimaBateria,
                                tensaoMaximaBateria,
                                intervaloManutencaoObrigatoria
                            }, id)
                        } else {
                            this.props.addModeloDispositivo({
                                nome,
                                fabricante,
                                tensaoMinimaBateria,
                                tensaoMaximaBateria,
                                intervaloManutencaoObrigatoria
                            })
                        }
                    }}
                    render={({
                        isSubmitting,
                        errors,
                        setFieldValue,
                        values,
                        handleChange,
                        handleBlur,
                        handleSubmit
                    }) => (
                            <Form
                                onSubmit={handleSubmit}
                                loading={loading}
                            >
                                <Form.Group widths='equal'>
                                    <div className="field required">
                                        <label>{text("dispositivos_modelos.nome")}</label>
                                        <InputText
                                            onChange={e => {
                                                handleChange(e)
                                            }}
                                            onBlur={handleBlur}
                                            value={values.nome}
                                            name="nome"
                                        />
                                    </div>

                                    <div className="field required">
                                        <label>{text("dispositivos_modelos.fabricante")}</label>
                                        <Dropdown
                                            placeholder={text("dispositivos_modelos.fabricante")}
                                            search
                                            selection
                                            options={fabricanteOptions}
                                            onChange={(e, { value }) => {
                                                setFieldValue('fabricante', value)
                                            }}
                                            onBlur={handleBlur}
                                            value={values.fabricante}
                                            name="fabricante"
                                            noResultsMessage={text("geral.nenhum-resultado-encontrado")}
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group widths='equal'>
                                    <div className="field">
                                        <label>{text("dispositivos_modelos.tensaoMinimaBateria")}</label>
                                        <InputText
                                            onChange={e => {
                                                handleChange(e)
                                            }}
                                            keyfilter="pnum"
                                            onBlur={handleBlur}
                                            value={values.tensaoMinimaBateria}
                                            name="tensaoMinimaBateria"
                                        />
                                    </div>
                                    <div className="field">
                                        <label>{text("dispositivos_modelos.tensaoMaximaBateria")}</label>
                                        <InputText
                                            onChange={e => {
                                                handleChange(e)
                                            }}
                                            keyfilter="pnum"
                                            onBlur={handleBlur}
                                            value={values.tensaoMaximaBateria}
                                            name="tensaoMaximaBateria"
                                        />
                                    </div>
                                    <div className="field">
                                        <label>{text("dispositivos_modelos.intervaloManutencaoObrigatoria")}</label>
                                        <InputText
                                            onChange={e => {
                                                handleChange(e)
                                            }}
                                            keyfilter="pnum"
                                            onBlur={handleBlur}
                                            value={values.intervaloManutencaoObrigatoria}
                                            name="intervaloManutencaoObrigatoria"
                                        />
                                        <small>{text("dispositivos_modelos.intervaloManutencaoObrigatoriaDescricao")}</small>
                                    </div>
                                </Form.Group>

                                <br />
                                <Divider />

                                <Button
                                    floated='left'
                                    icon labelPosition='left'
                                    size='large'
                                    as={Link}
                                    to="/gerencia/dispositivos-modelos/"
                                    disabled={this.props.inserindo}
                                >
                                    <Icon name='cancel' /> {text("formularios.cancelar")}
                                </Button>

                                <Button
                                    primary
                                    loading={this.props.inserindo}
                                    type='submit'
                                    floated='right'
                                    icon labelPosition='right'
                                    size="huge"
                                    disabled={this.props.inserindo}
                                >
                                    <Icon name='save' /> {modeloDispositivo ? text("formularios.atualizar") : text("formularios.salvar")}
                                </Button>

                            </Form>
                        )}
                />
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        sucesso: state.modelosDispositivosReducer.sucesso,
        erro: state.modelosDispositivosReducer.erro
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addModeloDispositivo: (modelo) => dispatch(addModeloDispositivo(modelo)),
        editModeloDispositivo: (modelo, id) => dispatch(editModeloDispositivo(modelo, id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModeloDispositivoForm);