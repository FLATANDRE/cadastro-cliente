import React, { Component } from 'react';

import api from "../../services/api";
import { login, logout, isAuthenticated } from '../../services/auth';
import { Link } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';

import "./styles.css";

import { text } from '../../services/locales'

import LocaleSwitcher from '../../components/LocaleSwitcher'
import Ping from '../../components/Ping';

export default class Login extends Component {

    state = {
        isLoading: false,
        username: "",
        password: "",
        error: "",
        isLoadingConfig: false,
        config: null
    }

    constructor(props) {
        super(props);
        logout();
    }

    async componentDidMount() {
        this.setState({ isLoadingConfig: true });
        const response = await api.get("/config/public");
        this.setState({ config: response.data, isLoadingConfig: false });
    }

    handleSignIn = async e => {
        e.preventDefault();

        const { username, password } = this.state;
        this.setState({
            isLoading: true,
            error: null
        });
        if (!username || !password) {
            this.setState({
                isLoading: false,
                error: text("login.erro_form")
            });
        } else {
            api.post("/login", { username, password })
                .then((response) => {
                    if (response.data.token != null) {
                        login(response.data.token);
                        if (isAuthenticated()) {
                            this.props.history.push("/");
                        } else {
                            this.props.history.push("/login");
                        }
                    } else {
                        this.setState({
                            isLoading: false,
                            error: response.data 
                        });
                    }
                })
                .catch((error) => {
                    var mensagemErro = text("login.erro");
                    if (error.response && error.response.data ) {
                        mensagemErro = error.response.data ;
                    } else if (error.request) {
                        mensagemErro = text("login.erro_request")
                    }
                    this.setState({
                        isLoading: false,
                        error: mensagemErro
                    });
                });
        }
    }

    render() {
        const { isLoading, config, isLoadingConfig } = this.state;
        return (
            <div className="fundo">

                <Grid padded textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h1' color='blue' textAlign='center' block>
                            <Link to='/'>
                                <Image size='mini' src='/images/logo.svg' verticalAlign='middle' /> <span>{process.env.REACT_APP_NAME}</span>
                            </Link>
                        </Header>

                        <Form size='large' className="form">
                            <Segment stacked>

                                {this.state.error && <Message negative>{this.state.error}</Message>}

                                <Form.Input
                                    fluid icon='user'
                                    iconPosition='left'
                                    name="login"
                                    placeholder={text('login.login-placeholder')}
                                    onChange={e => this.setState({ username: e.target.value })}
                                    disabled={isLoadingConfig}
                                />

                                <Form.Input
                                    fluid
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder={text('login.senha')}
                                    name="password"
                                    type='password'
                                    onChange={e => this.setState({ password: e.target.value })}
                                    disabled={isLoadingConfig}
                                />
                                {isLoading ? (
                                    <Button loading color='blue' fluid size='large'>
                                        {text('login.login')}
                                    </Button>
                                ) : (
                                        <Button color='blue' fluid size='large' onClick={this.handleSignIn} disabled={isLoadingConfig}>
                                            {text('login.login')}
                                        </Button>
                                    )}

                            </Segment>
                        </Form>
                        <Header as='h3' color='blue' textAlign='center' block>
                            <Header.Subheader>

                                <Ping /> | <LocaleSwitcher /> <br />

                                &copy; {process.env.REACT_APP_NAME} - {text('login.direitos')}<br />
                                <small>
                                    Artificial Intelligence Care - {process.env.REACT_APP_DESCRIPTION} - {config ? "v" + config.versao : ""}<br />
                                    {text('login.registro')}: {config ? config.registro : ""}<br />
                                    <a href="http://aicare.com.br/" target="_blank" rel="noopener noreferrer">www.aicare.com.br</a>
                                </small>

                            </Header.Subheader>
                        </Header>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}