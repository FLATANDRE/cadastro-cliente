import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Header, Divider, Icon, Message, Dropdown } from 'semantic-ui-react';
import { Formik } from "formik";
import api from '../../../../../services/api';
import { text } from '../../../../../services/locales';
import { Link, Redirect } from 'react-router-dom';
import { InputTextarea } from 'primereact/inputtextarea';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/components/chips/Chips.css';
import { addManutencao, editManutencao } from '../../../../../store/actionCreators/manutencaoAction';

class ManutencaoForm extends Component {

    state = {
        manutencao: null,
        equipamentosOptions: null,
        tiposequipamentosOptions: null,
        carregandoForm: false,
        disabled: true,
        habilitado: false,
        autocompletepessoa: [],
        perfis: [],
        editarSenha: true,
        id: this.props.match.params.id
    };

    async componentDidMount() {
        this.setState({ loading: true });

        if (this.state.id) {
            const response = await api.get("/equipamentos/manutencoes/" + this.props.match.params.id);
            this.setState({ manutencao: response.data });
        }

        const equipamentosResponse = await api.get("/equipamentos/all");
        const equipamentosOptions = equipamentosResponse.data.map((item) => ({
            text: item.serialNumber,
            value: item.id,
            key: item.id
        }))

        const tiposequipamentosResponse = await api.get("/equipamentos/manutencoes/tipos?size=999");
        const tiposequipamentosOptions = tiposequipamentosResponse.data.content.map((item) => ({
            text: item.nome,
            value: item.id,
            key: item.id
        }))

        this.setState({ tiposequipamentosOptions, equipamentosOptions });

        this.setState({ loading: false });
    }

    render() {

        const { id, equipamentosOptions, tiposequipamentosOptions, loading, manutencao } = this.state;
        const { sucesso, erro } = this.props;

        if (sucesso) {
            return <Redirect to={{
                pathname: '/gerencia/equipamentos-manutencoes',
                state: { sucesses: sucesso }
            }}
            />
        }

        return (
            <div>
                <Header as="h1">
                    {text('equipamentos_manutencoes.titulo-form')}
                </Header>

                {erro && <Message negative>{erro}</Message>}

                <Formik
                    initialValues={{
                        equipamento: manutencao ? manutencao.equipamento.id : '',
                        tipo: manutencao ? manutencao.tipoManutencao.id : '',
                        observacao: manutencao ? manutencao.observacao : ''
                    }}
                    enableReinitialize={true}
                    onSubmit={async (values, { setErrors, resetForm }) => {
                        const { equipamento, tipo, observacao } = values;
                        if (id) {
                            this.props.editManutencao({
                                equipamento,
                                tipo,
                                observacao
                            }, id)
                        } else {
                            this.props.addManutencao({
                                equipamento,
                                tipo,
                                observacao
                            })
                        }
                    }}
                    render={({
                        isSubmitting,
                        errors,
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
                                        <label>{text("equipamentos_manutencoes.equipamento")}</label>
                                        <Dropdown
                                            value={values.equipamento}
                                            name="equipamento"
                                            search
                                            selection
                                            options={equipamentosOptions}
                                            onChange={(e, { value }) => {
                                                setFieldValue("equipamento", value)
                                            }}
                                            placeholder={text("equipamentos_manutencoes.equipamento-placeholder")}
                                            noResultsMessage={text("geral.nenhum-resultado-encontrado")}
                                        />
                                    </div>
                                    <div className="field required">
                                        <label>{text("equipamentos_manutencoes.tipo")}</label>
                                        <Dropdown
                                            value={values.tipo}
                                            name="tipo"
                                            search
                                            selection
                                            options={tiposequipamentosOptions}
                                            onChange={(e, { value }) => {
                                                setFieldValue("tipo", value)
                                            }}
                                            placeholder={text("equipamentos_manutencoes.tipo-placeholder")}
                                            noResultsMessage={text("geral.nenhum-resultado-encontrado")}
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group widths='equal'>
                                    <div className="field">
                                        <label>{text("equipamentos_manutencoes.observacao")}</label>
                                        <InputTextarea
                                            rows={4}
                                            onChange={e => {
                                                handleChange(e)
                                            }}
                                            value={values.observacao}
                                            onBlur={handleBlur}
                                            name="observacao"
                                            autoResize={true}
                                            style={{ width: '100%' }}
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
                                    to="/gerencia/equipamentos-manutencoes/"
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
                                    <Icon name='save' /> {manutencao ? text("formularios.atualizar") : text("formularios.salvar")}
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
        sucesso: state.manutencaoReducer.sucesso,
        erro: state.manutencaoReducer.erro
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addManutencao: (modelo) => dispatch(addManutencao(modelo)),
        editManutencao: (modelo, id) => dispatch(editManutencao(modelo, id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManutencaoForm);