import React, { Component } from 'react';

import { Header, Grid } from 'semantic-ui-react'

import api from '../../../../services/api';

export default class Item extends Component {

    state = {
        item: null,
        loading: true,
        autoLoading: false,
        numeroContrato: null,
        timestamp: -1
    };

    componentDidMount() {
        this.setState(
            { numeroContrato: this.props.match.params.id }
            , () => { this.loadItens(); }
        );
    }

    loadItens = async () => {
        const { numeroContrato } = this.state;

        if (numeroContrato === null) {
            return;
        }

        this.setState({ loading: true });

        if (numeroContrato) {
            const response = await api.get("/relatorios/contratos/mapas/" + numeroContrato);
            this.setState({ item: response.data, timestamp: new Date().getTime() });
        }
        this.setState({ loading: false });
    }

    render() {

        const { numeroContrato, item } = this.state;


        return (
            <div>
                <Grid columns={2} >
                    <Grid.Column>
                        <Header as="h1">
                            <Header.Content>
                                {item ? item.pessoaJuridica.nome : ""}
                            </Header.Content>
                            <Header.Subheader>
                                {item ? item.pessoaJuridica.endereco.enderecoFormatado : ""}
                            </Header.Subheader>
                        </Header>
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                        <b>Número do contrato:</b> {item ? item.numeroContrato : ""}<br />
                        <b>Data:</b> {item ? item.dataContrato : ""}
                    </Grid.Column>
                </Grid>
                <br /><br />
                <center>
                    <img style={{maxWidth:"100%"}}  alt="" src={"/images/piloto/" + numeroContrato + "_equipos.png"} />
                </center>
            </div >
        );
    }

}