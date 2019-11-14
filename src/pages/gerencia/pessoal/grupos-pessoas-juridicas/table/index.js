import React, { Component, memo } from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Header, Table, Message, Form, Placeholder, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { fetchAllGruposPessoasJuridicas, filterGruposPessoasJuridicas } from '../../../../../store/actionCreators/gruposPessoasJuridicasAction';
import { text, html } from '../../../../../services/locales';

//Primereact
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

class GruposPessoasJuridicasTable extends Component {

    state = {
        busca: null,
        sucesses: null,
        sortDirection: 'ascending',
        sort: '',
    }

    componentDidMount() {
        this.props.fetchAllGruposPessoasJuridicas();
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

        this.props.fetchAllGruposPessoasJuridicas(this.state.busca, this.props.pageNumber, clickedColumn, this.state.sortDirection);
        this.setState({ sucesses: null })
    }

    handleNextPage = () => {
        const { pageNumber, lastPage, busca } = this.props;
        if (lastPage === true) return;

        const novoPageNumber = pageNumber + 1;
        this.props.fetchAllGruposPessoasJuridicas(busca, novoPageNumber);
        this.setState({ sucesses: null })
    }

    handlePreviousPage = () => {
        const { pageNumber, firstPage, busca } = this.props;
        if (firstPage === true) return;

        const novoPageNumber = pageNumber - 1;
        this.props.fetchAllGruposPessoasJuridicas(busca, novoPageNumber);
        this.setState({ sucesses: null })
    }

    handleSearch = e => {
        e.preventDefault();
        const { busca } = this.state;

        this.props.filterGruposPessoasJuridicas(busca);
        this.setState({ sucesses: null })
    }

    render() {


        return (
            <div>
                <Grid stackable columns={2} >
                    <Grid.Column>
                        <Header as="h1">{text('grupos_pessoas_juridicas.titulo')}</Header>
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                        <Form size='large' className="form">
                            <Form.Group widths='equal'>
                                <Form.Input
                                    fluid icon='search'
                                    iconPosition='left'
                                    name="busca"
                                    placeholder={text('grupos_pessoas_juridicas.buscar')}
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
                                    to="/gerencia/pessoal/grupo-pessoa-juridica/"
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
                                sorted={this.state.sort === 'nomeFantasia' ? this.state.sortDirection : null}
                                onClick={this.handleSort('nomeFantasia')}
                            >
                                {text("grupos_pessoas_juridicas.nome")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={this.state.sort === 'lider' ? this.state.sortDirection : null}
                                onClick={this.handleSort('lider')}
                            >
                                {text("grupos_pessoas_juridicas.lider")}</Table.HeaderCell>

                            <Table.HeaderCell collapsing>{text("tabelas.editar")}</Table.HeaderCell>

                        </Table.Row>
                    </Table.Header>

                    <Table.Body>

                        {!this.props.consultando && this.props.listaGruposPessoasJuridicasFiltrada && Array.isArray(this.props.listaGruposPessoasJuridicasFiltrada) &&
                            this.props.listaGruposPessoasJuridicasFiltrada.map((item) =>
                                <Table.Row key={item.id}>
                                    <Table.Cell>{item.nomeFantasia}</Table.Cell>
                                    <Table.Cell>{item.lider[0] ? item.lider[0].nome : "---"}</Table.Cell>
                                    <Table.Cell>
                                        <Button icon size='mini' as={Link}
                                            to={"/gerencia/pessoal/grupo-pessoa-juridica/" + (item.id)}
                                        > <Icon name='edit' />
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        }

                        {!this.props.consultando &&
                            this.props.listaGruposPessoasJuridicasFiltrada &&
                            Array.isArray(this.props.listaGruposPessoasJuridicasFiltrada) &&
                            this.props.listaGruposPessoasJuridicasFiltrada <= 0 &&
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
                            <Table.HeaderCell colSpan='3'>
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
        listaGruposPessoasJuridicasFiltrada: state.gruposPessoasJuridicasReducer.listaGruposPessoasJuridicasFiltrada,
        consultando: state.gruposPessoasJuridicasReducer.executando,
        erroConsulta: state.gruposPessoasJuridicasReducer.erro,
        firstPage: state.gruposPessoasJuridicasReducer.firstPage,
        lastPage: state.gruposPessoasJuridicasReducer.lastPage,
        numberOfElements: state.gruposPessoasJuridicasReducer.numberOfElements,
        totalElements: state.gruposPessoasJuridicasReducer.totalElements,
        pageNumber: state.gruposPessoasJuridicasReducer.pageNumber,
        totalPages: state.gruposPessoasJuridicasReducer.totalPages,
        sort: state.gruposPessoasJuridicasReducer.sort,
        sortDirection: state.gruposPessoasJuridicasReducer.sortDirection,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchAllGruposPessoasJuridicas: (busca = '', page = 0, sort = '', sortDirection = 'asc') => dispatch(fetchAllGruposPessoasJuridicas(busca, page, sort, sortDirection)),
        filterGruposPessoasJuridicas: (busca) => dispatch(filterGruposPessoasJuridicas(busca)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(GruposPessoasJuridicasTable));
