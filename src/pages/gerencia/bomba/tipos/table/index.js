import React, { Component, memo } from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Header, Table, Message, Placeholder, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { fetchAllTiposBombas, filterTipoBomba } from '../../../../../store/actionCreators/tiposBombasAction';
import { text, html } from '../../../../../services/locales';

//Primereact

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

class TiposBombasTable extends Component {

    state = {
        busca: null,
        sucesses: null,
        sortDirection: 'ascending',
        sort: '',
    }

    componentDidMount() {
        this.props.fetchAllTiposBombas();
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

        this.props.fetchAllTiposBombas(this.state.busca, this.props.pageNumber, clickedColumn, this.state.sortDirection);
        this.setState({ sucesses: null })
    }

    handleNextPage = () => {
        const { pageNumber, lastPage, busca } = this.props;
        if (lastPage === true) return;

        const novoPageNumber = pageNumber + 1;
        this.props.fetchAllTiposBombas(busca, novoPageNumber);
        this.setState({ sucesses: null })
    }

    handlePreviousPage = () => {
        const { pageNumber, firstPage, busca } = this.props;
        if (firstPage === true) return;

        const novoPageNumber = pageNumber - 1;
        this.props.fetchAllTiposBombas(busca, novoPageNumber);
        this.setState({ sucesses: null })
    }

    handleSearch = e => {
        e.preventDefault();
        const { busca } = this.state;

        this.props.filterTipoBomba(busca);
        this.setState({ sucesses: null })
    }

    render() {

        return (
            <div>
                <Grid stackable columns={2} >
                    <Grid.Column>
                        <Header as="h1">{text('bombas_tipos.titulo')}</Header>
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                                <Button
                                    floated='right'
                                    icon labelPosition='right'
                                    color="green"
                                    size='large'
                                    as={Link}
                                    to="/gerencia/bomba-tipo/"
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
                                {text("bombas_tipos.nome")}</Table.HeaderCell>

                            <Table.HeaderCell collapsing>{text("tabelas.editar")}</Table.HeaderCell>

                        </Table.Row>
                    </Table.Header>

                    <Table.Body>

                        {!this.props.consultando && this.props.listaTiposBombasFiltrada && Array.isArray(this.props.listaTiposBombasFiltrada) &&
                            this.props.listaTiposBombasFiltrada.map((item) =>
                                <Table.Row key={item.id}>
                                    <Table.Cell>{item.nome}</Table.Cell>
                                    <Table.Cell>
                                        <Button icon size='mini' as={Link}
                                            to={"/gerencia/bomba-tipo/" + (item.id)}
                                        > <Icon name='edit' />
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        }

                        {!this.props.consultando &&
                            this.props.listaTiposBombasFiltrada &&
                            Array.isArray(this.props.listaTiposBombasFiltrada) &&
                            this.props.listaTiposBombasFiltrada <= 0 &&
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
                        <Table.Row >
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
        listaTiposBombasFiltrada: state.tiposBombasReducer.listaTiposBombasFiltrada,
        consultando: state.tiposBombasReducer.executando,
        erroConsulta: state.tiposBombasReducer.erro,
        firstPage: state.tiposBombasReducer.firstPage,
        lastPage: state.tiposBombasReducer.lastPage,
        numberOfElements: state.tiposBombasReducer.numberOfElements,
        totalElements: state.tiposBombasReducer.totalElements,
        pageNumber: state.tiposBombasReducer.pageNumber,
        totalPages: state.tiposBombasReducer.totalPages,
        sort: state.tiposBombasReducer.sort,
        sortDirection: state.tiposBombasReducer.sortDirection,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchAllTiposBombas: (busca = '', page = 0, sort = '', sortDirection = 'asc') => dispatch(fetchAllTiposBombas(busca, page, sort, sortDirection)),
        filterTipoBomba: (busca) => dispatch(filterTipoBomba(busca)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(TiposBombasTable));
