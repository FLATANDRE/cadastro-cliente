import React, { Component } from 'react';

import { Statistic, Divider, Grid, Header } from 'semantic-ui-react'

import api from '../../../../services/api';
import { text } from '../../../../services/locales';

import Interacoes from '../../dispositivos/interacoes';
import Associacao from '../../dispositivos/associacao';
import Localizacao from '../../dispositivos/localizacao';

export default class Item extends Component {

    state = {
        item: null,
        loading: true,
        autoLoading: false,
        mac: null,
        timestamp: -1
    };

    componentDidMount() {
        this.setState(
            {
                mac: this.props.mac
            },
            () => {
                this.loadItens();
            }
        );
    }

    loadItens = async () => {
        const { mac } = this.state;

        if (mac === null) {
            return;
        }

        this.setState({ loading: true });

        if (mac) {
            const response = await api.get("/dispositivos/mac/" + mac);
            this.setState({ item: response.data, timestamp: new Date().getTime() });
        }
        this.setState({ loading: false });
    }

    handleRefresh = () => {
        this.loadItens();
    }

    handleAutoLoading = () => {
        const { autoLoading } = this.state;

        var newAutoLoading = !autoLoading;

        this.setState({ autoLoading: newAutoLoading });

        if (newAutoLoading === true) {
            this.interval = setInterval(() => this.handleRefresh(), 5000);
        } else {
            clearInterval(this.interval);
        }
    }

    render() {

        const { item, timestamp } = this.state;

        return (
            <div>

                <Header as="h1">{item ? (item.tipo.nome) : ""}</Header>

                <Grid stackable columns={2}  >
                    <Grid.Column textAlign='center' width={10}>

                        <Statistic size='small' label={text("relatorio-dispositivos.visto-por-ultimo")} value={item ? (item.estadoAtual.vistoEmFormatado ? item.estadoAtual.vistoEmFormatado : '') : ''} />

                        <Divider />

                        <Statistic size="mini" label={text("relatorio-dispositivos.mac")} value={item ? (item.macFormatado ? item.macFormatado : '-') : '--:--:--:--:--:--'} />

                        <Divider />

                        <Statistic size='mini' label={text("relatorio-dispositivos.tipo")} value={item ? (item.tipo.nome + ' (' + item.tipo.codigo + ')') : '-'} />

                        <Divider />

                        <Statistic size="mini" label={text("relatorio-dispositivos.fabricante")} value={item ? (item.modelo.fabricante.nome) : '-'} />
                        <Statistic size="mini" label={text("relatorio-dispositivos.modelo")} value={item ? (item.modelo.nome) : '-'} />


                    </Grid.Column>

                    <Grid.Column width={6} >

                        <Associacao mac={item ? item.mac : null} timestamp={timestamp} />

                    </Grid.Column>
                </Grid>

                <br /><br />
                <Divider />
                <br />

                <Interacoes mac={item ? item.mac : null} timestamp={timestamp} />

                <br /><br />
                <Divider />
                <br />

                <Localizacao mac={item ? item.mac : null} timestamp={timestamp} />


            </div>
        );
    }

}