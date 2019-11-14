import React, { Component } from 'react';

import { Button, Icon, Table, Grid, Header } from 'semantic-ui-react'

import api from '../../../../services/api';
import { text, html } from '../../../../services/locales';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default class Eventos extends Component {

    state = {
        itens: [],
        loading: true,
        pageNumber: 0,
        totalPages: 0,
        totalElements: 0,
        numberOfElements: 0,
        lastPage: true,
        firstPage: true,
        sort: 'dataHora',
        sortDirection: 'descending',
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

    loadItens = async (page = 0, busca = null) => {

        const { mac } = this.state;

        if (mac === null) {
            return;
        }
       
        this.setState({ loading: true, error: null });

        let url = '/eventos?page=' + page + '&q=' + mac;


        const { sort, sortDirection } = this.state;
        if (sort != null) {
            url += '&sort=' + sort + "," + (sortDirection === 'ascending' ? 'asc' : 'desc')
        }
        api.get(url)
            .then((response) => {
                if (response.data.content != null) {
                    this.setState({
                        loading: false,
                        itens: response.data.content,
                        totalPages: response.data.totalPages,
                        totalElements: response.data.totalElements,
                        lastPage: response.data.last,
                        firstPage: response.data.first,
                        pageNumber: response.data.number,
                        numberOfElements: response.data.numberOfElements
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    loading: false,
                    itens: [],
                    error: text("formularios.erro_request")
                });
            });
    };

    handleRefresh = () => {
        this.loadItens(0, null);
    }

    handleNextPage = () => {
        const { pageNumber, lastPage, busca } = this.state;
        if (lastPage === true) return;

        const novoPageNumber = pageNumber + 1;
        this.loadItens(novoPageNumber, busca);
    }
    handlePreviousPage = () => {
        const { pageNumber, firstPage, busca } = this.state;
        if (firstPage === true) return;

        const novoPageNumber = pageNumber - 1;
        this.loadItens(novoPageNumber, busca);
    }

    handleSort = clickedColumn => () => {
        const { busca, sort, sortDirection } = this.state

        if (clickedColumn === sort) {
            this.setState({
                sortDirection: sortDirection === 'ascending' ? 'descending' : 'ascending',
                sort: clickedColumn
            })
        } else {
            this.setState({
                sortDirection: 'ascending',
                sort: clickedColumn
            })
        }


        this.loadItens(0, busca);
    }

    render() {

        const { itens, totalPages, totalElements, pageNumber, lastPage, firstPage, numberOfElements, sort, sortDirection, loading } = this.state;

        return (
            <div>

                <Grid stackable columns={2} >
                    <Grid.Column>
                        <Header as="h2" > {text("relatorio-dispositivos.eventos")}</Header>
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                        <Button icon size='medium' onClick={this.handleRefresh} loading={loading} >
                            <Icon name='refresh' />
                        </Button>
                    </Grid.Column>
                </Grid>

                <Table celled striped selectable sortable >
                    <Table.Header>
                        <Table.Row>

                            <Table.HeaderCell
                                sorted={sort === 'tipo' ? sortDirection : null}
                                onClick={this.handleSort('tipo')}
                            >{text("relatorio-eventos.tipo")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={sort === 'dado' ? sortDirection : null}
                                onClick={this.handleSort('dado')}
                            >{text("relatorio-eventos.dado")}</Table.HeaderCell>

                            <Table.HeaderCell collapsing
                                sorted={sort === 'dataHora' ? sortDirection : null}
                                onClick={this.handleSort('dataHora')}
                            >{text("relatorio-eventos.dataHora")}</Table.HeaderCell>



                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {

                            itens.map((item) =>
                                <Table.Row key={item.id}>
                                    <Table.Cell >{item.tipo} ({item.descricaoTipo})</Table.Cell>
                                    <Table.Cell >{item.dado ? item.dado : '-'}</Table.Cell>
                                    <Table.Cell singleLine>{item.dataHoraFormatada}</Table.Cell>
                                </Table.Row>
                            )
                        }
                    </Table.Body>
                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell >
                                {html("tabelas.info", { pageElements: numberOfElements, totalElements: totalElements, page: pageNumber + 1, pages: totalPages })}
                            </Table.HeaderCell>
                            <Table.HeaderCell colSpan='3'>
                                <Button
                                    disabled={lastPage}
                                    floated='right'
                                    icon labelPosition='right'
                                    size='medium'
                                    onClick={this.handleNextPage}
                                >
                                    <Icon name='angle right' />  {text("tabelas.proxima-pagina")}
                                </Button>
                                <Button
                                    disabled={firstPage}
                                    floated='right'
                                    icon labelPosition='left'
                                    size='medium'
                                    onClick={this.handlePreviousPage}
                                >
                                    <Icon name='angle left' />  {text("tabelas.pagina-anterior")}
                                </Button>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>

                </Table>

            </div>
        );
    }

}