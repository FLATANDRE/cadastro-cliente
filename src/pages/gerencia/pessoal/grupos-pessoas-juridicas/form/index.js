import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Header, Divider, Icon, Message, Dropdown } from 'semantic-ui-react';
import { Formik } from "formik";
import api from '../../../../../services/api';
import { text } from '../../../../../services/locales';
import { Link, Redirect } from 'react-router-dom';
// import * as actions from '../../../../../store/actions';
//Reactprime
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/components/chips/Chips.css';
import { addGrupoPessoaJuridica, editGrupoPessoaJuridica } from '../../../../../store/actionCreators/gruposPessoasJuridicasAction';

class GruposPessoasJuridicasForm extends Component {

    state = {
        gruposPessoasJuridicas: null,
        allPessoasJuridicas: null,
        carregandoForm: false,
        disabled: true,
        habilitado: false,
        autocompletepessoa: [],
        perfis: [],
        participantes: [],
        liderOptions: [],
        editarSenha: true,
        id: this.props.match.params.id
    };

    async componentDidMount() {
        this.setState({ loading: true });

        const pessoasJuridicas = await api.get("/pessoal/pessoas-juridicas/all");
        this.setState({ allPessoasJuridicas: pessoasJuridicas.data.map(item => { return { text: item.nome, key: item.id, value: item.id } }) });

        if (this.state.id) {
            const response = await api.get("/pessoal/grupo-pessoas-juridicas/" + this.props.match.params.id + "?size=999");
            this.setState({ gruposPessoasJuridicas: response.data });
            if (response.data.participantes.length > 0) {
                var newParticipantes = response.data.participantes.map((participante, index) => {
                    return participante.id
                })
                this.setState({ participantes: newParticipantes });
                let newliderOPtions = newParticipantes.map(item => {
                    return this.state.allPessoasJuridicas.filter(pessoa => pessoa.key === item)[0]
                })
                this.setState({ liderOptions: newliderOPtions })
            }
        }

        this.setState({ loading: false });
    }

    render() {

        const { id, gruposPessoasJuridicas, participantes, loading, allPessoasJuridicas, liderOptions } = this.state;
        const { sucesso, erro } = this.props;

        if (sucesso) {
            return <Redirect to={{
                pathname: '/gerencia/pessoal/grupos-pessoas-juridicas',
                state: { sucesses: sucesso }
            }}
            />
        }

        return (
            <div>
                <Header as="h1">
                    {text('grupos_pessoas_juridicas.titulo-form')}
                </Header>

                {erro && <Message negative>{erro}</Message>}

                <Formik
                    initialValues={{
                        nome: gruposPessoasJuridicas ? gruposPessoasJuridicas.nomeFantasia : '',
                        participantes,
                        lider: gruposPessoasJuridicas ? (gruposPessoasJuridicas.lider[0] ? gruposPessoasJuridicas.lider[0].id : null) : null,
                    }}
                    enableReinitialize={true}
                    onSubmit={async (values, { setErrors, resetForm }) => {
                        const { nome, participantes, lider } = values;
                        if (id) {
                            this.props.editGrupoPessoaJuridica({
                                nome,
                                participantes,
                                lider
                            }, id)
                        } else {
                            this.props.addGrupoPessoaJuridica({
                                nome,
                                participantes,
                                lider
                            })
                        }
                    }}
                    render={({
                        isSubmitting,
                        errors,
                        values,
                        setFieldValue,
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
                                        <label>{text("grupos_pessoas_juridicas.nome")}</label>
                                        <InputText
                                            onChange={e => {
                                                handleChange(e)
                                            }}
                                            onBlur={handleBlur}
                                            value={values.nome}
                                            name="nome"
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group widths='equal'>
                                    <div className="field required">
                                        <label>{text("grupos_pessoas_juridicas.participantes")}</label>
                                        <Dropdown
                                            placeholder={text("grupos_pessoas_juridicas.participantes-placeholder")}
                                            fluid
                                            multiple
                                            search
                                            selection
                                            disabled={!allPessoasJuridicas}
                                            options={allPessoasJuridicas}
                                            onChange={(e, { value }) => {
                                                setFieldValue("participantes", value)
                                                let newliderOPtions = value.map(item => {
                                                    return allPessoasJuridicas.filter(pessoa => pessoa.key === item)[0]
                                                })
                                                this.setState({ liderOptions: newliderOPtions })
                                            }}
                                            value={values.participantes}
                                            name="participantes"
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group widths='equal'>
                                    <div className="field">
                                        <label>{text("grupos_pessoas_juridicas.lider")}</label>
                                        <Dropdown
                                            placeholder={text("grupos_pessoas_juridicas.lider-placeholder")}
                                            fluid
                                            selection
                                            options={liderOptions}
                                            onChange={(e, { value }) => {
                                                setFieldValue("lider", value)
                                            }}
                                            value={values.lider}
                                            name="lider"
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
                                    to="/gerencia/pessoal/grupos-pessoas-juridicas/"
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
                                    <Icon name='save' /> {gruposPessoasJuridicas ? text("formularios.atualizar") : text("formularios.salvar")}
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
        sucesso: state.gruposPessoasJuridicasReducer.sucesso,
        erro: state.gruposPessoasJuridicasReducer.erro
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addGrupoPessoaJuridica: (fabricante) => dispatch(addGrupoPessoaJuridica(fabricante)),
        editGrupoPessoaJuridica: (fabricante, id) => dispatch(editGrupoPessoaJuridica(fabricante, id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GruposPessoasJuridicasForm);