import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Header, Divider, Icon, Message } from 'semantic-ui-react';
import { Formik } from "formik";
import api from '../../../../../services/api';
import { text } from '../../../../../services/locales';
import { Link, Redirect} from 'react-router-dom';
// import * as actions from '../../../../../store/actions';
//Reactprime
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/components/chips/Chips.css';
import { addTipoDispositivo, editTipoDispositivo } from '../../../../../store/actionCreators/tiposDispositivosAction';

class TipoDispositivoForm extends Component {

    state = {
        tiposDispositivos: null,
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
            const response = await api.get("/dispositivos/tipos/" + this.props.match.params.id);
            this.setState({ tiposDispositivos: response.data });
        }

        this.setState({ loading: false });
    }

    render() {

        const { id, tiposDispositivos, loading } = this.state;
        const { sucesso, erro } = this.props;

        if (sucesso) {
            return <Redirect to={{
                pathname: '/gerencia/dispositivos-tipos',
                state: { sucesses: sucesso }
            }}
            />
        }

        return (
            <div>
                <Header as="h1">
                    {text('dispositivos_tipos.titulo-form')}
                </Header>

                {erro && <Message negative>{erro}</Message>}

                <Formik
                    initialValues={{
                        nome: tiposDispositivos ? tiposDispositivos.nome : '',
                        codigo: tiposDispositivos ? tiposDispositivos.codigo : '',
                        associavelEquipamento: tiposDispositivos ? tiposDispositivos.associavelEquipamento : false,
                        associavelLocalizacao: tiposDispositivos ? tiposDispositivos.associavelLocalizacao : false,
                    }}
                    enableReinitialize={true}
                    onSubmit={async (values, { setErrors, resetForm }) => {
                        const { nome, codigo, associavelEquipamento, associavelLocalizacao } = values;
                        if (id) {
                            this.props.editTipoDispositivo({
                                nome,
                                codigo,
                                associavelEquipamento,
                                associavelLocalizacao,
                            }, id)
                        } else {
                            this.props.addTipoDispositivo({
                                nome,
                                codigo,
                                associavelEquipamento,
                                associavelLocalizacao,
                            })
                        }
                    }}
                    render={({
                        isSubmitting,
                        errors,
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
                                    <div className="field">
                                        <label>{text("dispositivos_tipos.nome")}</label>
                                        <InputText
                                            onChange={e => {
                                                handleChange(e)
                                            }}
                                            onBlur={handleBlur}
                                            value={values.nome}
                                            name="nome"
                                        />
                                    </div>

                                    <div className="field">
                                        <label>{text("dispositivos_tipos.codigo")}</label>
                                        <InputText
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.codigo}
                                            name="codigo"
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group widths='equal'>
                                    <div className="field">
                                        <label>{text("dispositivos_tipos.associavelEquipamento")}</label>
                                        <InputSwitch
                                            onChange={e => {
                                                handleChange(e)
                                            }}
                                            checked={values.associavelEquipamento}
                                            name="associavelEquipamento"
                                        >
                                        </InputSwitch>
                                    </div>
                                    <div className="field">
                                        <label>{text("dispositivos_tipos.associavelLocalizacao")}</label>
                                        <InputSwitch
                                            onChange={e => {
                                                handleChange(e)
                                            }}
                                            checked={values.associavelLocalizacao}
                                            name="associavelLocalizacao"
                                        >
                                        </InputSwitch>
                                    </div>
                                </Form.Group>

                                <br />
                                <Divider />

                                <Button
                                    floated='left'
                                    icon labelPosition='left'
                                    size='large'
                                    as={Link}
                                    to="/gerencia/dispositivos-tipos/"
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
                                    <Icon name='save' /> {tiposDispositivos ? text("formularios.atualizar") : text("formularios.salvar")}
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
        sucesso: state.tiposDispositivosReducer.sucesso,
        erro: state.tiposDispositivosReducer.erro
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addTipoDispositivo: (usuario) => dispatch(addTipoDispositivo(usuario)),
        editTipoDispositivo: (usuario, id) => dispatch(editTipoDispositivo(usuario, id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TipoDispositivoForm);