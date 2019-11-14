import React, { Component, memo } from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Header, Table, Message, Placeholder, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { fetchAllModelosDispositivos, filterModeloDispositivo } from '../../../../../store/actionCreators/modelosDispositivosAction';
import { text, html } from '../../../../../services/locales';

//Primereact

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

class ModelosDispositivosTable extends Component {

    state = {
        busca: null,
        sucesses: null,
        sortDirection: 'ascending',
        sort: '',
    }

    async componentDidMount() {
        this.props.fetchAllModelosDispositivos();

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

        this.props.fetchAllModelosDispositivos(this.state.busca, this.props.pageNumber, clickedColumn, this.state.sortDirection);
        this.setState({ sucesses: null })
    }

    handleNextPage = () => {
        const { pageNumber, lastPage, busca } = this.props;
        if (lastPage === true) return;

        const novoPageNumber = pageNumber + 1;
        this.props.fetchAllModelosDispositivos(busca, novoPageNumber);
        this.setState({ sucesses: null })
    }

    handlePreviousPage = () => {
        const { pageNumber, firstPage, busca } = this.props;
        if (firstPage === true) return;

        const novoPageNumber = pageNumber - 1;
        this.props.fetchAllModelosDispositivos(busca, novoPageNumber);
        this.setState({ sucesses: null })
    }

    handleSearch = e => {
        e.preventDefault();
        const { busca } = this.state;

        this.props.filterModeloDispositivo(busca);
        this.setState({ sucesses: null })
    }

    render() {


        return (
            <div>
                <Grid stackable columns={2} >
                    <Grid.Column>
                        <Header as="h1">{text('dispositivos_modelos.titulo')}</Header>
                    </Grid.Column>
                    <Grid.Column>
                        <Button
                            floated='right'
                            icon labelPosition='right'
                            color="green"
                            size='large'
                            as={Link}
                            to="/gerencia/dispositivo-modelo/"
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
                                {text("dispositivos_modelos.nome")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={this.state.sort === 'fabricante' ? this.state.sortDirection : null}
                                onClick={this.handleSort('fabricante')}
                            >
                                {text("dispositivos_modelos.fabricante")}</Table.HeaderCell>

                            <Table.HeaderCell collapsing>{text("tabelas.editar")}</Table.HeaderCell>

                        </Table.Row>
                    </Table.Header>

                    <Table.Body>

                        {!this.props.consultando && this.props.listaModelosDispositivosFiltrada && Array.isArray(this.props.listaModelosDispositivosFiltrada) &&
                            this.props.listaModelosDispositivosFiltrada.map((item) =>
                                <Table.Row key={item.id}>
                                    <Table.Cell>{item.nome}</Table.Cell>
                                    <Table.Cell>{item.fabricante.nome}</Table.Cell>
                                    <Table.Cell>
                                        <Button icon size='mini' as={Link}
                                            to={"/gerencia/dispositivo-modelo/" + (item.id)}
                                        > <Icon name='edit' />
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        }

                        {!this.props.consultando &&
                            this.props.listaModelosDispositivosFiltrada &&
                            Array.isArray(this.props.listaModelosDispositivosFiltrada) &&
                            this.props.listaModelosDispositivosFiltrada <= 0 &&
                            <Table.Row >
                                <Table.Cell colSpan="3" style={{ textAlign: "center" }}>
                                    <b>{text("tabelas.sem-registros")}</b>
                                </Table.Cell>
                            </Table.Row>
                        }

                        {this.props.consultando &&
                            <Table.Row >
                                <Table.Cell colSpan="3">
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
                            <Table.HeaderCell colSpan='4'>
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
        listaModelosDispositivosFiltrada: state.modelosDispositivosReducer.listaModelosDispositivosFiltrada,
        consultando: state.modelosDispositivosReducer.executando,
        erroConsulta: state.modelosDispositivosReducer.erro,
        firstPage: state.modelosDispositivosReducer.firstPage,
        lastPage: state.modelosDispositivosReducer.lastPage,
        numberOfElements: state.modelosDispositivosReducer.numberOfElements,
        totalElements: state.modelosDispositivosReducer.totalElements,
        pageNumber: state.modelosDispositivosReducer.pageNumber,
        totalPages: state.modelosDispositivosReducer.totalPages,
        sort: state.modelosDispositivosReducer.sort,
        sortDirection: state.modelosDispositivosReducer.sortDirection,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchAllModelosDispositivos: (busca = '', page = 0, sort = '', sortDirection = 'asc') => dispatch(fetchAllModelosDispositivos(busca, page, sort, sortDirection)),
        filterModeloDispositivo: (busca) => dispatch(filterModeloDispositivo(busca)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(ModelosDispositivosTable));
