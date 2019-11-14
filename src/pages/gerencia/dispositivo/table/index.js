import React, { Component } from 'react';

import { Button, Icon, Header, Form, Table, Message, Grid } from 'semantic-ui-react'
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
        sort: null,
        sortDirection: 'ascending'
    }

    componentDidMount() {
        this.loadItens();
        
        if (this.props.location.state != null) {
            this.setState({ sucesses: this.props.location.state.sucesses })
        }
    }

    loadItens = async (page = 0, busca = null) => {
        this.setState({ loading: true, error: null, sucesses: null });

        let url = '/dispositivos?page=' + page;
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

        const { itens, totalPages, totalElements, pageNumber, lastPage, firstPage, numberOfElements, sort, sortDirection } = this.state;

        return (
            <div>

                <Grid stackable columns={2} >
                    <Grid.Column>
                        <Header as="h1">{text("gerencia-dispositivos.titulo-tabela")}</Header>
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                        <Form size='large' className="form">
                            <Form.Group widths='equal'>
                                <Form.Input
                                    fluid icon='search'
                                    iconPosition='left'
                                    name="busca"
                                    placeholder={text('gerencia-dispositivos.buscar')}
                                    onChange={e => this.setState({ busca: e.target.value })}
                                />
                                <Button color='blue' size='large' onClick={this.handleSearch} >
                                    {text('tabelas.buscar')}
                                </Button>

                                <Button
                                    floated='right'
                                    icon labelPosition='right'
                                    color="green"
                                    size='large'
                                    as={Link}
                                    to="/gerencia/dispositivo/"
                                >
                                    <Icon name='plus' />  {text("tabelas.novo")}
                                </Button>
                            </Form.Group>
                        </Form>
                    </Grid.Column>
                </Grid>


                {this.state.error && <Message negative>{this.state.error}</Message>}
                {this.state.sucesses && <Message clo positive>{this.state.sucesses}</Message>}

                <Table celled striped selectable sortable >
                    <Table.Header>
                        <Table.Row>

                            <Table.HeaderCell
                                sorted={sort === 'mac' ? sortDirection : null}
                                onClick={this.handleSort('mac')}
                            >
                                {text("gerencia-dispositivos.mac")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={sort === 'tipo.nome' ? sortDirection : null}
                                onClick={this.handleSort('tipo.nome')}
                            >{text("gerencia-dispositivos.tipo")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={sort === 'modelo.fabricante.nome' ? sortDirection : null}
                                onClick={this.handleSort('modelo.fabricante.nome')}
                            >{text("gerencia-dispositivos.fabricante")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={sort === 'modelo.nome' ? sortDirection : null}
                                onClick={this.handleSort('modelo.nome')}
                            >{text("gerencia-dispositivos.modelo")}</Table.HeaderCell>

                            <Table.HeaderCell collapsing
                                sorted={sort === 'operativo' ? sortDirection : null}
                                onClick={this.handleSort('operativo')}
                            >{text("gerencia-dispositivos.operativo")}</Table.HeaderCell>

                            <Table.HeaderCell collapsing>{text("tabelas.editar")}</Table.HeaderCell>

                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {

                            itens.map((item) =>
                                <Table.Row key={item.id}>
                                    <Table.Cell>{item.macFormatado}</Table.Cell>
                                    <Table.Cell>{item.tipo.nome}</Table.Cell>
                                    <Table.Cell>{item.modelo.fabricante.nome}</Table.Cell>
                                    <Table.Cell>{item.modelo.nome}</Table.Cell>
                                    <Table.Cell>{item.operativo ? text("geral.sim") : text("geral.nao")}</Table.Cell>
                                    <Table.Cell>
                                        <Button icon size='mini' as={Link}
                                            to={"/gerencia/dispositivo/" + (item.id)}
                                        > <Icon name='edit' />
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        }
                    </Table.Body>
                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell >
                                {html("tabelas.info", { pageElements: numberOfElements, totalElements: totalElements, page: pageNumber + 1, pages: totalPages })}
                            </Table.HeaderCell>
                            <Table.HeaderCell colSpan='5'>
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