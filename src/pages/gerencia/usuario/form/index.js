import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Header, Divider, Icon, Message, Dropdown } from 'semantic-ui-react';
import { Formik } from "formik";
import api from '../../../../services/api';
import { error_handling } from '../../../../services/api';
import { text } from '../../../../services/locales';
import { Link, Redirect } from 'react-router-dom';

import * as actions from '../../../../store/actions';
//Reactprime
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { addUsuario, editUsuario, obterPerfis, filterUsuario } from '../../../../store/actionCreators/usuarioAction';
import { RESET_STATES_PESSOA } from '../../../../store/actions';
import { fetchAllPessoa, filterPessoa } from '../../../../store/actionCreators/pessoaAction';

class UsuarioForm extends Component {

    state = {
        usuario: null,
        carregandoForm: false,
        disabled: true,
        habilitado: false,
        pessoas: [],
        perfis: [],
        editarSenha: true,
        id: this.props.match.params.id,
        error: null
    };

    async componentDidMount() {

        this.props.resetStates();
        this.setState({ loading: true });
        if (this.state.id) {
            await api.get("/autenticacao/usuario/" + this.props.match.params.id)
                .then((response) => {
                    this.setState({ usuario: response.data, editarSenha: false, loading: false });
                    this.props.obterPerfis();
                }).catch((error) => {
                    this.setState({ usuario: null, error: error_handling(error), loading: false });
                });
        } else {
            const responsePessoas = await api.get("/pessoal/pessoas-fisicas/all");
            const pessoasOptions = responsePessoas.data.map((item) => ({
                key: item.id,
                text: item.nome + " (" + item.cpfFormatado + ")",
                value: item.id,
            }))
            this.setState({ pessoas: pessoasOptions, loading: false });
            this.props.obterPerfis();
        }
    }

    formatPerfis(perfis) {
        let temp = [];
        perfis.forEach((item) => {
            temp.push(item.codigo);
        });
        return temp;
    }

