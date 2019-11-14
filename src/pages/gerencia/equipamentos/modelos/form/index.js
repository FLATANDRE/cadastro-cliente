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
import { addModeloEquipamento, editModeloEquipamento } from '../../../../../store/actionCreators/modelosEquipamentosAction';

class ModeloEquipamentoForm extends Component {

    state = {
        modeloEquipamento: null,
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
            const response = await api.get("/equipamentos/modelos/" + this.props.match.params.id);
            this.setState({ modeloEquipamento: response.data });
        }

        const fabricanteResponse = await api.get("/equipamentos/fabricantes?size=999");
        const fabricanteOptions = fabricanteResponse.data.content.map((item) => ({
            key: item.id,
            text: item.nome,
            value: item.id,
        }))
        this.setState({ fabricanteOptions });

        this.setState({ loading: false });
    }

    render() {

        const { id, modeloEquipamento, loading, fabricanteOptions } = this.state;
        const { sucesso, erro } = this.props;

        if (sucesso) {
            return <Redirect to={{
                pathname: '/gerencia/equipamentos-modelos',
                state: { sucesses: sucesso }
            }}
            />
        }

        return (
            <div>
                <Header as="h1">
                    {text('equipamentos_modelos.titulo-form')}
                </Header>

                {erro && <Message negative>{erro}</Message>}

                <Formik
                    initialValues={{
                        nome: modeloEquipamento ? modeloEquipamento.nome : '',
                        fabricante: modeloEquipamento ? modeloEquipamento.fabricante.id : '',
                        tensaoMinimaBateria: modeloEquipamento ? modeloEquipamento.tensaoMinimaBateria : '',
                        tensaoMaximaBateria: modeloEquipamento ? modeloEquipamento.tensaoMaximaBateria : '',
                        intervaloManutencaoObrigatoria: modeloEquipamento ? modeloEquipamento.intervaloManutencaoObrigatoria : 0,
                    }}
                    enableReinitialize={true}
                    onSubmit={async (values, { setErrors, resetForm }) => {
                        const { nome, fabricante, tensaoMinimaBateria, tensaoMaximaBateria, intervaloManutencaoObrigatoria } = values;
                        if (id) {
                            this.props.editModeloEquipamento({
                                nome,
                                fabricante,
                                tensaoMinimaBateria,
                                tensaoMaximaBateria,
                                intervaloManutencaoObrigatoria
                            }, id)
                        } else {
                            this.props.addModeloEquipamento({
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
                                        <label>{text("equipamentos_modelos.nome")}</label>
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
                                        <label>{text("equipamentos_modelos.fabricante")}</label>
                                        <Dropdown
                                            placeholder={text("equipamentos_modelos.fabricante")}
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
                                        <label>{text("equipamentos_modelos.intervaloManutencaoObrigatoria")}</label>
                                        <InputText
                                            onChange={e => {
                                                handleChange(e)
                                            }}
                                            keyfilter="pnum"
                                            onBlur={handleBlur}
                                            value={values.intervaloManutencaoObrigatoria}
                                            name="intervaloManutencaoObrigatoria"
                                        />
                                        <small>{text("equipamentos_modelos.intervaloManutencaoObrigatoriaDescricao")}</small>
                                    </div>
                                </Form.Group>

                                <br />
                                <Divider />

                                <Button
                                    floated='left'
                                    icon labelPosition='left'
                                    size='large'
                                    as={Link}
                                    to="/gerencia/equipamentos-modelos/"
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
                                    <Icon name='save' /> {modeloEquipamento ? text("formularios.atualizar") : text("formularios.salvar")}
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
        sucesso: state.modelosEquipamentosReducer.sucesso,
        erro: state.modelosEquipamentosReducer.erro
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addModeloEquipamento: (modelo) => dispatch(addModeloEquipamento(modelo)),
        editModeloEquipamento: (modelo, id) => dispatch(editModeloEquipamento(modelo, id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModeloEquipamentoForm);