import React, { Component } from 'react';
import api from '../../services/api';
import { text } from '../../services/locales';
import { Link } from 'react-router-dom';

import { InputText } from 'primereact/inputtext';
import { Formik } from "formik";

import { Header, Placeholder, Grid, Button, Icon, Form, Message, Divider } from 'semantic-ui-react'

export default class Profile extends Component {

    state = {
        item: null,
        error: null,
        sucesses: null,
        submitting: false
    };

    async componentDidMount() {
        const response = await api.get("/autenticacao/usuario/perfil");
        this.setState({ item: response.data });
    }

    render() {

        const { item, submitting } = this.state;

        return (
            <>
                <Grid stackable columns={2} >
                    <Grid.Column>
                        <Header as="h1"> {text("perfil.titulo")}</Header>
                    </Grid.Column>
                    <Grid.Column textAlign="right">

                        <Button
                            floated='right'
                            icon labelPosition='right'
                            size='large'
                            as={Link}
                            to="/login"
                        >
                            <Icon name='log out' />  {text("perfil.sair")}
                        </Button>
                    </Grid.Column>
                </Grid>

                <br />

                {item &&
                    <>
                        <b>{text("perfil.login")}:</b>&nbsp;{item.login} <br />

                        <b>{text("perfil.perfis")}:</b>&nbsp;
                        {item.perfis.map((p, i, arr) =>
                            <>{p.nome + " (" + p.codigo + ")" + ((arr.length - 1 === i) ? '' : ', ')}</>
                        )}<br />

                        <br />

                        <b>{text("perfil.nome")}:</b>&nbsp;{item.pessoa.nome} <br />
                        <b>{text("perfil.dataNacimento")}:</b>&nbsp;{item.pessoa.dataNascimentoFormatada} <br />

                        <br />

                        <b>{text("perfil.endereco")}:</b>&nbsp;{item.pessoa.endereco.enderecoFormatado}. <br />

                        <b>{text("perfil.telefones")}:</b>&nbsp;
                        {item.pessoa.telefones.map((p, i, arr) =>
                            <>{p.numero + ((arr.length - 1 === i) ? '' : ', ')}</>
                        )}<br />

                        <b>{text("perfil.emails")}:</b>&nbsp;
                        {item.pessoa.emails.map((p, i, arr) =>
                            <>{p.email + ((arr.length - 1 === i) ? '' : ', ')}</>
                        )}

                    </>
                }

                {!item &&
                    <>
                        <Placeholder>
                            <Placeholder.Line />
                            <Placeholder.Line />
                            <br />
                            <Placeholder.Line />
                            <Placeholder.Line />
                            <br />
                            <Placeholder.Line />
                            <Placeholder.Line />
                            <Placeholder.Line />
                        </Placeholder>
                    </>
                }
                <br />
                <Divider />

                <Header as="h1"> {text("perfil.alterar-senha")}</Header>

                {item &&
                    <div style={{ maxWidth: 600 }}>
                        {this.state.error && <Message negative>{this.state.error}</Message>}
                        {this.state.sucesses && <Message positive>{this.state.sucesses}</Message>}

                        <Formik
                            initialValues={{
                                senhaAtual: '',
                                senhaNova: '',
                                senhaNova2: ''
                            }}
                            enableReinitialize={true}
                            onSubmit={(values, { resetForm }) => {
                                this.setState({ error: null, submitting: true, sucesses: null });


                                api.put('/autenticacao/usuario/senha',
                                    {
                                        "senhaAtual": values.senhaAtual,
                                        "senhaNova": values.senhaNova,
                                        "senhaNova2": values.senhaNova2
                                    }
                                )
                                    .then((response) => {
                                        if (response.data.error != null) {
                                            this.setState({ submitting: false, error: response.data  });
                                        } else {
                                            resetForm()
                                            this.setState({ submitting: false, error: null, sucesses: text("perfil.senha-alterada") });
                                        }
                                    })
                                    .catch((error) => {
                                        var mensagemErro = text("formularios.erro");
                                        if (error.response && error.response.data ) {
                                            mensagemErro = error.response.data ;
                                        } else if (error.request) {
                                            mensagemErro = text("formularios.erro_request")
                                        }
                                        this.setState({
                                            submitting: false,
                                            error: mensagemErro
                                        });
                                    });
                            }
                            }
                            render={({
                                values,
                                handleChange,
                                handleBlur,
                                handleSubmit
                            }) => (
                                    <Form
                                        onSubmit={handleSubmit}
                                        submitting={submitting}
                                    >

                                        <div className="field required">
                                            <label>{text("perfil.senha-atual")}</label>
                                            <InputText
                                                type='password'
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.senhaAtual}
                                                name="senhaAtual"
                                            />
                                        </div>

                                        <div className="field required">
                                            <label>{text("perfil.senha-nova")}</label>
                                            <InputText
                                                type='password'
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.senhaNova}
                                                name="senhaNova"
                                            />
                                            <small>{text("usuario.senha-descricao")}</small>
                                        </div>

                                        <div className="field required">
                                            <label>{text("perfil.senha-nova2")}</label>
                                            <InputText
                                                type='password'
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.senhaNova2}
                                                name="senhaNova2"
                                            />
                                        </div>

                                        <Button
                                            primary
                                            loading={submitting}
                                            type='submit'
                                            floated='right'
                                            icon labelPosition='right'
                                            size="huge"
                                            disabled={submitting}
                                        >
                                            <Icon name='save' /> {text("formularios.atualizar")}
                                        </Button>

                                    </Form>
                                )}
                        />
                    </div>
                }


                {
                    !item &&
                    <>
                        <Placeholder>
                            <Placeholder.Line />
                            <Placeholder.Line />
                            <br />
                            <Placeholder.Line />
                            <Placeholder.Line />
                            <br />
                            <Placeholder.Line />
                            <Placeholder.Line />
                            <Placeholder.Line />
                        </Placeholder>
                    </>
                }

            </>

        );
    }

}