    render() {

        const { id, usuario, loading } = this.state;

        if (this.props.sucessoInsert) {
            return <Redirect to={{
                pathname: '/gerencia/usuarios',
                state: { sucesses: this.props.sucessoInsert }
            }}
            />
        }

        return (
            <div>
                <Header as="h1">
                    {text('usuario.titulo-form')}
                </Header>

                {this.state.error &&
                    <Message negative>
                        {this.state.error}
                    </Message>
                }

                {this.props.erroInsert &&
                    <Message negative>
                        {this.props.erroInsert }
                    </Message>
                }

                {this.props.sucessoInsert &&
                    <Message positive>
                        <p>{this.props.sucessoInsert}</p>
                    </Message>
                }

                {!this.state.error &&
                    <Formik
                        initialValues={{
                            login: usuario ? usuario.login : '',
                            senha: usuario ? usuario.senha : '',
                            pessoaAssociada: usuario ? usuario.pessoa.id : '',
                            perfis: usuario ? this.formatPerfis(usuario.perfis) : [],
                            habilitado: usuario ? usuario.habilitado : false
                        }}
                        enableReinitialize={true}
                        onSubmit={async (values, { setErrors, resetForm }) => {

                            if (id) {
                                this.props.editUsuario({
                                    login: values.login,
                                    senha: this.state.editarSenha ? values.senha : null,
                                    perfis: values.perfis,
                                    habilitado: values.habilitado
                                }, id)
                            } else {
                                this.props.addUsuario({
                                    login: values.login,
                                    senha: values.senha,
                                    perfis: values.perfis,
                                    idPessoa: values.pessoaAssociada
                                })
                            }
                        }}
                        render={({
                            values,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            setFieldValue
                        }) => (
                                <Form
                                    onSubmit={handleSubmit}
                                    loading={loading}
                                >
                                    <Form.Group widths='equal'>
                                        {id &&
                                            <>
                                                <div className="field">
                                                    <label>{text("usuario.habilitado")}</label>
                                                    <InputSwitch
                                                        onChange={e => {
                                                            handleChange(e)
                                                        }}
                                                        checked={values.habilitado}
                                                        name="habilitado"
                                                    >
                                                    </InputSwitch>
                                                </div>

                                            </>
                                        }
                                    </Form.Group>

                                    <Form.Group widths='equal'>

                                        {!id &&
                                            <div className="field required">
                                                <label>{text("usuario.pessoa-associada")}</label>
                                                <Dropdown
                                                    options={this.state.pessoas}
                                                    selection
                                                    search
                                                    onChange={(e, { value }) => setFieldValue("pessoaAssociada", value)}
                                                    name="pessoaAssociada"
                                                />
                                                <small>
                                                    {text("usuario.pessoa-fisica-descricao")}.&nbsp;
                                                <Link
                                                        to={{
                                                            pathname: "/gerencia/pessoal/pessoa-fisica/",
                                                            state: { backTo: '/gerencia/usuario/' }
                                                        }}
                                                    >
                                                        {text("pessoa.botao-criar")}
                                                    </Link>
                                                </small>
                                            </div>
                                        }

                                        {id &&
                                            <>
                                                <div className="field">
                                                    <label>{text("usuario.pessoa-associada")}</label>
                                                    <InputText
                                                        disabled
                                                        value={this.state.usuario ? this.state.usuario.pessoa.nome : ""}
                                                    />
                                                </div>
                                                <div className="field">
                                                    <label>{text("usuario.alterar-senha")}</label>
                                                    <InputSwitch checked={this.state.editarSenha} onChange={(e) => this.setState({ editarSenha: e.value })} />
                                                </div>
                                            </>
                                        }



                                    </Form.Group>

                                    <Form.Group widths='equal'>

                                        <div className="field required">
                                            <label>{text("usuario.login")}</label>
                                            <InputText
                                                onChange={e => {
                                                    handleChange(e)
                                                }}
                                                onBlur={handleBlur}
                                                value={values.login}
                                                disabled={!values.pessoaAssociada}
                                                name="login"
                                            />
                                            <small>{text("usuario.login-descricao")}</small>
                                        </div>

                                        <div className={this.state.editarSenha ? "field required" : "field"}>
                                            <label>{text("usuario.senha")}</label>
                                            <InputText
                                                type='password'
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.senha}
                                                name="senha"
                                                disabled={!this.state.editarSenha || !values.pessoaAssociada}
                                            />
                                            <small>{text("usuario.senha-descricao")}</small>
                                        </div>

                                    </Form.Group>

                                    <Form.Group widths="equal">
                                        <div className="field required">
                                            <label>{text("usuario.perfis")}</label>

                                            <Dropdown
                                                placeholder={text("usuario.perfis-placeholder")}
                                                fluid
                                                multiple
                                                search
                                                selection
                                                options={this.props.perfis}
                                                onChange={(e, { value }) => setFieldValue("perfis", value)}
                                                name="perfis"
                                                disabled={!values.pessoaAssociada}
                                                value={values.perfis}
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
                                        to="/gerencia/usuarios/"
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
                                        <Icon name='save' /> {usuario ? text("formularios.atualizar") : text("formularios.salvar")}
                                    </Button>

                                </Form>
                            )}
                    />
                }
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        listaUsuariosFiltrada: state.usuarioReducer.listaUsuariosFiltrada,
        erroInsert: state.usuarioReducer.erro,
        sucessoInsert: state.usuarioReducer.sucesso,
        inserindo: state.usuarioReducer.executando,
        estados: state.enderecoReducer.listaEstados,
        estado: state.enderecoReducer.estado,
        perfis: state.perfilReducer.perfis,
        listaPessoasFiltrada: state.pessoaReducer.listaPessoasFiltrada,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addUsuario: (usuario) => dispatch(addUsuario(usuario)),
        editUsuario: (usuario, id) => dispatch(editUsuario(usuario, id)),
        resetStates: (pessoa) => dispatch({ type: RESET_STATES_PESSOA }),
        error: (message) => dispatch({ type: actions.ERRO_USUARIOS, payload: message }),
        obterPerfis: () => dispatch(obterPerfis()),
        filterPessoa: (type, busca) => dispatch(filterPessoa(type, busca)),
        filterUsuario: (busca) => dispatch(filterUsuario(busca)),
        fetchAllPessoa: (type, busca) => dispatch(fetchAllPessoa(type, busca))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UsuarioForm);