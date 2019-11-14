import React, { Component, memo } from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Header, Table, Message, Placeholder, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { fetchAllFabricantesEquipamentos, filterFabricanteEquipamento } from '../../../../../store/actionCreators/fabricantesEquipamentosAction';
import { text, html } from '../../../../../services/locales';

//Primereact

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

class FabricantesEquipamentosTable extends Component {

    state = {
        busca: null,
        sucesses: null,
        sortDirection: 'ascending',
        sort: '',
    }

    componentDidMount() {
        this.props.fetchAllFabricantesEquipamentos();
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

        this.props.fetchAllFabricantesEquipamentos(this.state.busca, this.props.pageNumber, clickedColumn, this.state.sortDirection);
        this.setState({ sucesses: null })
    }

    handleNextPage = () => {
        const { pageNumber, lastPage, busca } = this.props;
        if (lastPage === true) return;

        const novoPageNumber = pageNumber + 1;
        this.props.fetchAllFabricantesEquipamentos(busca, novoPageNumber);
        this.setState({ sucesses: null })
    }

    handlePreviousPage = () => {
        const { pageNumber, firstPage, busca } = this.props;
        if (firstPage === true) return;

        const novoPageNumber = pageNumber - 1;
        this.props.fetchAllFabricantesEquipamentos(busca, novoPageNumber);
        this.setState({ sucesses: null })
    }

    handleSearch = e => {
        e.preventDefault();
        const { busca } = this.state;

        this.props.filterFabricanteEquipamento(busca);
        this.setState({ sucesses: null })
    }

    render() {


        return (
            <div>
                <Grid stackable columns={2} >
                    <Grid.Column>
                        <Header as="h1">{text('equipamentos_fabricantes.titulo')}</Header>
                    </Grid.Column>
                    <Grid.Column>
                        <Button
                            floated='right'
                            icon labelPosition='right'
                            color="green"
                            size='large'
                            as={Link}
                            to="/gerencia/equipamento-fabricante/"
                        >
                            <Icon name='plus' />  {text("tabelas.novo")}
                        </Button>
                    </Grid.Column>
                </Grid>

                {this.props.erroConsulta && <Message negative>{this.props.erroConsulta}</Message>}
                {this.state.sucesses && <Message positive>{this.state.sucesses}</Message>}

                <Table celled striped selectable sortable >
                    <Table.Header>
                        <Table.Row>

                            <Table.HeaderCell
                                sorted={this.state.sort === 'nome' ? this.state.sortDirection : null}
                                onClick={this.handleSort('nome')}
                            >
                                {text("equipamentos_fabricantes.nome")}</Table.HeaderCell>

                            <Table.HeaderCell collapsing>{text("tabelas.editar")}</Table.HeaderCell>

                        </Table.Row>
                    </Table.Header>

                    <Table.Body>

                        {!this.props.consultando && this.props.listaFabricantesEquipamentosFiltrada && Array.isArray(this.props.listaFabricantesEquipamentosFiltrada) &&
                            this.props.listaFabricantesEquipamentosFiltrada.map((item) =>
                                <Table.Row key={item.id}>
                                    <Table.Cell>{item.nome}</Table.Cell>
                                    <Table.Cell>
                                        <Button icon size='mini' as={Link}
                                            to={"/gerencia/equipamento-fabricante/" + (item.id)}
                                        > <Icon name='edit' />
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        }

                        {!this.props.consultando &&
                            this.props.listaFabricantesEquipamentosFiltrada &&
                            Array.isArray(this.props.listaFabricantesEquipamentosFiltrada) &&
                            this.props.listaFabricantesEquipamentosFiltrada <= 0 &&
                            <Table.Row >
                                <Table.Cell colSpan="2" style={{ textAlign: "center" }}>
                                    <b>{text("tabelas.sem-registros")}</b>
                                </Table.Cell>
                            </Table.Row>
                        }

                        {this.props.consultando &&
                            <Table.Row >
                                <Table.Cell colSpan="2">
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
                            <Table.HeaderCell colSpan='2'>
                                {html("tabelas.info", { pageElements: this.props.numberOfElements, totalElements: this.props.totalElements, page: this.props.pageNumber + 1, pages: this.props.totalPages })}
   
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
        listaFabricantesEquipamentosFiltrada: state.fabricantesEquipamentosReducer.listaFabricantesEquipamentosFiltrada,
        consultando: state.fabricantesEquipamentosReducer.executando,
        erroConsulta: state.fabricantesEquipamentosReducer.erro,
        firstPage: state.fabricantesEquipamentosReducer.firstPage,
        lastPage: state.fabricantesEquipamentosReducer.lastPage,
        numberOfElements: state.fabricantesEquipamentosReducer.numberOfElements,
        totalElements: state.fabricantesEquipamentosReducer.totalElements,
        pageNumber: state.fabricantesEquipamentosReducer.pageNumber,
        totalPages: state.fabricantesEquipamentosReducer.totalPages,
        sort: state.fabricantesEquipamentosReducer.sort,
        sortDirection: state.fabricantesEquipamentosReducer.sortDirection,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchAllFabricantesEquipamentos: (busca = '', page = 0, sort = '', sortDirection = 'asc') => dispatch(fetchAllFabricantesEquipamentos(busca, page, sort, sortDirection)),
        filterFabricanteEquipamento: (busca) => dispatch(filterFabricanteEquipamento(busca)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(FabricantesEquipamentosTable));
