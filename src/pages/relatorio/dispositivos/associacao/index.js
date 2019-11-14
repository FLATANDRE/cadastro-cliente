import React, { Component } from 'react';

import { Table, Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import api from '../../../../services/api';
import { text } from '../../../../services/locales';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default class Associacao extends Component {

    state = {
        item: null,
        loading: false,
        error: null,
        timestamp: -1
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.mac !== null && nextProps.timestamp !== this.state.timestamp) {
            this.setState(
                {
                    mac: nextProps.mac,
                    timestamp: nextProps.timestamp
                },
                () => {
                    this.loadItens();
                }
            );
        }
    }

    loadItens = async () => {

        const { mac } = this.state;

        if (mac === null) {
            return;
        }
       
        this.setState({ loading: true, error: null });

        let url = '/dispositivos/associacao/' + mac;

        api.get(url)
            .then((response) => {
                if (response.data != null) {
                    this.setState({
                        loading: false,
                        item: response.data
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    loading: false,
                    item: null,
                    error: text("formularios.erro_request")
                });
            });
    };


    render() {

        const { item } = this.state;

        return (
            <div>

                {item &&
                    <>
                        <Header as="h3">{text("relatorio-dispositivos.associado_a")}&nbsp;-&nbsp;{item.tipoAssociacaoNome}</Header>
                        {item.tipoAssociacao === "equipamento" &&
                            <>
                                <Table celled striped >
                                    <Table.Body>
                                        <Table.Row key='1' >
                                            <Table.Cell>{text("relatorio-dispositivos.associado")}</Table.Cell>
                                            <Table.Cell>{item.equipamento.tipoEquipamentoNome}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row key='2' >
                                            <Table.Cell>{text("relatorio-dispositivos.serial_number")}</Table.Cell>
                                            <Table.Cell>
                                                <Link to={'/relatorio/equipamento/' + item.equipamento.id}>
                                                    {item.equipamento.serialNumber}
                                                </Link>
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row key='3'>
                                            <Table.Cell>{text("relatorio-dispositivos.associado_em")}</Table.Cell>
                                            <Table.Cell>{item.associacaoFormatada}</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                            </>
                        }

                        {item.tipoAssociacao === "compartimento" &&
                            <>
                                <Table celled striped >
                                    <Table.Body>
                                        <Table.Row key='1' >
                                            <Table.Cell>{text("geral.nome")}</Table.Cell>
                                            <Table.Cell>{item.compartimento.nome}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row key='2'>
                                            <Table.Cell>{text("geral.tipo")}</Table.Cell>
                                            <Table.Cell>{item.compartimento.tipoCompartimento.nome}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row key='3'>
                                            <Table.Cell>{text("geral.descricao")}</Table.Cell>
                                            <Table.Cell>{item.compartimento.descricao}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row key='4'>
                                            <Table.Cell>{text("relatorio-dispositivos.associado_em")}</Table.Cell>
                                            <Table.Cell>{item.associacaoFormatada}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row key='5'>
                                            <Table.Cell>{text("geral.localizacao")}</Table.Cell>
                                            <Table.Cell>{item.compartimento.localizacaoFisica.nome}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row key='6'>
                                            <Table.Cell>{text("geral.endereco")}</Table.Cell>
                                            <Table.Cell>{item.compartimento.localizacaoFisica.endereco.enderecoFormatado}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row key='7'>
                                            <Table.Cell>{text("relatorio-dispositivos.pessoa-juridica")}</Table.Cell>
                                            <Table.Cell>{item.compartimento.localizacaoFisica.pessoaJuridica.nome}</Table.Cell>
                                        </Table.Row>

                                    </Table.Body>
                                </Table>
                            </>
                        }

                        {item.tipoAssociacao === "container" &&
                            <>
                                <Table celled striped >
                                    <Table.Body>
                                        <Table.Row key='1' >
                                            <Table.Cell>{text("geral.nome")}</Table.Cell>
                                            <Table.Cell>{item.container.nome}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row key='2'>
                                            <Table.Cell>{text("geral.tipo")}</Table.Cell>
                                            <Table.Cell>{item.container.tipoContainer.nome}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row key='3'>
                                            <Table.Cell>{text("geral.descricao")}</Table.Cell>
                                            <Table.Cell>{item.container.descricao}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row key='4'>
                                            <Table.Cell>{text("relatorio-dispositivos.compartimento")}</Table.Cell>
                                            <Table.Cell>{item.container.compartimento.nome}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row key='5'>
                                            <Table.Cell>{text("relatorio-dispositivos.associado_em")}</Table.Cell>
                                            <Table.Cell>{item.associacaoFormatada}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row key='6'>
                                            <Table.Cell>{text("geral.localizacao")}</Table.Cell>
                                            <Table.Cell>{item.container.compartimento.localizacaoFisica.nome}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row key='7'>
                                            <Table.Cell>{text("geral.endereco")}</Table.Cell>
                                            <Table.Cell>{item.container.compartimento.localizacaoFisica.endereco.enderecoFormatado}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row key='8'>
                                            <Table.Cell>{text("relatorio-dispositivos.pessoa-juridica")}</Table.Cell>
                                            <Table.Cell>{item.container.compartimento.localizacaoFisica.pessoaJuridica.nome}</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                            </>
                        }

                    </>
                }





            </div>
        );
    }

}