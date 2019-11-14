import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Header, Divider, Icon, Message } from 'semantic-ui-react';
import { Formik } from "formik";
import api from '../../../../../services/api';
import { text } from '../../../../../services/locales';
import { Link, Redirect} from 'react-router-dom';

//Reactprime
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/components/chips/Chips.css';
import { addFabricanteEquipamento, editFabricanteEquipamento } from '../../../../../store/actionCreators/fabricantesEquipamentosAction';

class FabricanteEquipamentoForm extends Component {

    state = {
        fabricantesEquipamentos: null,
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
            const response = await api.get("/equipamentos/fabricantes/" + this.props.match.params.id);
            this.setState({ fabricantesEquipamentos: response.data });
        }

        this.setState({ loading: false });
    }

    render() {

        const { id, fabricantesEquipamentos, loading } = this.state;
        const { sucesso, erro } = this.props;

        if (sucesso) {
            return <Redirect to={{
                pathname: '/gerencia/equipamentos-fabricantes',
                state: { sucesses: sucesso }
            }}
            />
        }

        return (
            <div>
                <Header as="h1">
                    {text('equipamentos_fabricantes.titulo-form')}
                </Header>

                {erro && <Message negative>{erro}</Message>}

                <Formik
                    initialValues={{
                        nome: fabricantesEquipamentos ? fabricantesEquipamentos.nome : '',
                    }}
                    enableReinitialize={true}
                    onSubmit={async (values, { setErrors, resetForm }) => {
                        const { nome } = values;
                        if (id) {
                            this.props.editFabricanteEquipamento({
                                nome,
                            }, id)
                        } else {
                            this.props.addFabricanteEquipamento({
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
                                        <label>{text("equipamentos_fabricantes.nome")}</label>
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
                                    to="/gerencia/equipamentos-fabricantes/"
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
                                    <Icon name='save' /> {fabricantesEquipamentos ? text("formularios.atualizar") : text("formularios.salvar")}
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
        sucesso: state.fabricantesEquipamentosReducer.sucesso,
        erro: state.fabricantesEquipamentosReducer.erro
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addFabricanteEquipamento: (fabricante) => dispatch(addFabricanteEquipamento(fabricante)),
        editFabricanteEquipamento: (fabricante, id) => dispatch(editFabricanteEquipamento(fabricante, id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FabricanteEquipamentoForm);