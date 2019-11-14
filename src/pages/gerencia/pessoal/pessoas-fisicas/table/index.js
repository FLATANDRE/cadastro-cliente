import React, { Component, memo } from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Header, Table, Message, Form, Placeholder, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { fetchAllPessoa, filterPessoa } from '../../../../../store/actionCreators/pessoaAction';
import { pessoaTypes } from '../../../../../utils/types';
import { text, html } from '../../../../../services/locales';

//Primereact

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

class PessoasFisicasTable extends Component {

    state = {
        busca: null,
        sucesses: null,
        sortDirection: 'ascending',
        sort: '',
    }

    componentDidMount() {
        this.props.fetchAllPessoa();
         
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

        this.props.fetchAllPessoa(this.state.busca, this.props.pageNumber, clickedColumn, this.state.sortDirection);
        this.setState({ sucesses: null })
    }

    handleNextPage = () => {
        const { pageNumber, lastPage, busca } = this.props;
        if (lastPage === true) return;

        const novoPageNumber = pageNumber + 1;
        this.props.fetchAllPessoa(busca, novoPageNumber);
        this.setState({ sucesses: null })
    }

    handlePreviousPage = () => {
        const { pageNumber, firstPage, busca } = this.props;
        if (firstPage === true) return;

        const novoPageNumber = pageNumber - 1;
        this.props.fetchAllPessoa(busca, novoPageNumber);
        this.setState({ sucesses: null })
    }

    handleSearch = e => {
        e.preventDefault();
        const { busca } = this.state;

        this.props.filterPessoa(pessoaTypes.PESSOA_FISICA, busca);
        this.setState({ sucesses: null })
    }

    render() {


        return (
            <div>

                <Grid stackable columns={2} >
                    <Grid.Column>
                        <Header as="h1">{text('pessoa.titulo-pf')}</Header>
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                        <Form size='large' className="form">
                            <Form.Group widths='equal'>
                                <Form.Input
                                    fluid icon='search'
                                    iconPosition='left'
                                    name="busca"
                                    placeholder={text('pessoa.buscar')}
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
                                    to="/gerencia/pessoal/pessoa-fisica/"
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
                                sorted={this.state.sort === 'nome' ? (this.state.sortDirection) : null}
                                onClick={this.handleSort('nome')}
                            >
                                {text("pessoa.nome")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={this.state.sort === 'cpf' ? this.state.sortDirection : null}
                                onClick={this.handleSort('cpf')}
                            >{text("pessoa.cpf")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={this.state.sort === 'rg' ? this.state.sortDirection : null}
                                onClick={this.handleSort('rg')}
                            >{text("pessoa.rg")}</Table.HeaderCell>

                            <Table.HeaderCell collapsing
                                sorted={this.state.sort === 'dataNascimento' ? this.state.sortDirection : null}
                                onClick={this.handleSort('dataNascimento')}
                            >{text("pessoa.data-nascimento")}</Table.HeaderCell>

                            <Table.HeaderCell collapsing>{text("tabelas.editar")}</Table.HeaderCell>

                        </Table.Row>
                    </Table.Header>

                    <Table.Body>

                        {!this.props.consultando && this.props.listaPessoasFiltrada && Array.isArray(this.props.listaPessoasFiltrada) &&
                            this.props.listaPessoasFiltrada.map((item) =>
                                <Table.Row key={item.id}>
                                    <Table.Cell>{item.nome}</Table.Cell>
                                    <Table.Cell>{item.cpfFormatado}</Table.Cell>
                                    <Table.Cell>{item.rg ? item.rg : text("geral.nao_informado")}</Table.Cell>
                                    <Table.Cell>{item.dataNascimento ? item.dataNascimentoFormatada : text("geral.nao_informado")}</Table.Cell>
                                    <Table.Cell>
                                        <Button icon size='mini' as={Link}
                                            to={"/gerencia/pessoal/pessoa-fisica/" + (item.id)}
                                        > <Icon name='edit' />
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        }

                        {!this.props.consultando &&
                            this.props.listaPessoasFiltrada &&
                            Array.isArray(this.props.listaPessoasFiltrada) &&
                            this.props.listaPessoasFiltrada <= 0 &&
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
        listaPessoasFiltrada: state.pessoaReducer.listaPessoasFiltrada,
        consultando: state.pessoaReducer.executando,
        erroConsulta: state.pessoaReducer.erro,
        firstPage: state.pessoaReducer.firstPage,
        lastPage: state.pessoaReducer.lastPage,
        numberOfElements: state.pessoaReducer.numberOfElements,
        totalElements: state.pessoaReducer.totalElements,
        pageNumber: state.pessoaReducer.pageNumber,
        totalPages: state.pessoaReducer.totalPages,
        sort: state.pessoaReducer.sort,
        sortDirection: state.pessoaReducer.sortDirection,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchAllPessoa: (busca = '', page = 0, sort = '', sortDirection = 'asc') => dispatch(fetchAllPessoa(pessoaTypes.PESSOA_FISICA, busca, page, sort, sortDirection)),
        filterPessoa: (type, busca) => dispatch(filterPessoa(type, busca)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(PessoasFisicasTable));
