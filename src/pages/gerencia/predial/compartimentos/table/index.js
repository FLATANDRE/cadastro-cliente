import React, { Component, memo } from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Header, Table, Message, Form, Placeholder, Grid, Breadcrumb, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { text, html } from '../../../../../services/locales';
import { fetchAll } from '../../../../../store/actionCreators/compartimentosAction';

//Primereact css
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import { RESET_COMPARTIMENTOS } from '../../../../../store/actions';

import api from '../../../../../services/api';

class CompartimentosTable extends Component {

    state = {
        busca: null,
        sortDirection: 'ascending',
        sort: '',
        sucesses: null,
        pessoaJuridica: null,
        localizacao: null,
        localizacaoOptions: null,
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
        }
        if (this.props.location && this.props.location.pessoaJuridica) {
            this.setState({ pessoaJuridica: this.props.location.pessoaJuridica });
            this.setState({ autoCompletePessoaJuridicas: [this.props.location.pessoaJuridica] });
        }
        if (this.props.location && this.props.location.localizacao) {
            this.setState({ localizacao: this.props.location.localizacao });
            this.props.fetchAll(null, this.props.location.localizacao.id);
        }
        if (this.props.location.state != null) {
            this.props.location.state.pessoaJuridica && this.setState({ pessoaJuridica: this.props.location.state.pessoaJuridica });
            this.props.location.state.localizacao && this.setState({ localizacao: this.props.location.state.localizacao });
            this.props.location.state.localizacao && this.props.fetchAll(null, this.props.location.state.localizacao.id);
            this.setState({ sucesses: this.props.location.state.sucesses })
        }
    }

    handleSort = clickedColumn => () => {
        const { sort, sortDirection, localizacao } = this.state

        if (!localizacao) {
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

        this.props.fetchAll(this.state.busca, localizacao.id, this.props.pageNumber, clickedColumn, this.state.sortDirection);
    }

    handleNextPage = () => {
        const { pageNumber, lastPage, busca } = this.props;
        const { localizacao } = this.state

        if (!localizacao) {
            return;
        }

        if (lastPage === true) {
            return;
        }

        const novoPageNumber = pageNumber + 1;
        this.props.fetchAll(busca, localizacao.id, novoPageNumber);
    }

    handlePreviousPage = () => {
        const { pageNumber, firstPage, busca } = this.props;
        const { localizacao } = this.state

        if (!localizacao) {
            return;
        }

        if (firstPage === true) {
            return;
        }

        const novoPageNumber = pageNumber - 1;
        this.props.fetchAll(busca, localizacao.id, novoPageNumber);
    }

    handleSearch = (e, localizacao) => {
        e.preventDefault();
        if (localizacao != null && localizacao !== '') {
            const { busca } = this.state;
            this.props.fetchAll(busca, localizacao.id);
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
        this.setState({ pessoaJuridica: null, localizacao: null, buscaPessoaJuridica: null, sucesses: null, erro: null })
    }

    handleCancelLocalizacao = async () => {
        const { pessoaJuridica } = this.state
        this.setState({ localizacao: null, buscaPessoaJuridica: null, sucesses: null, erro: null })
        const response = await api.get("predial/localizacao-fisica/all?pj=" + pessoaJuridica.id)
        const localizacaoOptions = response.data.map((item) => ({
            key: item.id,
            text: item.nome,
            value: item,
        }))
        this.setState({ localizacaoOptions: localizacaoOptions })
    }

    async pessoaJuridicaSelecionada(item) {
        if (item.cnpj) {
            const response = await api.get("predial/localizacao-fisica/all?pj=" + item.id)
            const localizacaoOptions = response.data.map((item) => ({
                key: item.id,
                text: item.nome,
                value: item,
            }))
            this.setState({ pessoaJuridica: item, localizacaoOptions: localizacaoOptions })
        }
        this.setState({
            loading: false,
            error: null
        });
    }

    localizacaoSelecionada(item) {
        this.setState({ localizacao: item })
        this.props.fetchAll(null, item.id);
        this.setState({
            loading: false,
            error: null
        });
    }

    render() {

        const { pessoaJuridica, localizacao, localizacaoOptions } = this.state;

        return (
            <div>
                <Grid stackable columns={2} >
                    <Grid.Column>
                        <Header as="h1">
                            <Header.Content>
                                {text('compartimentos.titulo')}
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
                                        onClick={!localizacao ? false : this.handleCancelLocalizacao}
                                        active={!localizacao && pessoaJuridica ? true : false}
                                    >
                                        {pessoaJuridica ? (html("localizacao-fisica.exibindo-de", { pj: pessoaJuridica.nome })) : (text('localizacao-fisica.titulo'))}
                                    </Breadcrumb.Section>

                                    <Breadcrumb.Divider icon='right chevron' />

                                    <Breadcrumb.Section
                                        active={localizacao && pessoaJuridica ? true : false}
                                    >
                                         {localizacao ? (html("compartimentos.exibindo-de", { l: localizacao.nome })) : (text('compartimentos.titulo'))}
                                    </Breadcrumb.Section>
                                </Breadcrumb>
                            </Header.Subheader>
                        </Header>
                    </Grid.Column>
                    <Grid.Column textAlign="right">

                        {(pessoaJuridica && localizacao) &&
                            <>
                                <Form size='large' className="form">
                                    <Form.Group widths='equal'>
                                        <Form.Input
                                            fluid icon='search'
                                            iconPosition='left'
                                            name="busca"
                                            placeholder={text('compartimentos.consulta')}
                                            onChange={e => this.setState({ busca: e.target.value })}
                                        />
                                        <Button color='blue' size='large' onClick={(e) => { this.handleSearch(e, localizacao) }} >
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
                                                pathname: '/gerencia/predial/compartimento/',
                                                localizacao: localizacao,
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

                {(pessoaJuridica && !localizacao) &&
                    <Form size='large' className="form">
                        <div className="field">
                            <label>{text("localizacao-fisica.titulo")}</label>
                            <Dropdown
                                options={localizacaoOptions}
                                selection
                                search
                                fluid
                                onChange={(e, { value }) => this.localizacaoSelecionada(value)}
                                name="localizacao"
                                placeholder={text("localizacao-fisica.titulo")}
                                noResultsMessage={text("geral.nenhum-resultado-encontrado")}
                            />
                            <small>{text("localizacao-fisica.selecao-localizacao-descricao")}</small>
                        </div>
                    </Form>
                }

                {
                    (pessoaJuridica && localizacao) &&
                    <Table celled striped selectable sortable >
                        <Table.Header>
                            <Table.Row>

                                <Table.HeaderCell
                                    sorted={this.state.sort === 'nome' ? this.state.sortDirection : null}
                                    onClick={this.handleSort('nome')}
                                >
                                    {text("compartimentos.nome")}</Table.HeaderCell>

                                <Table.HeaderCell
                                    sorted={this.state.sort === 'tipo' ? this.state.sortDirection : null}
                                    onClick={this.handleSort('tipo')}
                                >{text("compartimentos.tipo")}</Table.HeaderCell>


                                <Table.HeaderCell collapsing>{text("tabelas.editar")}</Table.HeaderCell>

                            </Table.Row>
                        </Table.Header>

                        <Table.Body>

                            {!this.props.consultando && this.props.listaCompartimentosFiltrada && Array.isArray(this.props.listaCompartimentosFiltrada) &&
                                this.props.listaCompartimentosFiltrada.map((item) =>
                                    <Table.Row key={item.id}>
                                        <Table.Cell>{item.nome}</Table.Cell>
                                        <Table.Cell>{item.tipoCompartimento.nome}</Table.Cell>

                                        <Table.Cell>
                                            <Button icon size='mini' as={Link}
                                                to={{
                                                    pathname: '/gerencia/predial/compartimento/' + (item.id),
                                                    localizacao: localizacao,
                                                    pessoaJuridica: pessoaJuridica
                                                }}
                                            > <Icon name='edit' />
                                            </Button>
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            }

                            {!this.props.consultando &&
                                this.props.listaCompartimentosFiltrada &&
                                Array.isArray(this.props.listaCompartimentosFiltrada) &&
                                this.props.listaCompartimentosFiltrada <= 0 &&
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
        listaCompartimentosFiltrada: state.compartimentosReducer.listaCompartimentosFiltrada,
        consultando: state.compartimentosReducer.executando,
        erroConsulta: state.compartimentosReducer.erro,
        firstPage: state.compartimentosReducer.firstPage,
        lastPage: state.compartimentosReducer.lastPage,
        numberOfElements: state.compartimentosReducer.numberOfElements,
        totalElements: state.compartimentosReducer.totalElements,
        pageNumber: state.compartimentosReducer.pageNumber,
        totalPages: state.compartimentosReducer.totalPages,
        sort: state.compartimentosReducer.sort,
        sortDirection: state.compartimentosReducer.sortDirection,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchAll: (busca = '', localizacao = 0, page = 0, sort = '', sortDirection = 'asc') => dispatch(fetchAll(busca, localizacao, page, sort, sortDirection)),
        resetStates: () => dispatch({ type: RESET_COMPARTIMENTOS }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(CompartimentosTable));
