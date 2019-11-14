import React, { Component, memo } from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Header, Table, Message, Placeholder, Form, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { fetchAllNotasFiscaisCompra, filterNotaFiscalCompra } from '../../../store/actionCreators/notasFiscaisCompraAction';
import { text, html } from '../../../services/locales';

//Primereact
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

class NotasFiscaisCompraTable extends Component {

    state = {
        busca: null,
        sucesses: null,
        sortDirection: 'ascending',
        sort: '',
    }

    componentDidMount() {
        this.props.fetchAllNotasFiscaisCompra();

        if (this.props.location.state != null) {
            this.setState({ sucesses: this.props.location.state.sucesses })
        }

        if (this.props.location.state != null) {
            this.setState({ sucesses: this.props.location.state.sucesses })
        }
    }

    handleSort = clickedColumn => () => {
        const { sort, sortDirection } = this.state

        if (clickedColumn === sort) {
            this.setState({
                sortDirection: sortDirection === 'ascending' ? 'descending' : 'ascending',
                sort: clickedColumn
            });
        } else {
            this.setState({
                sortDirection: 'ascending',
                sort: clickedColumn
            });
        }

        this.props.fetchAllNotasFiscaisCompra(this.state.busca, this.props.pageNumber, clickedColumn, this.state.sortDirection);
        this.setState({ sucesses: null })
    }

    handleNextPage = () => {
        const { pageNumber, lastPage, busca } = this.props;
        if (lastPage === true) return;

        const novoPageNumber = pageNumber + 1;
        this.props.fetchAllNotasFiscaisCompra(busca, novoPageNumber);
        this.setState({ sucesses: null })
    }

    handlePreviousPage = () => {
        const { pageNumber, firstPage, busca } = this.props;
        if (firstPage === true) return;

        const novoPageNumber = pageNumber - 1;
        this.props.fetchAllNotasFiscaisCompra(busca, novoPageNumber);
        this.setState({ sucesses: null })
    }

    handleSearch = e => {
        e.preventDefault();
        const { busca } = this.state;

        this.props.filterNotaFiscalCompra(busca);
        this.setState({ sucesses: null })
    }

    render() {
        return (
            <div>
                <Grid stackable columns={2} >
                    <Grid.Column>
                        <Header as="h1">{text('notas-fiscais-compra.titulo')}</Header>
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                         <Form size='large' className="form">
                            <Form.Group widths='equal'>
                                <Form.Input
                                    fluid icon='search'
                                    iconPosition='left'
                                    name="busca"
                                    placeholder={text('notas-fiscais-compra.buscar')}
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
                                    to="/nota-fiscal-compra/"
                                >
                                    <Icon name='plus' />  {text("tabelas.novo")}
                                </Button>
                            </Form.Group>
                        </Form>
                    </Grid.Column>
                </Grid>

                {this.props.erroConsulta && <Message negative>{this.props.erroConsulta}</Message>}
                {this.state.sucesses && <Message clo positive>{this.state.sucesses}</Message>}

                <Table celled striped selectable sortable >
                    <Table.Header>
                        <Table.Row>

                            <Table.HeaderCell
                                sorted={this.state.sort === 'numero' ? (this.state.sortDirection) : null}
                                onClick={this.handleSort('numero')}
                            >
                                {text("notas-fiscais-compra.numero")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={this.state.sort === 'data' ? (this.state.sortDirection) : null}
                                onClick={this.handleSort('data')}
                            >{text("notas-fiscais-compra.data")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={this.state.sort === 'fornecedor' ? (this.state.sortDirection) : null}
                                onClick={this.handleSort('fornecedor')}
                            >{text("notas-fiscais-compra.fornecedor")}</Table.HeaderCell>

                            <Table.HeaderCell collapsing>{text("tabelas.editar")}</Table.HeaderCell>

                        </Table.Row>
                    </Table.Header>

                    <Table.Body>

                        {!this.props.consultando && this.props.listaNotasFiscaisCompraFiltrada && Array.isArray(this.props.listaNotasFiscaisCompraFiltrada) &&
                            this.props.listaNotasFiscaisCompraFiltrada.map((item) =>
                                <Table.Row key={item.id}>
                                    <Table.Cell>{item.numero}</Table.Cell>
                                    <Table.Cell>{item.dataFormatada}</Table.Cell>
                                    <Table.Cell>{item.fornecedor.nome}</Table.Cell>
                                    <Table.Cell>
                                        <Button icon size='mini' as={Link}
                                            to={"/nota-fiscal-compra/" + (item.id)}
                                        > <Icon name='edit' />
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        }

                        {!this.props.consultando &&
                            this.props.listaNotasFiscaisCompraFiltrada &&
                            Array.isArray(this.props.listaNotasFiscaisCompraFiltrada) &&
                            this.props.listaNotasFiscaisCompraFiltrada <= 0 &&
                            <Table.Row >
                                <Table.Cell colSpan="6" style={{ textAlign: "center" }}>
                                    <b>{text("tabelas.sem-registros")}</b>
                                </Table.Cell>
                            </Table.Row>
                        }

                        {this.props.consultando &&
                            <Table.Row >
                                <Table.Cell colSpan="5">
                                    {this.props.consultando &&
                                        <Placeholder fluid>
                                            <Placeholder.Line />
                                            <Placeholder.Line />
                                            <Placeholder.Line />
                                            <Placeholder.Line />
                                            <Placeholder.Line />
                                        </Placeholder>
                                    }
                                </Table.Cell>
                            </Table.Row>
                        }

                    </Table.Body>
                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell >
                                {html("tabelas.info", { pageElements: this.props.numberOfElements, totalElements: this.props.totalElements, page: this.props.pageNumber + 1, pages: this.props.totalPages })}
                            </Table.HeaderCell>
                            <Table.HeaderCell colSpan='6'>
                                <Button
                                    disabled={this.props.lastPage}
                                    floated='right'
                                    icon labelPosition='right'
                                    size='medium'
                                    onClick={this.handleNextPage}
                                >
                                    <Icon name='angle right' />  {text("tabelas.proxima-pagina")}
                                </Button>
                                <Button
                                    disabled={this.props.firstPage}
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

const mapStateToProps = state => {
    return {
        listaNotasFiscaisCompraFiltrada: state.notasFiscaisCompraReducer.listaNotasFiscaisCompraFiltrada,
        consultando: state.notasFiscaisCompraReducer.executando,
        erroConsulta: state.notasFiscaisCompraReducer.erro,
        firstPage: state.notasFiscaisCompraReducer.firstPage,
        lastPage: state.notasFiscaisCompraReducer.lastPage,
        numberOfElements: state.notasFiscaisCompraReducer.numberOfElements,
        totalElements: state.notasFiscaisCompraReducer.totalElements,
        pageNumber: state.notasFiscaisCompraReducer.pageNumber,
        totalPages: state.notasFiscaisCompraReducer.totalPages,
        sort: state.notasFiscaisCompraReducer.sort,
        sortDirection: state.notasFiscaisCompraReducer.sortDirection,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchAllNotasFiscaisCompra: (busca = '', page = 0, sort = '', sortDirection = 'asc') => dispatch(fetchAllNotasFiscaisCompra(busca, page, sort, sortDirection)),
        filterNotaFiscalCompra: (busca) => dispatch(filterNotaFiscalCompra(busca)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(NotasFiscaisCompraTable));
