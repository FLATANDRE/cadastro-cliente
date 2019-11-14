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
import { addTipoBomba, editTipoBomba } from '../../../../../store/actionCreators/tiposBombasAction';

class TipoBombaForm extends Component {

    state = {
        tiposBombas: null,
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
            const response = await api.get("/equipamentos/bombas/tipos/" + this.props.match.params.id);
            this.setState({ tiposBombas: response.data });
        }

        this.setState({ loading: false });
    }

    componentDidUpdate(prevProps){
        if(prevProps.sucessoInsert !== this.props.sucessoInsert && this.props.sucessoInsert){
            this.props.history.push('/gerencia/Bombas-tipos')
        }
    }

    render() {

        const { id, tiposBombas, loading } = this.state;
        const { sucesso, erro } = this.props;

        if (sucesso) {
            return <Redirect to={{
                pathname: '/gerencia/bombas-tipos',
                state: { sucesses: sucesso }
            }}
            />
        }

        return (
            <div>
                <Header as="h1">
                    {text('bombas_tipos.titulo-form')}
                </Header>

                {erro && <Message negative>{erro}</Message>}

                <Formik
                    initialValues={{
                        nome: tiposBombas ? tiposBombas.nome : '',
                    }}
                    enableReinitialize={true}
                    onSubmit={async (values, { setErrors, resetForm }) => {
                        const { nome } = values;
                        if (id) {
                            this.props.editTipoBomba({
                                nome
                            }, id)
                        } else {
                            this.props.addTipoBomba({
                                nome
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
                                        <label>{text("bombas_tipos.nome")}</label>
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
                                    to="/gerencia/bombas-tipos/"
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
                                    <Icon name='save' /> {tiposBombas ? text("formularios.atualizar") : text("formularios.salvar")}
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
        sucesso: state.tiposBombasReducer.sucesso,
        erro: state.tiposBombasReducer.erro
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addTipoBomba: (bomba) => dispatch(addTipoBomba(bomba)),
        editTipoBomba: (bomba, id) => dispatch(editTipoBomba(bomba, id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TipoBombaForm);