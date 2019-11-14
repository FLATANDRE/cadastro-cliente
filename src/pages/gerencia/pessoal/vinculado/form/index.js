import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Header, Divider, Icon, Message, Dropdown } from 'semantic-ui-react';
import { Formik } from "formik";
import api from '../../../../../services/api';
import { text } from '../../../../../services/locales';
import { Link, Redirect } from 'react-router-dom';

//Reactprime
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { InputTextarea } from 'primereact/inputtextarea';

//Reactprime css
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/components/chips/Chips.css';

import { addVinculado, editVinculado, filterPessoaFisica } from '../../../../../store/actionCreators/vinculadoAction';
import { RESET_STATES_VINCULADO } from '../../../../../store/actions';


class VinculadoForm extends Component {

    state = {
        vinculado: null,
        carregandoForm: false,
        pessoas: [],
        naturezas: [],
        natureza: null,
        profissoes: [],
        profissao: null,
        disabled: true,
        id: this.props.match.params.id
    };

    async componentDidMount() {

        this.props.resetStates();
        this.setState({ loading: true });

        const responseNatureza = await api.get('/pessoal/natureza-vinculo?size=999');
        var tempNatureza = [];
        responseNatureza.data.content.map(item =>
            tempNatureza.push({ text: item.nome, key: item.id, value: item.id })
        );
        this.setState({ naturezas: tempNatureza });

        const responseProfissao = await api.get('/pessoal/profissao?size=999');
        var tempProfissoes = [];
        responseProfissao.data.content.map(item =>
            tempProfissoes.push({ text: item.nome, key: item.id, value: item.id })
        );
        this.setState({ profissoes: tempProfissoes });

        if (this.props.match.params.id) {
            const { id } = this.props.match.params;
            const response = await api.get("/pessoal/vinculado/" + id);
            this.setState({ vinculado: response.data });
            this.setState({ disabled: false });
        } else {
            const responsePessoas = await api.get("/pessoal/pessoas-fisicas/all");
            const pessoasOptions = responsePessoas.data.map((item) => ({
                key: item.id,
                text: item.nome + " (" + item.cpfFormatado + ")",
                value: item.id,
            }))
            this.setState({ pessoas: pessoasOptions });
        }


        this.setState({ loading: false });
    }

