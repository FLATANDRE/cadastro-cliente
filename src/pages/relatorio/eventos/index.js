import React, { Component } from 'react';

import { Button, Icon, Header, Form, Table, Message, Grid, Dropdown, GridRow } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import api from '../../../services/api';
import { text, html } from '../../../services/locales';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Calendar } from 'primereact/calendar';

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
        sort: 'dataHora',
        sortDirection: 'descending',
        lt: null,
        gt: null
    }

    componentDidMount() {
        this.loadItens();
    }

    loadItens = async (page = 0, busca = null) => {
        this.setState({ loading: true, error: null });

        const { sort, sortDirection, pageSize, lt, gt } = this.state;

        let url = '/eventos?page=' + page + "&size=" + pageSize;
        if (busca != null) {
            url += '&q=' + busca
        }

        if (sort != null) {
            url += '&sort=' + sort + "," + (sortDirection === 'ascending' ? 'asc' : 'desc')
        }

        if (lt != null) {
            url = url + "&lt=" + lt.getTime();
        }

        if (gt != null) {
            url = url + "&gt=" + gt.getTime();
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
                    <GridRow>
                        <Grid.Column>
                            <Header as="h1">{text("relatorio-eventos.eventos")}</Header>
                        </Grid.Column>
                        <Grid.Column textAlign="right">
                            <Form size='large' className="form">
                                <Form.Group widths='equal'>
                                    <Form.Input
                                        fluid icon='search'
                                        iconPosition='left'
                                        name="busca"
                                        placeholder={text('relatorio-eventos.buscar')}
                                        onChange={e => this.setState({ busca: e.target.value })}
                                    />
                                    <Button color='blue' size='large' onClick={this.handleSearch} >
                                        {text('tabelas.buscar')}
                                    </Button>
                                </Form.Group>
                            </Form>
                        </Grid.Column>
                    </GridRow>
                    <GridRow>
                        <Grid.Column ></Grid.Column>
                        <Grid.Column textAlign="right">
                            {text("tabelas.filtros")}:&nbsp;
                <Calendar
                                value={this.state.gt}
                                onChange={(e) => this.setState({ gt: e.value })}
                                name="gt"
                                showTime={true}
                                showSeconds={true}
                                dateFormat="dd/mm/yy"
                                showButtonBar={true}
                                hideOnDateTimeSelect={true}
                                placeholder={text("tabelas.filtro-data-inicial")}
                            ></Calendar>
                            &nbsp;-&nbsp;
                <Calendar
                                value={this.state.lt}
                                onChange={(e) => this.setState({ lt: e.value })}
                                name="lt"
                                showTime={true}
                                showSeconds={true}
                                showButtonBar={true}
                                hideOnDateTimeSelect={true}
                                placeholder={text("tabelas.filtro-data-final")}
                            ></Calendar>
                            &nbsp;
                        <Button icon size='medium' onClick={this.handleRefresh} loading={loading}>
                                <Icon name='refresh' />
                            </Button>
                        </Grid.Column>
                    </GridRow>
                </Grid>
                {this.state.error && <Message negative>{this.state.error}</Message>}

                <Table celled striped selectable sortable >
                    <Table.Header>
                        <Table.Row>

                            <Table.HeaderCell
                                sorted={sort === 'tipo' ? sortDirection : null}
                                onClick={this.handleSort('tipo')}
                            >{text("relatorio-eventos.tipo")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={sort === 'dispositivo.mac' ? sortDirection : null}
                                onClick={this.handleSort('dispositivo.mac')}
                            >
                                {text("relatorio-eventos.mac")}</Table.HeaderCell>

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
                                    <Table.Cell>
                                        <Link to={'/relatorio/dispositivo/' + item.dispositivo.mac}>
                                            {item.dispositivo.macFormatado}
                                        </Link>
                                        &nbsp;({item.dispositivo.tipo.nome})
                                     </Table.Cell>
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