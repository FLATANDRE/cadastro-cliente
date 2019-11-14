import React, { Component, memo } from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Header, Table, Message, Form, Placeholder, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { fetchAllBomba, filterBomba } from '../../../../store/actionCreators/bombaAction';
import { text, html } from '../../../../services/locales';

//Primereact
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

class BombasTable extends Component {

    state = {
        busca: null,
        sucesses: null,
        sortDirection: 'ascending',
        sort: '',
    }

    componentDidMount() {
        this.props.fetchAllBomba();

        if (this.props.location.state != null) {
            this.setState({ sucesses: this.props.location.state.sucesses })
        }

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

        this.props.fetchAllBomba(this.state.busca, this.props.pageNumber, clickedColumn, this.state.sortDirection);
        this.setState({ sucesses: null })
    }

    handleNextPage = () => {
        const { pageNumber, lastPage, busca } = this.props;
        if (lastPage === true) return;

        const novoPageNumber = pageNumber + 1;
        this.props.fetchAllBomba(busca, novoPageNumber);
        this.setState({ sucesses: null })
    }

    handlePreviousPage = () => {
        const { pageNumber, firstPage, busca } = this.props;
        if (firstPage === true) return;

        const novoPageNumber = pageNumber - 1;
        this.props.fetchAllBomba(busca, novoPageNumber);
        this.setState({ sucesses: null })
    }

    handleSearch = e => {
        e.preventDefault();
        const { busca } = this.state;

        this.props.filterBomba(busca);
        this.setState({ sucesses: null })
    }

    render() {


        return (
            <div>
                <Grid stackable columns={2} >
                    <Grid.Column>
                        <Header as="h1">{text('bomba.titulo')}</Header>
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                        <Form size='large' className="form">
                            <Form.Group widths='equal'>
                                <Form.Input
                                    fluid icon='search'
                                    iconPosition='left'
                                    name="busca"
                                    placeholder={text('bomba.buscar')}
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
                                    to="/gerencia/bomba/"
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
                                sorted={this.state.sort === 'serialNumber' ? this.state.sortDirection : null}
                                onClick={this.handleSort('serialNumber')}
                            >
                                {text("bomba.serial_number")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={this.state.sort === 'tipoBomba.nome' ? this.state.sortDirection : null}
                                onClick={this.handleSort('tipoBomba.nome')}
                            >{text("bomba.tipo")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={this.state.sort === 'modelo.fabricante.nome' ? this.state.sortDirection : null}
                                onClick={this.handleSort('modelo.fabricante.nome')}
                            >{text("bomba.fabricante")}</Table.HeaderCell>

                            <Table.HeaderCell
                                sorted={this.state.sort === 'modelo.nome' ? this.state.sortDirection : null}
                                onClick={this.handleSort('modelo.nome')}
                            >{text("bomba.modelo")}</Table.HeaderCell>

                            <Table.HeaderCell collapsing
                                sorted={this.state.sort === 'operativo' ? this.state.sortDirection : null}
                                onClick={this.handleSort('operativo')}
                            >{text("bomba.operativa")}</Table.HeaderCell>

                            <Table.HeaderCell collapsing>{text("tabelas.editar")}</Table.HeaderCell>

                        </Table.Row>
                    </Table.Header>

                    <Table.Body>

                        {!this.props.consultando && this.props.listaBombasFiltrada && Array.isArray(this.props.listaBombasFiltrada) &&
                            this.props.listaBombasFiltrada.map((item) =>
                                <Table.Row key={item.id}>
                                    <Table.Cell>{item.serialNumber}</Table.Cell>
                                    <Table.Cell>{item.tipoBomba.nome}</Table.Cell>
                                    <Table.Cell>{item.modelo.fabricante.nome}</Table.Cell>
                                    <Table.Cell>{item.modelo.nome}</Table.Cell>
                                    <Table.Cell>{item.operativo ? text("geral.sim") : text("geral.nao")}</Table.Cell>
                                    <Table.Cell>
                                        <Button icon size='mini' as={Link}
                                            to={"/gerencia/bomba/" + (item.id)}
                                        > <Icon name='edit' />
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        }

                        {!this.props.consultando &&
                            this.props.listaBombasFiltrada &&
                            Array.isArray(this.props.listaBombasFiltrada) &&
                            this.props.listaBombasFiltrada <= 0 &&
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
        listaBombasFiltrada: state.bombaReducer.listaBombasFiltrada,
        consultando: state.bombaReducer.executando,
        erroConsulta: state.bombaReducer.erro,
        firstPage: state.bombaReducer.firstPage,
        lastPage: state.bombaReducer.lastPage,
        numberOfElements: state.bombaReducer.numberOfElements,
        totalElements: state.bombaReducer.totalElements,
        pageNumber: state.bombaReducer.pageNumber,
        totalPages: state.bombaReducer.totalPages,
        sort: state.bombaReducer.sort,
        sortDirection: state.bombaReducer.sortDirection,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchAllBomba: (busca = '', page = 0, sort = '', sortDirection = 'asc') => dispatch(fetchAllBomba(busca, page, sort, sortDirection)),
        filterBomba: (busca) => dispatch(filterBomba(busca)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(BombasTable));
