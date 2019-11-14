import React, { Component } from 'react';

import { Header, Container, Loader } from 'semantic-ui-react'
import api from "../../services/api";
import { text } from '../../services/locales'
import "./styles.css";

export default class Sobre extends Component {

    state = {
        isLoading: false,
        config: null,
        pj: null
    }

    async componentDidMount() {
        this.setState({ isLoading: true });
        const response = await api.get("/config");

        this.setState({ config: response.data, isLoading: false });
    }

    render() {
        const { isLoading, config } = this.state;
        return (

            <div>

                <Container text>
                    <Header as="h1">{text("sobre.titulo")}</Header>
                </Container>

                <Container text fluid>

                    {isLoading &&
                        <Loader active inline='centered' />
                    }

                    <pre>
                        {config ? config.sobre : "..."}
                    </pre>
                    <p>
                        <a href="http://aicare.com.br/" target="_blank" rel="noopener noreferrer">www.aicare.com.br</a>
                    </p>
                </Container>
                <br />
                <Container text>
                    <Header as="h2">{text("sobre.informacoes-legais")}</Header>

                    {config &&
                        <>
                            {text("sobre.versao") + ": " + config.versao}<br />
                            {text("sobre.registrado") + ": " + config.registro + " (" + config.pj.cnpjFormatado + ") "+ config.pj.endereco.enderecoFormatado}<br />
                        </>
                    }

                    <br />

                    <p>
                        <a href="https://br.freepik.com/fotos-gratis/blur-hospital_1135191.htm">{text("sobre.licenca-imagem")}: freepik - br.freepik.com</a>
                    </p>
                </Container>
            </div>
        )
    }
}