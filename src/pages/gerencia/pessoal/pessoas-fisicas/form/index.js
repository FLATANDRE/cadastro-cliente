import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Header, Divider, Icon, Message, Dropdown } from 'semantic-ui-react';
import { Formik } from "formik";
import api from '../../../../../services/api';
import { text } from '../../../../../services/locales';
import { Link, Redirect } from 'react-router-dom';
import { pessoaTypes } from '../../../../../utils/types';

//Reactprime
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { addPessoa, editPessoa } from '../../../../../store/actionCreators/pessoaAction';
import { RESET_STATES_PESSOA } from '../../../../../store/actions';
import InputArray from '../../../../../components/InputArray';
import { limparCampo } from '../../../../../utils/functions';
class PessoasFisicasForm extends Component {

    state = {
        pessoa: null,
        carregandoForm: false,
        emails: [{ name: "" }],
        telefones: [{ name: "" }],
        disabled: true,
        paisesOptions: null,
        estadosOptions: null,
        cidadesOptions: null,
        backTo: '/gerencia/pessoal/pessoas-fisicas'
    };


    async componentDidMount() {

        if (this.props.location.state != null) {
            this.setState({ backTo: this.props.location.state.backTo })
        }

        this.props.resetStates();
        this.setState({ loading: true });

        let options = [];
        if (this.props.paises) {
            this.props.paises.forEach(pais => {
                options.push({ key: pais.sigla, value: pais.sigla, text: pais.nome });
            })
            this.setState({ paisesOptions: options });
        }

        if (this.props.estados) {
            options = [];
            this.props.estados.forEach(estado => {
                options.push({ key: estado.uf, value: estado.uf, text: estado.nome + " (" + estado.uf + ")" });
            })
            this.setState({ estadosOptions: options });
        }

        if (this.props.match.params.id) {
            const { id } = this.props.match.params;
            const response = await api.get("/pessoal/pessoas-fisicas/" + id);

            this.setState({ pessoa: response.data });
            this.setState({ disabled: false });

            await this.handleSelect(response.data.endereco.cidade.estado.uf, this);

            var listaEmails = [];
            response.data.emails.forEach(item => listaEmails.push({ name: item.email }));

            if (listaEmails.length > 0) {
                this.setState({ emails: listaEmails });
            }

            var listaTelefones = [];
            response.data.telefones.forEach(item => listaTelefones.push({ name: item.numero }));

            if (listaTelefones.length > 0) {
                this.setState({ telefones: listaTelefones });
            }

        }
        this.setState({ loading: false });
    }

    async handleSelect(value, context) {
        let response = await api.get('/localizacao/cidade/estado/' + value + '?size=1000');

        if (response.data.content) {
            let options = [];
            response.data.content.forEach(cidade => {
                options.push({ key: cidade.id, value: cidade.id, text: cidade.nome });
            })
            context.setState({ cidadesOptions: options });
            context.setState({ disabled: false });
        }
    }


    handleEmailChange = (idx, value) => {
        const newEmails = this.state.emails.map((email, sidx) => {
            if (idx !== sidx) return email;
            return { ...email, name: value };
        });

        this.setState({ emails: newEmails });
    };

    addEmail = () => {
        var newEmails = this.state.emails;
        newEmails.push("");
        this.setState({ emails: newEmails });
    };

    removeEmail = (idx) => {
        var newEmails = this.state.emails;
        newEmails.splice(idx, 1);
        this.setState({ emails: newEmails });
    }

    handleTelefoneChange = (idx, value) => {
        const newTelefones = this.state.telefones.map((tel, sidx) => {
            if (idx !== sidx) return tel;
            return { ...tel, name: value };
        });

        this.setState({ telefones: newTelefones });
    };

    addTelefone = () => {
        var newTelefones = this.state.telefones;
        newTelefones.push("");
        this.setState({ telefones: newTelefones });
    };

    removeTelefone = (idx) => {
        var newTelefones = this.state.telefones;
        newTelefones.splice(idx, 1);
        this.setState({ telefones: newTelefones });
    }

