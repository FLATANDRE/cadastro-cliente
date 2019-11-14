import React, { Component, memo } from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Header, Table, Message, Form, Placeholder, Grid, Breadcrumb, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { text, html } from '../../../../../services/locales';
import { fetchAll, filterLocalizacaoFisica, filterPessoaJuridica } from '../../../../../store/actionCreators/localizacaoFisicaAction';

//Primereact css
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import { RESET_LOCALIZACAO_FISICA } from '../../../../../store/actions';

import api from '../../../../../services/api';

class LocalizacaoFisicaTable extends Component {

    state = {
        busca: null,
        sortDirection: 'ascending',
        sort: '',
        sucesses: null,
        pessoaJuridica: null,
        pessoas: [],
        error: null,
    }

    async  componentDidMount() {
        this.props.resetStates();
        const responsePessoas = await api.get("/pessoal/pessoas-juridicas/all");
        const pessoasOptions = responsePessoas.data.map((item) => ({
            key: item.id,
            text: item.nome + " (" + item.cnpjFormatado + ")",
            value: item,
        }))
        this.setState({ pessoas: pessoasOptions });

        if (this.props.location.state != null && this.props.location.state.pessoaJuridica) {
            this.setState({ pessoaJuridica: this.props.location.state.pessoaJuridica })
            this.props.fetchAll(this.props.location.state.pessoaJuridica.nome, this.props.location.state.pessoaJuridica.id);
        }
        if (this.props.location && this.props.location.pessoaJuridica) {
            this.setState({ pessoaJuridica: this.props.location.pessoaJuridica });
            this.setState({ autoCompletePessoaJuridicas: [this.props.location.pessoaJuridica] });
        }
        if (this.props.location.state != null) {
            this.setState({ sucesses: this.props.location.state.sucesses })
        }
        if (this.state.pessoaJuridica) {
            this.props.fetchAll();
        }
    }

    handleSort = clickedColumn => () => {
        const { sort, sortDirection, pessoaJuridica } = this.state

        if (!pessoaJuridica) {
            return;
        }

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

        this.props.fetchAll(this.state.busca, pessoaJuridica.id, this.props.pageNumber, clickedColumn, this.state.sortDirection);
    }

    handleNextPage = () => {
        const { pageNumber, lastPage, busca } = this.props;
        const { pessoaJuridica } = this.state

        if (!pessoaJuridica) {
            return;
        }

        if (lastPage === true) {
            return;
        }

        const novoPageNumber = pageNumber + 1;
        this.props.fetchAll(busca, pessoaJuridica.id, novoPageNumber);
    }

    handlePreviousPage = () => {
        const { pageNumber, firstPage, busca } = this.props;
        const { pessoaJuridica } = this.state

        if (!pessoaJuridica) {
            return;
        }

        if (firstPage === true) {
            return;
        }

        const novoPageNumber = pageNumber - 1;
        this.props.fetchAll(busca, pessoaJuridica.id, novoPageNumber);
    }

    handleSearch = (e, pessoaJuridica) => {
        e.preventDefault();
        if (pessoaJuridica != null && pessoaJuridica !== '') {
            const { busca } = this.state;
            this.props.fetchAll(busca, pessoaJuridica.id);
            this.setState({
                loading: false,
                sucesses: null,
                error: null,
            });
        } else {
            this.setState({
                loading: false,
                sucesses: null,
                error: text("localizacao-fisica.pessoa-consulta")
            });
        }
    }

    handleCancel = () => {
        this.setState({ pessoaJuridica: null, buscaPessoaJuridica: null, sucesses: null, erro: null })
    }

    pessoaJuridicaSelecionada(item) {
        if (item.cnpj) {
            this.setState({ pessoaJuridica: item })
            this.props.fetchAll(null, item.id);
        }
        this.setState({
            loading: false,
            error: null
        });
    }

