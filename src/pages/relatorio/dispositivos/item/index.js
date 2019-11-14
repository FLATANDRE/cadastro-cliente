import React, { Component } from 'react';

import { Header, Statistic, Divider, Grid, Button, Icon, Table } from 'semantic-ui-react'

import api from '../../../../services/api';
import { text } from '../../../../services/locales';

import Eventos from '../eventos';
import Interacoes from '../interacoes';
import GraficoTemperatura from '../grafico-temperatura';
import GraficoAcc from '../grafico-acelerometro';
import GraficoBateria from '../grafico-bateria';
import Associacao from '../associacao';
import Localizacao from '../localizacao';

export default class Item extends Component {

    state = {
        item: null,
        loading: true,
        autoLoading: false,
        mac: null,
        timestamp: -1
    };

    componentDidMount() {
        if (this.props.match.params.id) {
            this.setState(
                { mac: this.props.match.params.id }
                , () => { this.loadItens(); }
            );
        }
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

        const { item, loading, autoLoading, timestamp } = this.state;

        return (
            <div>

                <Grid columns={2} >
                    <Grid.Column>
                        <Header as="h1" > {text("relatorio-dispositivos.dispositivo")} {item ? ('(' + item.tipo.nome + ')') : ''}</Header>
                        {text("relatorio-dispositivos.visto-por-ultimo")}: {item ? (item.estadoAtual.vistoEmTempo ? item.estadoAtual.vistoEmTempo + " " + text("relatorio-dispositivos.visto_atras") : '') : ''}
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                        <Button.Group icon>
                            <Button toggle icon active={autoLoading} onClick={this.handleAutoLoading.bind(this)}>
                                <Icon name='lock' />
                            </Button>
                            <Button icon size='large' onClick={this.handleRefresh} loading={loading} disabled={autoLoading}>
                                <Icon name='refresh' />
                            </Button>
                        </Button.Group>
                    </Grid.Column>
                </Grid>
                <br /><br />

                <Grid stackable columns={2}  >
                    <Grid.Column textAlign='center' width={10}>

                        <Statistic size="small" label={text("relatorio-dispositivos.mac")} value={item ? (item.macFormatado ? item.macFormatado : '-') : '--:--:--:--:--:--'} />

                        <Divider />

                        <Statistic size='mini' label={text("relatorio-dispositivos.tipo")} value={item ? (item.tipo.nome + ' (' + item.tipo.codigo + ')') : '-'} />

                        <Divider />

                        <Statistic size="mini" label={text("relatorio-dispositivos.fabricante")} value={item ? (item.modelo.fabricante.nome) : '-'} />
                        <Statistic size="mini" label={text("relatorio-dispositivos.modelo")} value={item ? (item.modelo.nome) : '-'} />

                        <Divider />

                        <Statistic size="mini" label={text("relatorio-dispositivos.namespace")} value={item ? (item.nameSpace ? item.nameSpace : '-') : '-'} />
                        <Statistic size="mini" label={text("relatorio-dispositivos.versaohw")} value={item ? (item.versaoHardware ? item.versaoHardware : '-') : '-'} />
                        <Statistic size="mini" label={text("relatorio-dispositivos.versaosw")} value={item ? (item.versaoFirmware ? item.versaoFirmware : '-') : '-'} />

                        <Divider />

                        <Interacoes mac={item ? item.mac : null} timestamp={timestamp} />
                    </Grid.Column>

                    <Grid.Column width={6} >

                        <Associacao mac={item ? item.mac : null} timestamp={timestamp} />

                        <Header as="h3">{text("relatorio-dispositivos.estado-atual")}</Header>
                        <Table celled striped  >
                            <Table.Body>
                                <Table.Row key='1' >
                                    <Table.Cell>{text("relatorio-dispositivos.visto-por-ultimo")}</Table.Cell>
                                    <Table.Cell>{item ? (item.estadoAtual.vistoEmFormatado ? item.estadoAtual.vistoEmFormatado : '') : ''}</Table.Cell>
                                </Table.Row>
                                <Table.Row key='2'>
                                    <Table.Cell>{text("relatorio-dispositivos.temperatura")}</Table.Cell>
                                    <Table.Cell>{item ? item.estadoAtual.temperatura + "°C" : ""}</Table.Cell>
                                </Table.Row>
                                <Table.Row key='3'>
                                    <Table.Cell>{text("relatorio-dispositivos.acelelometro")}</Table.Cell>
                                    <Table.Cell>{item ? ("x: " + item.estadoAtual.eixoX + ", y: " + item.estadoAtual.eixoY + ", z: " + item.estadoAtual.eixoZ) : ""}</Table.Cell>
                                </Table.Row>
                                <Table.Row key='4'>
                                    <Table.Cell>{text("relatorio-dispositivos.bateria")}</Table.Cell>
                                    <Table.Cell>{item ? (item.porcentagemBateria === -1 ? '-' : (item.porcentagemBateria + "%")) : ""}</Table.Cell>
                                </Table.Row>
                                <Table.Row key='5'>
                                    <Table.Cell>{text("relatorio-dispositivos.tempo-funcionamento")}</Table.Cell>
                                    <Table.Cell>{item ? (item.estadoAtual.workTime) : ""}</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>

                    </Grid.Column>
                </Grid>

                <br /><br />
                <Divider />
                <br />

                <Localizacao mac={item ? item.mac : null} timestamp={timestamp} />

                <GraficoBateria mac={item ? item.mac : null} timestamp={timestamp} />
                <Divider />
                <br /><br />
                <GraficoAcc mac={item ? item.mac : null} timestamp={timestamp} />
                <Divider />
                <br /><br />
                <GraficoTemperatura mac={item ? item.mac : null} timestamp={timestamp} />
                <Divider />
                <br /><br />
                <Eventos mac={item ? item.mac : null} timestamp={timestamp} />

            </div>
        );
    }

}