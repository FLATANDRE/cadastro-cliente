import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Header, Divider, Icon, Message } from 'semantic-ui-react';
import { Formik } from "formik";
import api from '../../../../../services/api';
import { text } from '../../../../../services/locales';
import { Link, Redirect} from 'react-router-dom';
import * as actions from '../../../../../store/actions';
//Reactprime
import {InputTextarea} from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/components/chips/Chips.css';
import { addTipoInsumo, editTipoInsumo } from '../../../../../store/actionCreators/tiposInsumosAction';

class TipoInsumoForm extends Component {

    state = {
        tiposInsumos: null,
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
            const response = await api.get("/insumos/tipos/" + this.props.match.params.id);
            this.setState({ tiposInsumos: response.data });
        }

        this.setState({ loading: false });
    }

    render() {

        const { id, tiposInsumos, loading } = this.state;
        const { sucesso, erro } = this.props;

        if (sucesso) {
            return <Redirect to={{
                pathname: '/gerencia/insumos-tipos',
                state: { sucesses: sucesso }
            }}
            />
        }

        return (
            <div>
                <Header as="h1">
                    {text('insumos_tipos.titulo-form')}
                </Header>

                {erro && <Message negative>{erro}</Message>}

                <Formik
                    initialValues={{
                        nome: tiposInsumos ? tiposInsumos.nome : '',
                        codigo: tiposInsumos ? tiposInsumos.codigo : '',
                        descricao: tiposInsumos ? tiposInsumos.descricao : '',
                        precoPadrao: tiposInsumos ? tiposInsumos.precoPadrao : '',
                    }}
                    enableReinitialize={true}
                    onSubmit={async (values, { setErrors, resetForm }) => {
                        const { nome, codigo, descricao, precoPadrao } = values;
                        if (id) {
                            this.props.editTipoInsumo({
                                nome,
                                codigo,
                                descricao,
                                precoPadrao: precoPadrao.toString().replace(",", "."),
                            }, id)
                        } else {
                            this.props.addTipoInsumo({
                                nome,
                                codigo,
                                descricao,
                                precoPadrao: precoPadrao.toString().replace(",", "."),
                            })
                        }
                    }}
                    render={({
                        isSubmitting,
                        errors,
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
                                        <label>{text("insumos_tipos.nome")}</label>
                                        <InputText
                                            onChange={e => {
                                                handleChange(e)
                                            }}
                                            onBlur={handleBlur}
                                            value={values.nome}
                                            name="nome"
                                        />
                                    </div>

                                    <div className="field required">
                                        <label>{text("insumos_tipos.codigo")}</label>
                                        <InputText
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.codigo}
                                            name="codigo"
                                        />
                                    </div>
                                                                    
                                    <div className="field required">
                                        <label>{text("insumos_tipos.preco-padrao")}</label>
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon">R$</span>
                                            <InputText
                                                keyfilter={/^\d*,?\d*$/}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.precoPadrao.toString().replace(".",",")}
                                                name="precoPadrao"
                                            />
                                        </div>
                                    </div>
                                </Form.Group>

                                <Form.Group widths='equal'>
                                   <div className="field" style={{width: '100%'}}>
                                        <label>{text("insumos_tipos.descricao")}</label>
                                        <InputTextarea
                                            onChange={e => {
                                                handleChange(e)
                                            }}
                                            onBlur={handleBlur}
                                            value={values.descricao}
                                            name="descricao"
                                            rows={3}
                                            style={{width: '100%'}}
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
                                    to="/gerencia/insumos-tipos/"
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
                                    <Icon name='save' /> {tiposInsumos ? text("formularios.atualizar") : text("formularios.salvar")}
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
        sucesso: state.tiposInsumosReducer.sucesso,
        erro: state.tiposInsumosReducer.erro
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addTipoInsumo: (insumo) => dispatch(addTipoInsumo(insumo)),
        editTipoInsumo: (insumo, id) => dispatch(editTipoInsumo(insumo, id)),
        setErro: (erro) => dispatch({type: actions.ERRO_TIPOS_INSUMOS, payload: erro})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TipoInsumoForm);