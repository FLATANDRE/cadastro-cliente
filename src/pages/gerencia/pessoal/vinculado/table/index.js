import React, { Component, memo } from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Header, Table, Message, Form, Placeholder, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { fetchAllVinculado, filterVinculado } from '../../../../../store/actionCreators/vinculadoAction';
import { text, html } from '../../../../../services/locales';

//Primereact

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

class VinculadosTable extends Component {

    state = {
        busca: null,
        sortDirection: 'ascending',
        sort: '',
        sucesses: null,
    }

    componentDidMount() {

        if (this.props.location.state != null) {
            this.setState({ sucesses: this.props.location.state.sucesses })
        }

        this.props.fetchAllVinculado();
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

        this.props.fetchAllVinculado(this.state.busca, this.props.pageNumber, clickedColumn, this.state.sortDirection);
    }

    handleNextPage = () => {
        const { pageNumber, lastPage, busca } = this.props;
        if (lastPage === true) return;

        const novoPageNumber = pageNumber + 1;
        this.props.fetchAllVinculado(busca, novoPageNumber);
    }

    handlePreviousPage = () => {
        const { pageNumber, firstPage, busca } = this.props;
        if (firstPage === true) return;

        const novoPageNumber = pageNumber - 1;
        this.props.fetchAllVinculado(busca, novoPageNumber);
    }

    handleSearch = e => {
        e.preventDefault();
        const { busca } = this.state;
        this.props.filterVinculado(busca);
    }

    render() {


        return (
            <div>

                <Grid stackable columns={2} >
                    <Grid.Column>
                        <Header as="h1">{text('vinculado.titulo')}</Header>
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                        <Form size='large' className="form">
                            <Form.Group widths='equal'>
                                <Form.Input
                                    fluid icon='search'
                                    iconPosition='left'
                                    name="busca"
                                    placeholder={text('vinculado.buscar-placeholder')}
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
                                    to="/gerencia/pessoal/vinculado/"
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
                                sorted={this.state.sort === 'matricula' ? this.state.sortDirection : null}
                                onClick={this.handleSort('matricula')}
                            >
                                {text("vinculado.matricula")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={this.state.sort === 'pessoaFisica.nome' ? this.state.sortDirection : null}
                                onClick={this.handleSort('pessoaFisica.nome')}
                            >
                                {text("vinculado.pessoaFisica-nome")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={this.state.sort === 'pessoaFisica.cpf' ? this.state.sortDirection : null}
                                onClick={this.handleSort('pessoaFisica.cpf')}
                            >
                                {text("vinculado.pessoaFisica-cpf")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={this.state.sort === 'profissao.nome' ? this.state.sortDirection : null}
                                onClick={this.handleSort('profissao.nome')}
                            >
                                {text("vinculado.profissao")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={this.state.sort === 'inicio' ? this.state.sortDirection : null}
                                onClick={this.handleSort('inicio')}
                            >{text("vinculado.data-inicio")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={this.state.sort === 'fim' ? this.state.sortDirection : null}
                                onClick={this.handleSort('fim')}
                            >{text("vinculado.data-fim")}</Table.HeaderCell>


                            <Table.HeaderCell collapsing>{text("tabelas.editar")}</Table.HeaderCell>

                        </Table.Row>
                    </Table.Header>

                    <Table.Body>

                        {!this.props.consultando && this.props.listaVinculadosFiltrada && Array.isArray(this.props.listaVinculadosFiltrada) &&
                            this.props.listaVinculadosFiltrada.map((item) =>
                                <Table.Row key={item.id}>
                                    <Table.Cell>{item.matricula}</Table.Cell>
                                    <Table.Cell>{item.pessoaFisica ? item.pessoaFisica.nome : ''}</Table.Cell>
                                    <Table.Cell>{item.pessoaFisica ? item.pessoaFisica.cpf : ''}</Table.Cell>
                                    <Table.Cell>{item.profissao ? item.profissao.nome : ''}</Table.Cell>
                                    <Table.Cell>{item.inicio}</Table.Cell>
                                    <Table.Cell>{item.fim}</Table.Cell>
                                    <Table.Cell>
                                        <Button icon size='mini' as={Link}
                                            to={"/gerencia/pessoal/vinculado/" + (item.id)}
                                        > <Icon name='edit' />
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        }

                        {!this.props.consultando &&
                            this.props.listaVinculadosFiltrada &&
                            Array.isArray(this.props.listaVinculadosFiltrada) &&
                            this.props.listaVinculadosFiltrada <= 0 &&
                            <Table.Row >
                                <Table.Cell colSpan="7" style={{ textAlign: "center" }}>
                                    <b>{text("tabelas.sem-registros")}</b>
                                </Table.Cell>
                            </Table.Row>
                        }

                        {this.props.consultando &&
                            <Table.Row >
                                <Table.Cell colSpan="7">
                                    {this.props.consultando &&
                                        <Placeholder fluid>
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
        listaVinculadosFiltrada: state.vinculadoReducer.listaVinculadosFiltrada,
        consultando: state.vinculadoReducer.executando,
        erroConsulta: state.vinculadoReducer.erro,
        firstPage: state.vinculadoReducer.firstPage,
        lastPage: state.vinculadoReducer.lastPage,
        numberOfElements: state.vinculadoReducer.numberOfElements,
        totalElements: state.vinculadoReducer.totalElements,
        pageNumber: state.vinculadoReducer.pageNumber,
        totalPages: state.vinculadoReducer.totalPages,
        sort: state.vinculadoReducer.sort,
        sortDirection: state.vinculadoReducer.sortDirection,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchAllVinculado: (busca = '', page = 0, sort = '', sortDirection = 'asc') => dispatch(fetchAllVinculado(busca, page, sort, sortDirection)),
        filterVinculado: (type, busca) => dispatch(filterVinculado(type, busca)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(VinculadosTable));
