
import React, { Component, memo } from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Header, Table, Message, Form, Placeholder, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { text, html } from '../../../../services/locales';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { fetchAllContrato, filterContrato } from '../../../../store/actionCreators/contratoAction';

class ContratoTable extends Component {

    state = {
        busca: null,
        sucesses: null,
        sortDirection: 'ascending',
        sort: '',
    }

    componentDidMount() {
        this.props.fetchAllContrato();
         
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

        this.props.fetchAllContrato(this.state.busca, this.props.pageNumber, clickedColumn, this.state.sortDirection);
        this.setState({ sucesses: null })
    }

    handleNextPage = () => {
        const { pageNumber, lastPage, busca } = this.props;
        if (lastPage === true) return;

        const novoPageNumber = pageNumber + 1;
        this.props.fetchAllContrato(busca, novoPageNumber);
        this.setState({ sucesses: null })
    }

    handlePreviousPage = () => {
        const { pageNumber, firstPage, busca } = this.props;
        if (firstPage === true) return;

        const novoPageNumber = pageNumber - 1;
        this.props.fetchAllContrato(busca, novoPageNumber);
        this.setState({ sucesses: null })
    }

    handleSearch = e => {
        e.preventDefault();
        const { busca } = this.state;

        this.props.filterContrato(busca);
        this.setState({ sucesses: null })
    }

    render() {
        return (
            <div>
                <Grid stackable columns={2} >
                    <Grid.Column>
                        <Header as="h1">{text('contrato.titulo-table')}</Header>
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                        <Form size='large' className="form">
                            <Form.Group widths='equal'>
                                <Form.Input
                                    fluid icon='search'
                                    iconPosition='left'
                                    name="busca"
                                    placeholder={text('contrato.buscar')}
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
                                    to="/gerencia/contrato/"
                                >
                                    <Icon name='plus' />  {text("tabelas.novo")}
                                </Button>
                            </Form.Group>
                        </Form>
                    </Grid.Column>
                </Grid>

                {this.props.erroConsulta && <Message negative>{this.props.erroConsulta }</Message>}
                {this.state.sucesses && <Message clo positive>{this.state.sucesses}</Message>}

                <Table celled striped selectable sortable >
                    <Table.Header>
                        <Table.Row>

                            <Table.HeaderCell
                                sorted={this.props.sort === 'numero-contrato' ? this.props.sortDirection : null}
                                onClick={this.handleSort('numero')}
                            >
                                {text("contrato.numero-contrato")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={this.props.sort === 'tipo-contrato' ? this.props.sortDirection : null}
                                onClick={this.handleSort('tipoContrato')}
                            >{text("contrato.tipo-contrato")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={this.props.sort === 'nome-contratado' ? this.props.sortDirection : null}
                                onClick={this.handleSort('contratado.nome')}
                            >{text("contrato.contratado")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={this.props.sort === 'nome-contratante' ? this.props.sortDirection : null}
                                onClick={this.handleSort('contratante.nome')}
                            >{text("contrato.contratante")}</Table.HeaderCell>                            

                            <Table.HeaderCell collapsing>{text("tabelas.editar")}</Table.HeaderCell>

                        </Table.Row>
                    </Table.Header>

                    <Table.Body>

                        {!this.props.consultando && this.props.listaContratosFiltrados && Array.isArray(this.props.listaContratosFiltrados) &&
                            this.props.listaContratosFiltrados.map((item) =>
                                <Table.Row key={item.id}>
                                    <Table.Cell>{item.numero}</Table.Cell>
                                    <Table.Cell>{item.tipoContrato ? item.tipoContrato : text("geral.nao_informado")}</Table.Cell>
                                    <Table.Cell>{item.contratado ? item.contratado.nome + ` (${item.contratado.cnpjFormatado})` : text("geral.nao_informado")}</Table.Cell>
                                    <Table.Cell>{item.contratante ? item.contratante.nome + ` (${item.contratante.cnpjFormatado})`  : text("geral.nao_informado")}</Table.Cell>
                                    
                                    <Table.Cell>
                                        <Button icon size='mini' as={Link}
                                            to={"/gerencia/contrato/" + (item.id)}
                                        > <Icon name='edit' />
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        }

                        {!this.props.consultando &&
                            this.props.listaContratosFiltrados &&
                            Array.isArray(this.props.listaContratosFiltrados) &&
                            this.props.listaContratosFiltrados <= 0 &&
                            <Table.Row >
                                <Table.Cell colSpan="5" style={{ textAlign: "center" }}>
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
                            <Table.HeaderCell colSpan='5'>
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
        listaContratosFiltrados: state.contratoReducer.listaContratosFiltrados,
        consultando: state.contratoReducer.executando,
        erroConsulta: state.contratoReducer.erro,
        firstPage: state.contratoReducer.firstPage,
        lastPage: state.contratoReducer.lastPage,
        numberOfElements: state.contratoReducer.numberOfElements,
        totalElements: state.contratoReducer.totalElements,
        pageNumber: state.contratoReducer.pageNumber,
        totalPages: state.contratoReducer.totalPages,
        sort: state.contratoReducer.sort,
        sortDirection: state.contratoReducer.sortDirection,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchAllContrato: (busca = '', page = 0, sort = '', sortDirection = 'asc') => dispatch(fetchAllContrato(busca, page, sort, sortDirection)),
        filterContrato: (busca) => dispatch(filterContrato(busca)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(ContratoTable));