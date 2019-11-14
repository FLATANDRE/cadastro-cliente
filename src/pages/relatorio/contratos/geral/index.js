import React, { Component } from 'react';

import { Statistic, Divider, Grid, Table, Header, Progress, Icon } from 'semantic-ui-react'

import api from '../../../../services/api';
import { formataDinheiro } from '../../../../utils/functions'

import { Link } from "react-router-dom";

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
            {
                numeroContrato: this.props.contrato
            },
            () => {
                this.loadItens();
            }
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

        const { item, numeroContrato } = this.state;


        return (
            <Grid stackable columns={2}  >
                <Grid.Column textAlign='center' width={10}>

                    <Header as="h2">{item ? (item.modeloEquipamento.nome) : '-'}</Header>
                    <Statistic.Group size="small" widths='two'>
                        <Statistic>
                            <Statistic.Value>{item ? (item.quantidadeEquipamentosContratados) : '-'}</Statistic.Value>
                            <Statistic.Label>Quantidade</Statistic.Label>
                        </Statistic>
                        <Statistic >
                            <Statistic.Value>{item ? (item.quantidadeEquiposContratados) : '-'}</Statistic.Value>
                            <Statistic.Label>Equipos/mês</Statistic.Label>
                        </Statistic>
                    </Statistic.Group>

                    <Divider />
                    {item &&
                        <>
                            <Header as="h2">Plano de ação</Header>
                            <Statistic.Group size="small" color={item.statusColor} widths='three'>
                                <Statistic>
                                    <Statistic.Value>{item.equipos > 0 ? "+" + item.equipos : item.equipos}</Statistic.Value>
                                    <Statistic.Label><Link to={"/relatorio/contrato/" + numeroContrato + "#equipos"}>Equipo</Link></Statistic.Label>
                                </Statistic>
                                <Statistic>
                                    <Statistic.Value><small style={{ fontSize: "20px" }}>R$</small>{formataDinheiro(item.preco)}</Statistic.Value>
                                    <Statistic.Label>Preço</Statistic.Label>
                                </Statistic>
                                <Statistic>
                                    <Statistic.Value>{item.bombas > 0 ? "+" + item.bombas : item.bombas}</Statistic.Value>
                                    <Statistic.Label>Bomba</Statistic.Label>
                                </Statistic>
                            </Statistic.Group>

                            <Divider />

                            <Header as="h2">Status da manutenção</Header>
                            <Statistic.Group size="small" widths='three'>
                                <Statistic>
                                    <Statistic.Value>{item.diasParada}</Statistic.Value>
                                    <Statistic.Label>+ de 5 dias parada</Statistic.Label>
                                </Statistic>
                                <Statistic color={item.obrigatoriaVencida > 0 ? "red" : "black"}>
                                    <Statistic.Value>{item.obrigatoriaVencida}</Statistic.Value>
                                    <Statistic.Label>Obrigatória vencida</Statistic.Label>
                                </Statistic>
                                <Statistic color={item.chamadoAberto > 0 ? "red" : "black"}>
                                    <Statistic.Value>{item.chamadoAberto}</Statistic.Value>
                                    <Statistic.Label>Chamado aberto</Statistic.Label>
                                </Statistic>
                            </Statistic.Group>
                        </>
                    }
                </Grid.Column>

                <Grid.Column width={6} >
                    {item &&
                        <>
                            <Header as="h3">Detalhes do contrato</Header>
                            <Table celled striped  >
                                <Table.Body>
                                    <Table.Row key='1' >
                                        <Table.Cell>Número</Table.Cell>
                                        <Table.Cell>{item.numeroContrato}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row key='2' >
                                        <Table.Cell>Inicio</Table.Cell>
                                        <Table.Cell>{item.dataContrato}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row key='3' >
                                        <Table.Cell>Vencimento</Table.Cell>
                                        <Table.Cell>{item.dataVencimentoContrato}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row key='4'>
                                        <Table.Cell>Performance do ano</Table.Cell>
                                        <Table.Cell><Progress color={item.performanceAno < 100 ? "yellow" : "blue"} percent={item.performanceAno}>{item.performanceAno}%</Progress></Table.Cell>
                                    </Table.Row>
                                    <Table.Row key='5'>
                                        <Table.Cell>Renovação de contrato</Table.Cell>
                                        <Table.Cell>
                                            <Icon name='circle' color={item.statusRenovacaoContrato ? "green" : "orange"} />
                                            {item.statusRenovacaoContrato ? "Sem ação imediata" : "Iniciar negociação"}
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                        </>
                    }
                </Grid.Column>
            </Grid>
        );
    }

}