    render() {

        const { id, vinculado, naturezas, profissoes, loading } = this.state;
        const { sucesso } = this.props;

        if (sucesso) {
            return <Redirect to={{
                pathname: '/gerencia/pessoal/vinculados',
                state: { sucesses: this.props.sucessoInsert }
            }}
            />
        }

        return (
            <div>
                <Header as="h1">
                    {text('vinculado.titulo-form')}
                </Header>

                {this.props.erroInsert &&
                    <Message negative>
                        {this.props.erroInsert }
                    </Message>
                }

                {this.props.sucessoInsert &&
                    <Message positive>
                        <p>{this.props.sucessoInsert}</p>
                    </Message>
                }

                <Formik

                    initialValues={{
                        id: vinculado && vinculado.id ? vinculado.id : undefined,
                        matricula: vinculado ? vinculado.matricula : '',
                        observacao: vinculado ? vinculado.observacao : '',
                        pessoaFisica: vinculado ? vinculado.pessoaFisica : '',
                        idPessoaFisica: vinculado && vinculado.pessoaFisica ? vinculado.pessoaFisica.id : '',
                        inicio: vinculado ? vinculado.inicio : '',
                        fim: vinculado ? vinculado.fim : '',

                        natureza: vinculado && vinculado.natureza ? vinculado.natureza.id : '',
                        idNaturezaVinculo: vinculado && vinculado.natureza ? vinculado.natureza.id : '',

                        profissao: vinculado && vinculado.profissao ? vinculado.profissao.id : '',
                        idProfissao: vinculado && vinculado.profissao ? vinculado.profissao.id : '',
                    }}
                    enableReinitialize={true}
                    onSubmit={async (values) => {
                        this.setState({ error: null, submitting: true, sucesses: null });

                        let vinculado = Object.assign({}, values);

                        try {
                            if (vinculado.pessoaFisica) {
                                vinculado.idPessoaFisica = vinculado.pessoaFisica;
                            }
                            if (vinculado.natureza) {
                                vinculado.idNaturezaVinculo = vinculado.natureza;
                            }
                            if (vinculado.profissao) {
                                vinculado.idProfissao = vinculado.profissao;
                            }

                            if (id) {
                                this.props.editVinculado(vinculado);
                            } else {
                                this.props.addVinculado(vinculado);
                            }
                        } catch (reason) {

                        }

                    }}
                    render={({
                        errors,
                        values,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        setFieldValue,
                    }) => (
                            <Form
                                onSubmit={handleSubmit}
                                loading={loading}
                            >
                                <Form.Group widths='equal'>

                                    {vinculado &&
                                        <div className="field">
                                            <label>{text("vinculado.pessoa-fisica")}</label>
                                            <InputText
                                                disabled
                                                value={values.pessoaFisica.nome}
                                            />
                                        </div>
                                    }

                                    {!vinculado &&
                                        <div className="field required">
                                            <label>{text("vinculado.pessoa-fisica")}</label>

                                            <div className="p-col-12 p-md-4">
                                                <div className="p-inputgroup">

                                                    <Dropdown
                                                        options={this.state.pessoas}
                                                        selection
                                                        search
                                                        fluid
                                                        onChange={(e, { value }) => setFieldValue("pessoaFisica", value)}
                                                        name="pessoaFisica"
                                                    />
                                                </div>
                                                <small>
                                                    {text("vinculado.pessoa-fisica-descricao")}.&nbsp;
                                                <Link
                                                        to={{
                                                            pathname: "/gerencia/pessoal/pessoa-fisica/",
                                                            state: { backTo: '/gerencia/pessoal/vinculado/' }
                                                        }}
                                                    >
                                                        {text("pessoa.botao-criar")}
                                                    </Link>
                                                </small>
                                            </div>
                                        </div>
                                    }

                                    <div className="field required">
                                        <label>{text("vinculado.matricula")}</label>
                                        <InputText
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.matricula}
                                            name="matricula"
                                            maxLength="255"
                                        />
                                    </div>

                                </Form.Group>

                                <Form.Group widths='equal'>

                                    <div className="field required">
                                        <label>{text("vinculado.natureza")}</label>

                                        <Dropdown
                                            placeholder={text("vinculado.natureza")}
                                            search
                                            selection
                                            options={naturezas}
                                            onChange={(e, { value }) => {
                                                setFieldValue('natureza', value)
                                            }}
                                            onBlur={handleBlur}
                                            value={values.natureza}
                                            name="natureza"
                                            noResultsMessage={text("geral.nenhum-resultado-encontrado")}
                                        />

                                    </div>

                                    <div className="field required">
                                        <label>{text("vinculado.profissao")}</label>

                                        <Dropdown
                                            search
                                            selection
                                            options={profissoes}
                                            onChange={(e, { value }) => {
                                                setFieldValue('profissao', value)
                                            }}
                                            onBlur={handleBlur}
                                            value={values.profissao}
                                            name="profissao"
                                            noResultsMessage={text("geral.nenhum-resultado-encontrado")}
                                        />


                                    </div>

                                </Form.Group>

                                <Form.Group widths='equal'>
                                    <div className="field required">
                                        <label>{text("vinculado.data-inicio")}</label>
                                        <InputMask
                                            mask="99/99/9999"
                                            slotChar="dd/mm/yyyy"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.inicio}
                                            name="inicio"
                                        />
                                    </div>

                                    <div className="field">
                                        <label>{text("vinculado.data-fim")}</label>
                                        <InputMask
                                            mask="99/99/9999"
                                            slotChar="dd/mm/yyyy"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.fim}
                                            name="fim"
                                        />
                                    </div>

                                </Form.Group>

                                <Form.Group widths='equal'>

                                    <div className="field">
                                        <label>{text("vinculado.observacao")}</label>
                                        <InputTextarea
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.observacao}
                                            name="observacao"
                                        />
                                    </div>
                                </Form.Group>

                                <br />
                                <Divider />

                                <Button
                                    floated='left'
                                    icon labelPosition='left'
                                    size='large'
                                    as={Link}
                                    to="/gerencia/pessoal/vinculados/"
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
                                    <Icon name='save' /> {vinculado ? text("formularios.atualizar") : text("formularios.salvar")}
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
        listaVinculadosFiltrada: state.vinculadoReducer.listaVinculadosFiltrada,
        erroInsert: state.vinculadoReducer.erro,
        sucessoInsert: state.vinculadoReducer.sucesso,
        inserindo: state.vinculadoReducer.executando,

        pessoasFisicas: state.vinculadoReducer.pessoasFisicas,
        pessoaFisica: state.vinculadoReducer.pessoaFisica,

        sucesso: state.vinculadoReducer.sucesso,
        erro: state.vinculadoReducer.erro,
        executando: state.vinculadoReducer.executando,

    }
}

const mapDispatchToProps = dispatch => {
    return {
        addVinculado: (vinculado) => dispatch(addVinculado(vinculado)),
        editVinculado: (vinculado) => dispatch(editVinculado(vinculado)),
        resetStates: () => dispatch({ type: RESET_STATES_VINCULADO }),
        filterPessoaFisisca: (busca) => dispatch(filterPessoaFisica(busca)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VinculadoForm);
