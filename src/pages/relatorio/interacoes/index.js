import React, { Component } from 'react';

import { Button, Icon, Header, Table, Message, Grid, Dropdown } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import api from '../../../services/api';
import { text, html } from '../../../services/locales';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default class Tabela extends Component {

    state = {
        itens: [],
        loading: true,
        error: null,
        pageNumber: 0,
        totalPages: 0,
        totalElements: 0,
        numberOfElements: 0,
        lastPage: true,
        firstPage: true,
        pageSize: 10,
        sort: 'inicio',
        sortDirection: 'descending'
    }

    componentDidMount() {
        this.loadItens();
    }

    loadItens = async (page = 0) => {
        this.setState({ loading: true, error: null });

        const { sort, sortDirection, pageSize } = this.state;

        let url = '/eventos/interacoes?c=1&page=' + page + "&size=" + pageSize;

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

    handleChangeDropdown = (e, { name, value }) => {
        this.setState({ [name]: value }, () => { this.loadItens(0); });
    }

    handleRefresh = () => {
        const { pageNumber } = this.state
        this.loadItens(pageNumber);
    }

    handleNextPage = () => {
        const { pageNumber, lastPage } = this.state;
        if (lastPage === true) return;

        const novoPageNumber = pageNumber + 1;
        this.loadItens(novoPageNumber);
    }
    handlePreviousPage = () => {
        const { pageNumber, firstPage } = this.state;
        if (firstPage === true) return;

        const novoPageNumber = pageNumber - 1;
        this.loadItens(novoPageNumber);
    }

    handleSort = clickedColumn => () => {
        const { sort, sortDirection } = this.state

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


        this.loadItens(0);
    }

    render() {

        const { itens, loading, totalPages, totalElements, pageNumber, lastPage, firstPage, numberOfElements, sort, sortDirection } = this.state;

        const optionsPageSize = [
            { key: 10, text: '10', value: 10 },
            { key: 30, text: '30', value: 30 },
            { key: 50, text: '50', value: 50 },
            { key: 100, text: '100', value: 100 },
        ]

        return (
            <div>
                <Grid stackable columns={2} >
                    <Grid.Column>
                        <Header as="h1">{text("relatorio-interacoes.interacoes")}</Header>
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                        <Button icon size='large' onClick={this.handleRefresh} loading={loading}>
                            <Icon name='refresh' />
                        </Button>
                    </Grid.Column>
                </Grid>
                <br />

                {this.state.error && <Message negative>{this.state.error}</Message>}

                <Table celled striped selectable sortable >
                    <Table.Header>
                        <Table.Row>

                            <Table.HeaderCell
                                sorted={sort === 'dispositivo1.mac' ? sortDirection : null}
                                onClick={this.handleSort('dispositivo1.mac')}
                            >
                                {text("relatorio-interacoes.dispositivo1")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={sort === 'dispositivo2.mac' ? sortDirection : null}
                                onClick={this.handleSort('dispositivo2.mac')}
                            >
                                {text("relatorio-interacoes.dispositivo2")}</Table.HeaderCell>

                            <Table.HeaderCell collapsing
                                sorted={sort === 'inicio' ? sortDirection : null}
                                onClick={this.handleSort('inicio')}
                            >{text("relatorio-interacoes.dataHoraInicio")}</Table.HeaderCell>

                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {
                            itens.map((item) =>
                                <Table.Row key={item.id}>
                                    <Table.Cell>
                                        <Link to={'/relatorio/dispositivo/' + item.dispositivo1.mac}>
                                            {item.dispositivo1.macFormatado}
                                        </Link>
                                        &nbsp;({item.dispositivo1.tipo.nome})
                                     </Table.Cell>
                                    <Table.Cell>
                                        <Link to={'/relatorio/dispositivo/' + item.dispositivo2.mac}>
                                            {item.dispositivo2.macFormatado}
                                        </Link>
                                        &nbsp;({item.dispositivo2.tipo.nome})
                                     </Table.Cell>
                                    <Table.Cell singleLine>{item.inicioFormatado}</Table.Cell>
                                </Table.Row>
                            )
                        }
                    </Table.Body>
                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell >
                                {html("tabelas.info", { pageElements: numberOfElements, totalElements: totalElements, page: pageNumber + 1, pages: totalPages })}
                            </Table.HeaderCell>
                            <Table.HeaderCell colSpan='4'>
                                {text("tabelas.tamanho-pagina")}&nbsp;
                                <Dropdown
                                    compact
                                    selection
                                    value={this.state.pageSize}
                                    options={optionsPageSize}
                                    onChange={this.handleChangeDropdown}
                                    name="pageSize"
                                />
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