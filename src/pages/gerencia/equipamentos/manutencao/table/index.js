import React, { Component, memo } from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Header, Table, Message, Placeholder, Form, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { fetchAllManutencao, filterManutencao } from '../../../../../store/actionCreators/manutencaoAction';
import { text, html } from '../../../../../services/locales';

//Primereact

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

class ManutencaoTable extends Component {

    state = {
        busca: null,
        sucesses: null,
        sortDirection: 'ascending',
        sort: '',
    }

    async componentDidMount() {
        this.props.fetchAllManutencao();

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

        this.props.fetchAllManutencao(this.state.busca, this.props.pageNumber, clickedColumn, this.state.sortDirection);
        this.setState({ sucesses: null })
    }

    handleNextPage = () => {
        const { pageNumber, lastPage, busca } = this.props;
        if (lastPage === true) return;

        const novoPageNumber = pageNumber + 1;
        this.props.fetchAllManutencao(busca, novoPageNumber);
        this.setState({ sucesses: null })
    }

    handlePreviousPage = () => {
        const { pageNumber, firstPage, busca } = this.props;
        if (firstPage === true) return;

        const novoPageNumber = pageNumber - 1;
        this.props.fetchAllManutencao(busca, novoPageNumber);
        this.setState({ sucesses: null })
    }

    handleSearch = e => {
        e.preventDefault();
        const { busca } = this.state;

        this.props.filterManutencao(busca);
        this.setState({ sucesses: null })
    }

    render() {


        return (
            <div>
                <Grid stackable columns={2} >
                    <Grid.Column>
                        <Header as="h1">{text('equipamentos_manutencoes.titulo')}</Header>
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                        <Form size='large' className="form">
                            <Form.Group widths='equal'>
                                <Form.Input
                                    fluid icon='search'
                                    iconPosition='left'
                                    name="busca"
                                    placeholder={text('equipamentos_manutencoes.buscar')}
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
                                    to="/gerencia/equipamento-manutencao/"
                                >
                                    <Icon name='plus' />  {text("tabelas.novo")}
                                </Button>
                            </Form.Group>
                        </Form>
                    </Grid.Column>
                </Grid>

                {this.props.erroConsulta && <Message negative>{this.props.erroConsulta}</Message>}
                {this.state.sucesses && <Message positive>{this.state.sucesses}</Message>}

                <Table celled striped selectable sortable >
                    <Table.Header>
                        <Table.Row>

                            <Table.HeaderCell
                                sorted={this.state.sort === 'equipamento.tipoEquipamentoNome' ? this.state.sortDirection : null}
                                onClick={this.handleSort('equipamento.tipoEquipamentoNome')}
                            >
                                {text("equipamentos_manutencoes.equipamento")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={this.state.sort === 'equipamento.serialNumber' ? this.state.sortDirection : null}
                                onClick={this.handleSort('equipamento.serialNumber')}
                            >
                                {text("equipamentos_manutencoes.serial-number")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={this.state.sort === 'dataManutencao' ? this.state.sortDirection : null}
                                onClick={this.handleSort('dataManutencao')}
                            >
                                {text("equipamentos_manutencoes.data")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={this.state.sort === 'tipoManutencao.nome' ? this.state.sortDirection : null}
                                onClick={this.handleSort('tipoManutencao.nome')}
                            >
                                {text("equipamentos_manutencoes.tipo")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={this.state.sort === 'responsavel.nome' ? this.state.sortDirection : null}
                                onClick={this.handleSort('responsavel.nome')}
                            >
                                {text("equipamentos_manutencoes.responsavel")}</Table.HeaderCell>

                            <Table.HeaderCell collapsing>{text("tabelas.editar")}</Table.HeaderCell>

                        </Table.Row>
                    </Table.Header>

                    <Table.Body>

                        {!this.props.consultando && this.props.listaManutencaoFiltrada && Array.isArray(this.props.listaManutencaoFiltrada) &&
                            this.props.listaManutencaoFiltrada.map((item) =>
                                <Table.Row key={item.id}>
                                    <Table.Cell>{item.equipamento.tipoEquipamentoNome}</Table.Cell>
                                    <Table.Cell>{item.equipamento.serialNumber}</Table.Cell>
                                    <Table.Cell>{item.dataManutencaoFormatada}</Table.Cell>
                                    <Table.Cell>{item.tipoManutencao.nome}</Table.Cell>
                                    <Table.Cell>{item.responsavel.nome}</Table.Cell>
                                    <Table.Cell>
                                        <Button icon size='mini' as={Link}
                                            to={"/gerencia/equipamento-manutencao/" + (item.id)}
                                        > <Icon name='edit' />
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        }

                        {!this.props.consultando &&
                            this.props.listaManutencaoFiltrada &&
                            Array.isArray(this.props.listaManutencaoFiltrada) &&
                            this.props.listaManutencaoFiltrada <= 0 &&
                            <Table.Row >
                                <Table.Cell colSpan="6" style={{ textAlign: "center" }}>
                                    <b>{text("tabelas.sem-registros")}</b>
                                </Table.Cell>
                            </Table.Row>
                        }

                        {this.props.consultando &&
                            <Table.Row >
                                <Table.Cell colSpan="4">
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
        listaManutencaoFiltrada: state.manutencaoReducer.listaManutencaoFiltrada,
        consultando: state.manutencaoReducer.executando,
        erroConsulta: state.manutencaoReducer.erro,
        firstPage: state.manutencaoReducer.firstPage,
        lastPage: state.manutencaoReducer.lastPage,
        numberOfElements: state.manutencaoReducer.numberOfElements,
        totalElements: state.manutencaoReducer.totalElements,
        pageNumber: state.manutencaoReducer.pageNumber,
        totalPages: state.manutencaoReducer.totalPages,
        sort: state.manutencaoReducer.sort,
        sortDirection: state.manutencaoReducer.sortDirection,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchAllManutencao: (busca = '', page = 0, sort = '', sortDirection = 'asc') => dispatch(fetchAllManutencao(busca, page, sort, sortDirection)),
        filterManutencao: (busca) => dispatch(filterManutencao(busca)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(ManutencaoTable));