    ajustarArrayTelefone = (arr) => {
        var arrayMod = arr.map(item => {
            if (item.name) {
                return limparCampo(item.name, true);
            }
            return item;
        });
        return arrayMod;
    }

    ajustarArrayEmail = (arr) => {
        var arrayMod = arr.map(item => item.name);
        return arrayMod;
    }

    render() {

        const { pessoa, loading, backTo } = this.state;

        if (this.props.sucessoInsert) {
            return <Redirect to={{
                pathname: backTo,
                state: { sucesses: this.props.sucessoInsert }
            }}
            />
        }

        return (
            <div>
                <Header as="h1">
                    {text('pessoa.titulo-pf')}
                </Header>

                {this.props.erroInsert &&
                    <Message negative>
                        <p>{text('pessoa.mensagem-erro')}</p>
                        <b>{text('pessoa.mensagem-erro-detalhes')}:</b> {this.props.erroInsert }
                    </Message>
                }

                <Formik
                    initialValues={{
                        nome: pessoa ? pessoa.nome : '',
                        cpf: pessoa ? pessoa.cpf : '',
                        rg: pessoa ? pessoa.rg : '',
                        dataNascimento: pessoa ? pessoa.dataNascimentoFormatada : '',
                        cep: pessoa ? pessoa.endereco.cep : '',
                        estado: pessoa ? pessoa.endereco.cidade.estado.uf : '',
                        cidade: pessoa ? pessoa.endereco.cidade.id : '',
                        pais: pessoa ? pessoa.endereco.cidade.estado.pais.nome : '',
                        logradouro: pessoa ? pessoa.endereco.logradouro : '',
                        bairro: pessoa ? pessoa.endereco.bairro : '',
                        emails: pessoa ? this.state.emails : [],
                        telefones: pessoa ? this.state.telefones : [],
                    }}
                    enableReinitialize={true}
                    onSubmit={async (values) => {  
                        let pessoa = Object.assign({}, values);
                        try {
                            pessoa.emails = this.ajustarArrayEmail(this.state.emails);
                            pessoa.telefones = this.ajustarArrayTelefone(this.state.telefones);

                            if (pessoa.pais === undefined || pessoa.pais === "") {
                                pessoa.pais = 1; //Brasil
                            }

                            if (pessoa.estado.id && pessoa.cidade.id) {
                                pessoa.estado = pessoa.estado.id;
                                pessoa.cidade = pessoa.cidade.id;
                            } else {

                                if (pessoa.estado !== "") {
                                    let response = await api.get('/localizacao/estado?q=' + pessoa.estado);

                                    if (Array.isArray(response.data.content) && response.data.content.length > 0) {
                                        pessoa.estado = response.data.content[0].id;
                                    }
                                }
                            }

                            if (this.state.pessoa) {//editando um item
                                pessoa.id = this.state.pessoa.id;
                                this.props.editPessoa(pessoa);
                            } else {//novo item                            
                                this.props.addPessoa(pessoa);
                            }
                        } catch (reason) {

                        }
                    }}
                    render={({
                        isSubmitting,
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
                                    <div className="field required">
                                        <label>{text("pessoa.nome")}</label>
                                        <InputText
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.nome}
                                            name="nome"
                                        />
                                    </div>

                                    <div className="field required">
                                        <label>{text("pessoa.data-nascimento")}</label>
                                        <InputMask
                                            mask="99/99/9999"
                                            slotChar="dd/mm/yyyy"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.dataNascimento}
                                            name="dataNascimento"
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group widths='equal'>
                                    <div className="field required">
                                        <label>{text("pessoa.cpf")}</label>
                                        <InputMask
                                            mask="999.999.999-99"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.cpf}
                                            name="cpf"
                                        />
                                    </div>

                                    <div className="field">
                                        <label>{text("pessoa.rg")}</label>
                                        <InputText
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.rg}
                                            name="rg"
                                            keyfilter="int"
                                        />
                                    </div>
                                </Form.Group>


                                <h4>{text("pessoa.contato-info")}</h4>
                                <Form.Group widths='equal'>

                                    <InputArray
                                        tooltipBtAdd={text("pessoa.inserir_email")}
                                        tooltipBtDelete={text("pessoa.remover_email")}
                                        placeholder={text("pessoa.emails")}
                                        type="text"
                                        label={text("pessoa.emails")}
                                        values={this.state.emails}
                                        onChange={this.handleEmailChange}
                                        onAdd={this.addEmail}
                                        onRemove={this.removeEmail}
                                    />

                                    <InputArray
                                        tooltipBtAdd={text("pessoa.inserir_telefone")}
                                        tooltipBtDelete={text("pessoa.remover_telefone")}
                                        placeholder={text("pessoa.telefones")}
                                        mask={['+', /\d{1,}/, /\d{1,}/, /\d{0,}/, ' ', '(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                        type="text"
                                        label={text("pessoa.telefones")}
                                        values={this.state.telefones}
                                        onChange={this.handleTelefoneChange}
                                        onAdd={this.addTelefone}
                                        onRemove={this.removeTelefone}
                                    />
                                </Form.Group>

                                <h4>{text("pessoa.endereco-info")}</h4>

                                <Form.Group widths='equal'>
                                    <div className="field required">
                                        <label>{text("pessoa.pais")}</label>
                                        <Dropdown
                                            options={this.state.paisesOptions}
                                            selection
                                            search
                                            defaultValue={'br'}
                                            onChange={(e, { value }) => setFieldValue("pais", value)}
                                            name="pais"
                                        />

                                    </div>

                                    <div className="field required">
                                        <label>{text("pessoa.estado")}</label>
                                        <Dropdown
                                            clearable
                                            search
                                            options={this.state.estadosOptions}
                                            value={values.estado}
                                            selection
                                            onChange={(e, { value }) => { setFieldValue("estado", value); this.handleSelect(value, this) }}
                                            name="estado"
                                        />
                                    </div>

                                    <div className="field required">
                                        <label>{text("pessoa.cidade")}</label>
                                        <Dropdown
                                            clearable
                                            search
                                            options={this.state.cidadesOptions}
                                            value={values.cidade}
                                            selection
                                            name="cidade"
                                            disabled={this.state.disabled}
                                            onChange={(e, { value }) => setFieldValue("cidade", value)}
                                        />
                                    </div>

                                </Form.Group>
                                <Form.Group widths='equal'>
                                    <div className="field required">
                                        <label>{text("pessoa.cep")}</label>
                                        <InputMask
                                            mask="99.999-999"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.cep}
                                            name="cep"
                                        />
                                    </div>

                                    <div className="field required">
                                        <label>{text("pessoa.logradouro")}</label>
                                        <InputText
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.logradouro}
                                            name="logradouro"
                                        />
                                        <small>{text("pessoa.logradouro-descricao")}</small>
                                    </div>

                                    <div className="field required">
                                        <label>{text("pessoa.bairro")}</label>
                                        <InputText
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.bairro}
                                            name="bairro"
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
                                    to={backTo}
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
                                    <Icon name='save' /> {pessoa ? text("formularios.atualizar") : text("formularios.salvar")}
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
        listaPessoasFiltrada: state.pessoaReducer.listaPessoasFiltrada,
        erroInsert: state.pessoaReducer.erro,
        sucessoInsert: state.pessoaReducer.sucesso,
        inserindo: state.pessoaReducer.executando,
        estados: state.enderecoReducer.listaEstados,
        paises: state.enderecoReducer.listaPaises,
        estado: state.enderecoReducer.estado,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addPessoa: (pessoa) => dispatch(addPessoa(pessoa, pessoaTypes.PESSOA_FISICA)),
        editPessoa: (pessoa) => dispatch(editPessoa(pessoa, pessoaTypes.PESSOA_FISICA)),
        resetStates: (pessoa) => dispatch({ type: RESET_STATES_PESSOA }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PessoasFisicasForm);