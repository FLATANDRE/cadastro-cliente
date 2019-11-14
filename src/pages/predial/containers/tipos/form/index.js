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
import { addTipoContainer, editTipoContainer } from '../../../../../store/actionCreators/tiposContainersAction';

class TipoContainerForm extends Component {

    state = {
        container: null,
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
            const response = await api.get("/predial/containers/tipos/" + this.props.match.params.id);
            this.setState({ container: response.data });
        }

        this.setState({ loading: false });
    }

    render() {

        const { id, container, loading } = this.state;
        const { sucesso, erro } = this.props;

        if (sucesso) {
            return <Redirect to={{
                pathname: '/gerencia/containers-tipos',
                state: { sucesses: sucesso }
            }}
            />
        }

        return (
            <div>
                <Header as="h1">
                    {text('containers_tipos.titulo-form')}
                </Header>

                {erro && <Message negative>{erro}</Message>}

                <Formik
                    initialValues={{
                        nome: container ? container.nome : '',
                    }}
                    enableReinitialize={true}
                    onSubmit={async (values, { setErrors, resetForm }) => {
                        const { nome } = values;
                        if (id) {
                            this.props.editTipoContainer({
                                nome,
                            }, id)
                        } else {
                            this.props.addTipoContainer({
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
                                        <label>{text("containers_tipos.nome")}</label>
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
                                    to="/gerencia/containers-tipos/"
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
                                    <Icon name='save' /> {container ? text("formularios.atualizar") : text("formularios.salvar")}
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
        sucesso: state.tiposContainersReducer.sucesso,
        erro: state.tiposContainersReducer.erro
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addTipoContainer: (container) => dispatch(addTipoContainer(container)),
        editTipoContainer: (container, id) => dispatch(editTipoContainer(container, id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TipoContainerForm);