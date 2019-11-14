import React, { Component } from 'react';

import { Header, Statistic, Divider, Grid, Button, Icon, Table } from 'semantic-ui-react'

import api from '../../../../services/api';
import { text } from '../../../../services/locales';
import { Link } from 'react-router-dom'

import Interacoes from '../../dispositivos/interacoes';
import GraficoTemperatura from '../../dispositivos/grafico-temperatura';
import GraficoAcc from '../../dispositivos/grafico-acelerometro';
import GraficoBateria from '../../dispositivos/grafico-bateria';
import Localizacao from '../../dispositivos/localizacao';
import DetalhesBombaInfusao from '../bomba';

export default class Item extends Component {

    state = {
        item: null,
        loading: true,
        autoLoading: false,
        dispositivoAssociado: null,
        id: null,
        timestamp: -1
    };

    componentDidMount() {
        if (this.props.match.params.id) {
            this.setState(
                { id: this.props.match.params.id }
                , () => { this.loadItens(); }
            );
        }
    }

    loadItens = async () => {
        const { id } = this.state;

        if (id === null) {
            return;
        }

        this.setState({ loading: true });

        if (id) {
            const response = await api.get("/equipamentos/" + id);
            const responseDispositivoAssociado = await api.get("/dispositivos/associacao/equipamento/" + id);
            this.setState({
                item: response.data,
                dispositivoAssociado: responseDispositivoAssociado.data,
                timestamp: new Date().getTime()
            });
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

        const { item, loading, autoLoading, dispositivoAssociado, timestamp } = this.state;

        return (
            <div>

                <Grid columns={2} >
                    <Grid.Column>
                        <Header as="h1" > {item ? (item.tipoEquipamentoNome) : '...'}</Header>
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

                        <Statistic size="small" label={text("relatorio-equipamentos.serial-number")} value={item ? (item.serialNumber) : ''} />


                        {(item && item.tipoEquipamento === 'bomba') &&
                            <>
                                <Divider />
                                <DetalhesBombaInfusao item={item} />
                            </>
                        }

                        <Divider />

                        <Statistic size="mini" label={text("relatorio-equipamentos.fabricante")} value={item ? (item.modelo.fabricante.nome) : '-'} />
                        <Statistic size="mini" label={text("relatorio-equipamentos.modelo")} value={item ? (item.modelo.nome) : '-'} />

                        <Divider />
                        <Statistic size="mini" label={text("relatorio-equipamentos.versaohw")} value={item ? (item.versaoHardware ? item.versaoHardware : '-') : '-'} />
                        <Statistic size="mini" label={text("relatorio-equipamentos.versaosw")} value={item ? (item.versaoSoftware ? item.versaoSoftware : '-') : '-'} />


                    </Grid.Column>

                    <Grid.Column width={6}>

                        {dispositivoAssociado &&
                            <>
                                <Header as="h3">{text("relatorio-equipamentos.dispositivo-associado")}</Header>
                                <Table celled striped  >
                                    <Table.Body>
                                        <Table.Row key='1' >
                                            <Table.Cell>{text("relatorio-dispositivos.mac")}</Table.Cell>
                                            <Table.Cell>
                                                <Link to={'/relatorio/dispositivo/' + dispositivoAssociado.mac}>
                                                    {dispositivoAssociado.macFormatado}
                                                </Link>
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row key='2' >
                                            <Table.Cell>{text("relatorio-dispositivos.tipo")}</Table.Cell>
                                            <Table.Cell>{dispositivoAssociado.tipo.nome + " (" + dispositivoAssociado.tipo.codigo + ")"}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row key='3' >
                                            <Table.Cell>{text("relatorio-dispositivos.visto-por-ultimo")}</Table.Cell>
                                            <Table.Cell>{dispositivoAssociado.estadoAtual.vistoEmFormatado ? dispositivoAssociado.estadoAtual.vistoEmFormatado : ''}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row key='4'>
                                            <Table.Cell>{text("relatorio-dispositivos.temperatura")}</Table.Cell>
                                            <Table.Cell>{dispositivoAssociado.estadoAtual.temperatura + "°C"}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row key='5'>
                                            <Table.Cell>{text("relatorio-dispositivos.acelelometro")}</Table.Cell>
                                            <Table.Cell>{"x: " + dispositivoAssociado.estadoAtual.eixoX + ", y: " + dispositivoAssociado.estadoAtual.eixoY + ", z: " + dispositivoAssociado.estadoAtual.eixoZ}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row key='6'>
                                            <Table.Cell>{text("relatorio-dispositivos.bateria")}</Table.Cell>
                                            <Table.Cell>{dispositivoAssociado.porcentagemBateria === -1 ? '-' : (dispositivoAssociado.porcentagemBateria + "%")}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row key='7'>
                                            <Table.Cell>{text("relatorio-dispositivos.tempo-funcionamento")}</Table.Cell>
                                            <Table.Cell>{dispositivoAssociado.estadoAtual.workTime}</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                            </>
                        }
                    </Grid.Column>
                </Grid>

                {dispositivoAssociado &&
                    <>
                        <br /><br />
                        <Divider />
                        <br />

                        <Localizacao mac={dispositivoAssociado.mac} timestamp={timestamp} />

                        <Interacoes mac={dispositivoAssociado.mac} timestamp={timestamp} />
                        <Divider />
                        <GraficoBateria mac={dispositivoAssociado.mac} timestamp={timestamp}  />
                        <Divider />
                        <br /><br />
                        <GraficoAcc mac={dispositivoAssociado.mac} timestamp={timestamp}  />
                        <Divider />
                        <br /><br />
                        <GraficoTemperatura mac={dispositivoAssociado.mac} timestamp={timestamp}  />
                    </>
                }
            </div>
        );
    }

}