import React, { Component } from 'react';

import { Button, Icon, Header, Form, Table, Message, Grid, Dropdown } from 'semantic-ui-react'
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
        pageNumber: 0,
        totalPages: 0,
        totalElements: 0,
        numberOfElements: 0,
        lastPage: true,
        firstPage: true,
        pageSize: 10,
        sort: null,
        sortDirection: 'ascending'
    }

    componentDidMount() {
        this.loadItens();
    }

    loadItens = async (page = 0, busca = null) => {
        this.setState({ loading: true, error: null });

        const { sort, sortDirection, pageSize } = this.state;

        let url = '/equipamentos?page=' + page + "&size=" + pageSize;
        if (busca != null) {
            url += '&q=' + busca
        }

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
        const { busca } = this.state
        this.setState({ [name]: value }, () => { this.loadItens(0, busca); });
    }

    handleRefresh = () => {
        const { pageNumber, busca } = this.state
        this.loadItens(pageNumber, busca);
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
                        <Header as="h1">{text("relatorio-equipamentos.equipamentos")}</Header>
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                        <Form size='large' className="form">
                            <Form.Group widths='equal'>
                                <Form.Input
                                    fluid icon='search'
                                    iconPosition='left'
                                    name="busca"
                                    placeholder={text('relatorio-equipamentos.buscar')}
                                    onChange={e => this.setState({ busca: e.target.value })}
                                />
                                <Button color='blue' size='large' onClick={this.handleSearch} >
                                    {text('tabelas.buscar')}
                                </Button>
                                <Button icon size='large' onClick={this.handleRefresh} loading={loading}>
                                    <Icon name='refresh' />
                                </Button>
                            </Form.Group>
                        </Form>
                    </Grid.Column>
                </Grid>

                {this.state.error && <Message negative>{this.state.error}</Message>}

                <Table celled striped selectable sortable >
                    <Table.Header>
                        <Table.Row>

                            <Table.HeaderCell
                                sorted={sort === 'serialNumber' ? sortDirection : null}
                                onClick={this.handleSort('serialNumber')}
                            >
                                {text("relatorio-equipamentos.serial-number")}</Table.HeaderCell>

                            <Table.HeaderCell>{text("relatorio-equipamentos.tipo")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={sort === 'modelo.fabricante.nome' ? sortDirection : null}
                                onClick={this.handleSort('modelo.fabricante.nome')}
                            >{text("relatorio-equipamentos.fabricante")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={sort === 'modelo.nome' ? sortDirection : null}
                                onClick={this.handleSort('modelo.nome')}
                            >{text("relatorio-equipamentos.modelo")}</Table.HeaderCell>

                            <Table.HeaderCell collapsing>{text("relatorio-equipamentos.detalhes")}</Table.HeaderCell>

                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {

                            itens.map((item) =>
                                <Table.Row key={item.id}>
                                    <Table.Cell>
                                        <Link to={'/relatorio/equipamento/' + item.id}>
                                            {item.serialNumber}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>{item.tipoEquipamentoNome}</Table.Cell>
                                    <Table.Cell>{item.modelo.fabricante.nome}</Table.Cell>
                                    <Table.Cell>{item.modelo.nome}</Table.Cell>
                                    <Table.Cell>
                                        <Button icon size='mini' as={Link}
                                            to={"/relatorio/equipamento/" + (item.id)}
                                        > <Icon name='search plus' />
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        }
                    </Table.Body>
                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell  >
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