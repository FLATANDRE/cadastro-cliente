import React, { Component } from 'react';

import { Button, Icon, Header, Table, Message, Grid } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import api from '../../../../services/api';
import { text, html } from '../../../../services/locales';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default class Tabela extends Component {

    state = {
        itens: [],
        busca: null,
        loading: true,
        error: null,
        sucesses: null,
        pageNumber: 0,
        totalPages: 0,
        totalElements: 0,
        numberOfElements: 0,
        lastPage: true,
        firstPage: true,
        sort: "dataHora",
        sortDirection: 'descending'
    }

    componentDidMount() {
        this.loadItens();

        if (this.props.location.state != null) {
            this.setState({ sucesses: this.props.location.state.sucesses })
        }
    }

    loadItens = async (page = 0, busca = null) => {
        this.setState({ loading: true, error: null, sucesses: null });

        let url = '/autenticacao/historico?size=50&page=' + page;
        if (busca != null) {
            url += '&q=' + busca
        }

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
        const { pageNumber } = this.state
        this.loadItens(pageNumber);
    }

    handleSearch = e => {
        e.preventDefault();
        const { busca } = this.state;
        this.loadItens(0, busca);
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
                        <Header as="h1">{text("historico-login.titulo-tabela")}</Header>
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                        <Button icon size='large' onClick={this.handleRefresh} loading={loading}>
                            <Icon name='refresh' />
                        </Button>
                    </Grid.Column>
                </Grid>


                {this.state.error && <Message negative>{this.state.error}</Message>}
                {this.state.sucesses && <Message clo positive>{this.state.sucesses}</Message>}

                <Table celled striped selectable sortable >
                    <Table.Header>
                        <Table.Row>

                            <Table.HeaderCell
                                sorted={sort === 'usuario.login' ? sortDirection : null}
                                onClick={this.handleSort('usuario.login')}
                            >
                                {text("historico-login.usuario")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={sort === 'dataHora' ? sortDirection : null}
                                onClick={this.handleSort('dataHora')}
                            >
                                {text("historico-login.data")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={sort === 'metodo' ? sortDirection : null}
                                onClick={this.handleSort('metodo')}
                            >{text("historico-login.metodo")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={sort === 'ip' ? sortDirection : null}
                                onClick={this.handleSort('ip')}
                            >{text("historico-login.ip")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={sort === 'navegador' ? sortDirection : null}
                                onClick={this.handleSort('navegador')}
                            >{text("historico-login.navegador")}</Table.HeaderCell>

                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {

                            itens.map((item) =>
                                <Table.Row key={item.id}>
                                    <Table.Cell>
                                        <Link to={'/gerencia/usuario/' + item.usuario.id}>
                                            {item.usuario.login}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>{item.dataHoraFormatada}</Table.Cell>
                                    <Table.Cell>{item.metodo}</Table.Cell>
                                    <Table.Cell>{item.ip}</Table.Cell>
                                    <Table.Cell>{item.navegador}</Table.Cell>
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