    render() {

        const { pessoaJuridica } = this.state;

        return (
            <div>
                <Grid stackable columns={2} >
                    <Grid.Column>
                        <Header as="h1">
                            <Header.Content>
                                {text('localizacao-fisica.titulo')}
                            </Header.Content>
                            <Header.Subheader>
                                <Breadcrumb>
                                    <Breadcrumb.Section
                                        onClick={this.handleCancel}
                                        link
                                        active={pessoaJuridica ? false : true}
                                    >
                                        {text("localizacao-fisica.pessoa-juridica")}
                                    </Breadcrumb.Section>

                                    <Breadcrumb.Divider icon='right chevron' />

                                    <Breadcrumb.Section
                                        active={pessoaJuridica ? true : false}
                                        disabled={pessoaJuridica ? false : true}
                                    >
                                        {pessoaJuridica ? (html("localizacao-fisica.exibindo-de", { pj: pessoaJuridica.nome })) : (text('localizacao-fisica.titulo'))}
                                    </Breadcrumb.Section>
                                </Breadcrumb>
                            </Header.Subheader>
                        </Header>
                    </Grid.Column>
                    <Grid.Column textAlign="right">

                        {pessoaJuridica &&
                            <>
                                <Form size='large' className="form">
                                    <Form.Group widths='equal'>
                                        <Form.Input
                                            fluid icon='search'
                                            iconPosition='left'
                                            name="busca"
                                            placeholder={text('localizacao-fisica.consulta')}
                                            onChange={e => this.setState({ busca: e.target.value })}
                                        />
                                        <Button color='blue' size='large' onClick={(e) => { this.handleSearch(e, pessoaJuridica) }} >
                                            {text('tabelas.buscar')}
                                        </Button>

                                        <Button
                                            id="insertId"
                                            floated='right'
                                            icon labelPosition='right'
                                            color="green"
                                            size='large'
                                            as={Link}
                                            to={{
                                                pathname: '/gerencia/predial/localizacao-fisica/',
                                                pessoaJuridica: pessoaJuridica
                                            }}
                                        >
                                            <Icon name='plus' />  {text("tabelas.novo")}
                                        </Button>
                                    </Form.Group>
                                </Form>
                            </>
                        }

                    </Grid.Column>
                </Grid>

                <br />

                {this.state.error && <Message negative>{this.state.error}</Message>}
                {this.state.sucesses && <Message clo positive>{this.state.sucesses}</Message>}

                {!pessoaJuridica &&
                    <Form size='large' className="form">
                        <div className="field">
                            <label>{text("localizacao-fisica.pessoa-juridica")}</label>
                            <Dropdown
                                options={this.state.pessoas}
                                selection
                                search
                                fluid
                                onChange={(e, { value }) => this.pessoaJuridicaSelecionada(value)}
                                name="pessoaJuridica"
                                placeholder={text("localizacao-fisica.pessoa-juridica")}
                                noResultsMessage={text("geral.nenhum-resultado-encontrado")}
                            />
                            <small>{text("localizacao-fisica.selecao-pessoa-juridica-descricao")}</small>
                        </div>
                    </Form>
                }

                {
                    pessoaJuridica &&
                    <Table celled striped selectable sortable >
                        <Table.Header>
                            <Table.Row>

                                <Table.HeaderCell
                                    sorted={this.state.sort === 'nome' ? this.state.sortDirection : null}
                                    onClick={this.handleSort('nome')}
                                >
                                    {text("localizacao-fisica.nome")}</Table.HeaderCell>

                                <Table.HeaderCell
                                >{text("localizacao-fisica.endereco")}</Table.HeaderCell>


                                <Table.HeaderCell collapsing>{text("tabelas.editar")}</Table.HeaderCell>

                            </Table.Row>
                        </Table.Header>

                        <Table.Body>

                            {!this.props.consultando && this.props.listaLocalizacaoFisicaFiltrada && Array.isArray(this.props.listaLocalizacaoFisicaFiltrada) &&
                                this.props.listaLocalizacaoFisicaFiltrada.map((item) =>
                                    <Table.Row key={item.id}>
                                        <Table.Cell>{item.nome}</Table.Cell>
                                        <Table.Cell>{item.endereco.enderecoFormatado}</Table.Cell>

                                        <Table.Cell>
                                            <Button icon size='mini' as={Link}
                                                to={{
                                                    pathname: '/gerencia/predial/localizacao-fisica/' + (item.id),
                                                    pessoaJuridica: pessoaJuridica
                                                }}
                                            > <Icon name='edit' />
                                            </Button>
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            }

                            {!this.props.consultando &&
                                this.props.listaLocalizacaoFisicaFiltrada &&
                                Array.isArray(this.props.listaLocalizacaoFisicaFiltrada) &&
                                this.props.listaLocalizacaoFisicaFiltrada <= 0 &&
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
                                <Table.HeaderCell colSpan='2'>
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
                }

            </div >
        );
    }

}


const mapStateToProps = state => {
    return {
        listaLocalizacaoFisicaFiltrada: state.localizacaoFisicaReducer.listaLocalizacaoFisicaFiltrada,
        consultando: state.localizacaoFisicaReducer.executando,
        erroConsulta: state.localizacaoFisicaReducer.erro,
        firstPage: state.localizacaoFisicaReducer.firstPage,
        lastPage: state.localizacaoFisicaReducer.lastPage,
        numberOfElements: state.localizacaoFisicaReducer.numberOfElements,
        totalElements: state.localizacaoFisicaReducer.totalElements,
        pageNumber: state.localizacaoFisicaReducer.pageNumber,
        totalPages: state.localizacaoFisicaReducer.totalPages,
        sort: state.localizacaoFisicaReducer.sort,
        sortDirection: state.localizacaoFisicaReducer.sortDirection,

        pessoasJuridicas: state.localizacaoFisicaReducer.pessoasJuridicas,
        pessoaJuridica: state.localizacaoFisicaReducer.pessoaJuridica,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchAll: (busca = '', pessoaJuridica = 0, page = 0, sort = '', sortDirection = 'asc') => dispatch(fetchAll(busca, pessoaJuridica, page, sort, sortDirection)),
        filterPessoa: (busca) => dispatch(filterLocalizacaoFisica(busca)),
        filterPessoaJuridica: (busca) => dispatch(filterPessoaJuridica(busca)),
        resetStates: () => dispatch({ type: RESET_LOCALIZACAO_FISICA }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(LocalizacaoFisicaTable));
