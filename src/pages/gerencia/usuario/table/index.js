import React, { Component, memo } from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Header, Table, Message, Form, Placeholder, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { fetchAllUsuario, filterUsuario } from '../../../../store/actionCreators/usuarioAction';
import { text, html } from '../../../../services/locales';

//Primereact

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

class UsuariosTable extends Component {

    state = {
        busca: null,
        sucesses: null,
        sortDirection: 'ascending',
        sort: '',
    }

    componentDidMount() {
        this.props.fetchAllUsuario();
         
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

        this.props.fetchAllUsuario(this.state.busca, this.props.pageNumber, clickedColumn, this.state.sortDirection);
        this.setState({ sucesses: null })
    }

    handleNextPage = () => {
        const { pageNumber, lastPage, busca } = this.props;
        if (lastPage === true) return;

        const novoPageNumber = pageNumber + 1;
        this.props.fetchAllUsuario(busca, novoPageNumber);
        this.setState({ sucesses: null })
    }

    handlePreviousPage = () => {
        const { pageNumber, firstPage, busca } = this.props;
        if (firstPage === true) return;

        const novoPageNumber = pageNumber - 1;
        this.props.fetchAllUsuario(busca, novoPageNumber);
        this.setState({ sucesses: null })
    }

    handleSearch = e => {
        e.preventDefault();
        const { busca } = this.state;

        this.props.filterUsuario(busca);
        this.setState({ sucesses: null })
    }

    render() {


        return (
            <div>
                <Grid stackable columns={2} >
                    <Grid.Column>
                        <Header as="h1">{text('usuario.titulo')}</Header>
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                        <Form size='large' className="form">
                            <Form.Group widths='equal'>
                                <Form.Input
                                    fluid icon='search'
                                    iconPosition='left'
                                    name="busca"
                                    placeholder={text('usuario.buscar')}
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
                                    to="/gerencia/usuario/"
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
                                sorted={this.state.sort === 'login' ? this.state.sortDirection : null}
                                onClick={this.handleSort('login')}
                            >
                                {text("usuario.login")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={this.state.sort === 'pessoa' ? this.state.sortDirection : null}
                                onClick={this.handleSort('pessoa')}
                            >{text("usuario.pessoa-associada")}</Table.HeaderCell>

                            <Table.HeaderCell
                            >{text("usuario.perfis")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={this.state.sort === 'habilitado' ? this.state.sortDirection : null}
                                onClick={this.handleSort('habilitado')}
                            >{text("usuario.habilitado")}</Table.HeaderCell>

                            <Table.HeaderCell collapsing>{text("tabelas.editar")}</Table.HeaderCell>

                        </Table.Row>
                    </Table.Header>

                    <Table.Body>

                        {!this.props.consultando && this.props.listaUsuariosFiltrada && Array.isArray(this.props.listaUsuariosFiltrada) &&
                            this.props.listaUsuariosFiltrada.map((item) =>
                                <Table.Row key={item.id}>
                                    <Table.Cell>{item.login}</Table.Cell>
                                    <Table.Cell>{item.pessoa.nome}</Table.Cell>
                                    <Table.Cell>{item.perfis.map((p, i, arr) =>
                                        <>{p.nome + ((arr.length - 1 === i) ? '' : ', ')}</>
                                    )}</Table.Cell>
                                    <Table.Cell>{item.habilitado ? text("geral.sim") : text("geral.nao")}</Table.Cell>
                                    <Table.Cell>
                                        <Button icon size='mini' as={Link}
                                            to={"/gerencia/usuario/" + (item.id)}
                                        > <Icon name='edit' />
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        }

                        {!this.props.consultando &&
                            this.props.listaUsuariosFiltrada &&
                            Array.isArray(this.props.listaUsuariosFiltrada) &&
                            this.props.listaUsuariosFiltrada <= 0 &&
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
        listaUsuariosFiltrada: state.usuarioReducer.listaUsuariosFiltrada,
        consultando: state.usuarioReducer.executando,
        erroConsulta: state.usuarioReducer.erro,
        firstPage: state.usuarioReducer.firstPage,
        lastPage: state.usuarioReducer.lastPage,
        numberOfElements: state.usuarioReducer.numberOfElements,
        totalElements: state.usuarioReducer.totalElements,
        pageNumber: state.usuarioReducer.pageNumber,
        totalPages: state.usuarioReducer.totalPages,
        sort: state.usuarioReducer.sort,
        sortDirection: state.usuarioReducer.sortDirection,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchAllUsuario: (busca = '', page = 0, sort = '', sortDirection = 'asc') => dispatch(fetchAllUsuario(busca, page, sort, sortDirection)),
        filterUsuario: (busca) => dispatch(filterUsuario(busca)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(UsuariosTable));
