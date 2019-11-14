import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Header, Divider, Icon, Message, Dropdown, Table, Placeholder, Segment } from 'semantic-ui-react';
import { Formik } from "formik";
import api from '../../../services/api';
import { text } from '../../../services/locales';
import { Link, Redirect } from 'react-router-dom';
import * as actions from '../../../store/actions';
//Reactprime
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { InputTextarea } from 'primereact/inputtextarea';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/components/chips/Chips.css';
import { addNotaFiscalCompra, editNotaFiscalCompra } from '../../../store/actionCreators/notasFiscaisCompraAction';
import { filterPessoa } from '../../../store/actionCreators/pessoaAction';

class NotasFiscaisCompraForm extends Component {

    state = {
        notaFiscalCompra: null,
        carregandoForm: false,
        disabled: true,
        habilitado: false,
        consultando: false,
        quantidade: null,
        precoUnitario: null,
        modeloDispositivo: null,
        listaItens: [],
        listaPessoasName: null,
        listaPessoas: null,
        listaModeloDispositivo: null,
        id: this.props.match.params.id
    };

    async componentDidMount() {
        this.setState({ loading: true });

        if (this.state.id) {
            const response = await api.get("/notas-fiscais-compra/" + this.props.match.params.id);
            let itens = [];
            response.data.itens.map(item => itens.push({ modeloDispositivo: item.modeloDispositivo.id, precoUnitario: item.precoUnitario, quantidade: item.quantidade }))
            this.setState({
                listaItens: itens,
                notaFiscalCompra: response.data
            })
        }

        const pessoaResponse = await api.get("/pessoal/pessoas-juridicas/all");
        const pessoaOptions = pessoaResponse.data.map((item) => ({
            text: item.nome,
            value: item.id,
            key: item.id
        }))

        const modeloResponse = await api.get("/dispositivos/modelos?size=999");
        let modeloOptions = []
        modeloResponse.data.content.map((item) => {
            if (!item.desconhecido) {
                modeloOptions.push({
                    text: item.nome,
                    value: item.id,
                    key: item.id
                })
            };
            return null;
        })

        this.setState({ loading: false, listaModeloDispositivo: modeloOptions, listaPessoas: pessoaOptions });

    }

    addItem = item => {
        let temp = [...this.state.listaItens];
        temp.push(item)
        this.setState({ listaItens: temp, quantidade: '', modeloDispositivo: '', precoUnitario: '' });
    }

    removeItem = index => {
        let temp = [...this.state.listaItens];
        temp.splice(index, 1)
        this.setState({ listaItens: temp });
    }

    formatData = data => {
        var temp = new Date(data);
        var mounth = temp.getMonth();
        var day = temp.getDate();
        var year = temp.getFullYear();
        var date = `${year}-${("0" + (mounth + 1)).slice(-2)}-${("0" + day).slice(-2)}`
        return date;
    }

