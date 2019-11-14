import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Header, Divider, Icon, Message } from 'semantic-ui-react';
import { Formik } from "formik";
import api from '../../../../../services/api';
import { text } from '../../../../../services/locales';
import { Link, Redirect} from 'react-router-dom';
// import * as actions from '../../../../../store/actions';
//Reactprime
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/components/chips/Chips.css';
import { addFabricanteDispositivo, editFabricanteDispositivo } from '../../../../../store/actionCreators/fabricantesDispositivosAction';

class FabricanteDispositivoForm extends Component {

    state = {
        fabricantesDispositivos: null,
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
            const response = await api.get("/dispositivos/fabricantes/" + this.props.match.params.id);
            this.setState({ fabricantesDispositivos: response.data });
        }

        this.setState({ loading: false });
    }

    render() {

        const { id, fabricantesDispositivos, loading } = this.state;
        const { sucesso, erro } = this.props;

        if (sucesso) {
            return <Redirect to={{
                pathname: '/gerencia/dispositivos-fabricantes',
                state: { sucesses: sucesso }
            }}
            />
        }

        return (
            <div>
                <Header as="h1">
                    {text('dispositivos_fabricantes.titulo-form')}
                </Header>

                {erro && <Message negative>{erro}</Message>}

                <Formik
                    initialValues={{
                        nome: fabricantesDispositivos ? fabricantesDispositivos.nome : '',
                    }}
                    enableReinitialize={true}
                    onSubmit={async (values, { setErrors, resetForm }) => {
                        const { nome } = values;
                        if (id) {
                            this.props.editFabricanteDispositivo({
                                nome,
                            }, id)
                        } else {
                            this.props.addFabricanteDispositivo({
                                nome,
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
                                        <label>{text("dispositivos_fabricantes.nome")}</label>
                                        <InputText
                                            onChange={e => {
                                                handleChange(e)
                                            }}
                                            onBlur={handleBlur}
                                            value={values.nome}
                                            name="nome"
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
                                    to="/gerencia/dispositivos-fabricantes/"
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
                                    <Icon name='save' /> {fabricantesDispositivos ? text("formularios.atualizar") : text("formularios.salvar")}
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
        sucesso: state.fabricantesDispositivosReducer.sucesso,
        erro: state.fabricantesDispositivosReducer.erro
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addFabricanteDispositivo: (fabricante) => dispatch(addFabricanteDispositivo(fabricante)),
        editFabricanteDispositivo: (fabricante, id) => dispatch(editFabricanteDispositivo(fabricante, id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FabricanteDispositivoForm);