    render() {
        const { id, loading, consultando, listaItens, notaFiscalCompra, listaPessoas, listaModeloDispositivo } = this.state;
        const { sucesso, erro } = this.props;

        if (sucesso) {
            return <Redirect to={{
                pathname: '/notas-fiscais-compra',
                state: { sucesses: sucesso }
            }}
            />
        }

        return (
            <div>
                <Header as="h1">
                    {text('notas-fiscais-compra.titulo-form')}
                </Header>

                {erro && <Message negative>{erro}</Message>}

                <Formik
                    initialValues={{
                        numero: notaFiscalCompra ? notaFiscalCompra.numero : '',
                        data: notaFiscalCompra ? this.formatData(notaFiscalCompra.data) : null,
                        fornecedor: notaFiscalCompra ? notaFiscalCompra.fornecedor.id : null,
                        descricao: notaFiscalCompra ? notaFiscalCompra.descricao : ''
                    }}
                    enableReinitialize={true}
                    onSubmit={async (values, { setErrors, resetForm }) => {
                        this.setState({ error: null, submitting: true, sucesses: null });
                        var data = values.data;
                        if (values.data) data = values.data.split("/").reverse().join("-");
                        if (id) {
                            this.props.editNotaFiscalCompra({
                                data,
                                numero: values.numero,
                                fornecedor: values.fornecedor,
                                descricao: values.descricao,
                                itens: this.state.listaItens
                            }, id)
                        } else {
                            this.props.addNotaFiscalCompra({
                                data,
                                numero: values.numero,
                                fornecedor: values.fornecedor,
                                descricao: values.descricao,
                                itens: this.state.listaItens
                            })
                        }
                    }}
                    render={({
                        setFieldValue,
                        values,
                        handleChange,
                        handleBlur,
                        handleSubmit
                    }) => (
                            <Form
                                onSubmit={handleSubmit}
                                loading={loading}
                            >

                                <Form.Group widths='equal'>

                                    <div className="field required">
                                        <label>{text("notas-fiscais-compra.numero")}</label>
                                        <InputText
                                            disabled={id}
                                            onChange={e => {
                                                handleChange(e)
                                            }}
                                            keyfilter="int"
                                            onBlur={handleBlur}
                                            value={values.numero}
                                            name="numero"
                                        />
                                    </div>
                                    <div className="field required">
                                        <label>{text("notas-fiscais-compra.data")}</label>
                                        <InputMask
                                            mask="99/99/9999"
                                            slotChar="dd/mm/yyyy"
                                            onChange={e => {
                                                handleChange(e)
                                            }}
                                            keyfilter="int"
                                            value={values.data}
                                            onBlur={handleBlur}
                                            name="data"
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                    <div className="field required">
                                        <label>{text("notas-fiscais-compra.fornecedor")}</label>
                                        <Dropdown
                                            value={values.fornecedor}
                                            name="fornecedor"
                                            search
                                            selection
                                            options={listaPessoas}
                                            onChange={(e, { value }) => {
                                                setFieldValue("fornecedor", value)
                                            }}
                                            placeholder={text("notas-fiscais-compra.fornecedor-placeholder")}
                                            noResultsMessage={text("geral.nenhum-resultado-encontrado")}
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group>
                                    <div className="field" style={{ width: '100%' }}>
                                        <label>{text("notas-fiscais-compra.descricao")}</label>
                                        <InputTextarea
                                            rows={4}
                                            onChange={e => {
                                                handleChange(e)
                                            }}
                                            value={values.descricao}
                                            onBlur={handleBlur}
                                            name="descricao"
                                            autoResize={true}
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </Form.Group>

                                <Header as='h2' attached='top'>
                                    {text("notas-fiscais-compra.itens")}
                                </Header>
                                <Segment attached>
                                    <Form.Group widths='equal'>

                                        <div className="field required">
                                            <label>{text("notas-fiscais-compra.modelo-dispositivo")}</label>
                                            <Dropdown
                                                value={this.state.modeloDispositivo || ''}
                                                name="modeloDispositivo"
                                                search
                                                selection
                                                options={listaModeloDispositivo}
                                                onChange={(e, { value }) => {
                                                    this.setState({ modeloDispositivo: value })
                                                }}
                                                placeholder={text("notas-fiscais-compra.modelo-dispositivo-placeholder")}
                                                noResultsMessage={text("geral.nenhum-resultado-encontrado")}
                                            />
                                        </div>
                                        <div className="field required">
                                            <label>{text("notas-fiscais-compra.quantidade")}</label>
                                            <InputText
                                                onChange={e => {
                                                    this.setState({ quantidade: e.target.value })
                                                }}
                                                keyfilter="int"
                                                value={this.state.quantidade || ''}
                                                name="quantidade"
                                            />
                                        </div>
                                        <div className="field required">
                                            <label>{text("notas-fiscais-compra.valor-unitario")}</label>
                                            <div className="p-inputgroup">
                                                <span className="p-inputgroup-addon">R$</span>
                                                <InputText
                                                    onChange={e => {
                                                        this.setState({ precoUnitario: e.target.value })
                                                    }}
                                                    keyfilter={/^\d*,?\d*$/}
                                                    value={this.state.precoUnitario || ''}
                                                    name="precoUnitario"
                                                />
                                            </div>
                                        </div>
                                    </Form.Group>

                                    <Button
                                        disabled={!this.state.quantidade || !this.state.precoUnitario || !this.state.modeloDispositivo}
                                        icon labelPosition='right'
                                        color="green"
                                        size='large'
                                        type="button"
                                        floated="right"
                                        onClick={() => this.addItem({
                                            quantidade: this.state.quantidade,
                                            modeloDispositivo: this.state.modeloDispositivo,
                                            precoUnitario: Number(this.state.precoUnitario.replace(",", "."))
                                        })}
                                    >
                                        <Icon name='plus' />  {text("geral.adicionar")}
                                    </Button>

                                    <br /><br />

                                    <Table celled striped selectable  >
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell>{text("notas-fiscais-compra.modelo-dispositivo")}</Table.HeaderCell>
                                                <Table.HeaderCell>{text("notas-fiscais-compra.quantidade")}</Table.HeaderCell>
                                                <Table.HeaderCell>{text("notas-fiscais-compra.valor-unitario")}</Table.HeaderCell>
                                                <Table.HeaderCell collapsing>{text("tabelas.remover")}</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>

                                        <Table.Body>

                                            {!consultando && listaItens && Array.isArray(listaItens) &&
                                                listaItens.map((item, index) => {
                                                    return (<Table.Row key={index}>
                                                        <Table.Cell>{listaModeloDispositivo && listaModeloDispositivo.filter(l => l.value === item.modeloDispositivo || l.value === item.modeloDispositivo.id)[0].text}</Table.Cell>
                                                        <Table.Cell>{item.quantidade}</Table.Cell>
                                                        <Table.Cell>R$&nbsp;{item.precoUnitario.toString().replace(".", ",")}</Table.Cell>
                                                        <Table.Cell>
                                                            <Button
                                                                icon
                                                                type="button"
                                                                size='mini'
                                                                onClick={() => this.removeItem(index)}
                                                            > <Icon name='delete' />
                                                            </Button>
                                                        </Table.Cell>
                                                    </Table.Row>)
                                                })
                                            }

                                            {!consultando &&
                                                listaItens &&
                                                Array.isArray(listaItens) &&
                                                listaItens <= 0 &&
                                                <Table.Row >
                                                    <Table.Cell colSpan="4" style={{ textAlign: "center" }}>
                                                        <b>{text("tabelas.sem-registros")}</b>
                                                    </Table.Cell>
                                                </Table.Row>
                                            }

                                            {consultando &&
                                                <Table.Row >
                                                    <Table.Cell colSpan="4">
                                                        {consultando &&
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
                                    </Table>
                                </Segment>
                                <br />
                                <Divider />

                                <Button
                                    floated='left'
                                    icon labelPosition='left'
                                    size='large'
                                    as={Link}
                                    to="/notas-fiscais-compra/"
                                    disabled={this.props.inserindo}
                                >
                                    <Icon name='cancel' /> {text("formularios.cancelar")}
                                </Button>

                                <Button
                                    primary
                                    loading={this.props.inserindo}
                                    type='submit'
                                    floated='right'
                                    icon labelPosition='right'
                                    size="huge"
                                    disabled={this.props.inserindo}
                                >
                                    <Icon name='save' /> {id ? text("formularios.atualizar") : text("formularios.salvar")}
                                </Button>

                            </Form>
                        )}
                />
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        listaPessoas: state.pessoaReducer.listaNotasFiscaisCompra,
        listaNotasFiscaisCompra: state.notasFiscaisCompraReducer.listaNotasFiscaisCompra,
        sucesso: state.notasFiscaisCompraReducer.sucesso,
        erro: state.notasFiscaisCompraReducer.erro,
        executando: state.notasFiscaisCompraReducer.executando,
        erroInsert: state.notasFiscaisCompraReducer.erro,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addNotaFiscalCompra: (usuario) => dispatch(addNotaFiscalCompra(usuario)),
        editNotaFiscalCompra: (usuario, id) => dispatch(editNotaFiscalCompra(usuario, id)),
        filterPessoa: (type, filterValue) => dispatch(filterPessoa(type, filterValue)),
        setErro: (erro) => dispatch({ type: actions.ERRO_NOTAS_FISCAIS_COMPRA, payload: erro })
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NotasFiscaisCompraForm);