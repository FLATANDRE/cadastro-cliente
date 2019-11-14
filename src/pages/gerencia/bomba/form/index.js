import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Header, Divider, Icon, Message, Dropdown } from 'semantic-ui-react';
import { Formik } from "formik";
import api from '../../../../services/api';
import { text } from '../../../../services/locales';
import { Link, Redirect } from 'react-router-dom';
import * as actions from '../../../../store/actions';
//Reactprime
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/components/chips/Chips.css';
import { addBomba, editBomba } from '../../../../store/actionCreators/bombaAction';

class BombaForm extends Component {

    state = {
        bomba: null,
        carregandoForm: false,
        disabled: true,
        habilitado: false,
        autocompletepessoa: [],
        tipoBombas: [],
        tipoBomba: null,
        modeloOptions: null,
        id: this.props.match.params.id
    };

    async componentDidMount() {
        this.setState({ loading: true });

        const response = await api.get("/equipamentos/bombas/tipos");
        var temp = [];
        response.data.content.map(item => 
            temp.push({text: item.nome, key: item.id, value: item.id})
        )

        if (this.state.id) {
            const response = await api.get("/equipamentos/bombas/" + this.props.match.params.id);
            this.setState({ bomba: response.data});
        }

        const modeloResponse = await api.get("/equipamentos/modelos?size=999");
        const modeloOptions = modeloResponse.data.content.map((item) => ({
            key: item.id,
            text: item.nome,
            value: item.id,
        }))

        this.setState({ tipoBombas: temp, modeloOptions, loading: false  });

    }

    render() {
        const { id, bomba, loading, tipoBombas, modeloOptions } = this.state;
        const { sucesso, erro } = this.props;

        if (sucesso) {
            return <Redirect to={{
                pathname: '/gerencia/bombas',
                state: { sucesses: sucesso }
            }}
            />
        }

        return (
            <div>
                <Header as="h1">
                    {text('bomba.titulo-form')}
                </Header>

                {erro && <Message negative>{erro}</Message>}

                <Formik
                    initialValues={{
                        serialNumber: bomba ? bomba.serialNumber : '',
                        operativa: bomba ? bomba.operativo : false,
                        tipoBomba: bomba && bomba.tipoBomba ? bomba.tipoBomba.id : '',
                        modelo: bomba && bomba.modelo ? bomba.modelo.id : '',
                        versaoSoftware: bomba ? bomba.versaoSoftware : '',
                        versaoHardware: bomba ? bomba.versaoHardware : '',
                    }}
                    enableReinitialize={true}
                    onSubmit={async (values, { setErrors, resetForm }) => {
                        this.setState({ error: null, submitting: true, sucesses: null });
                       

                        if(id){
                            this.props.editBomba({
                                operativo: values.operativa,
                                tipoBomba: values.tipoBomba,
                                modelo: values.modelo,
                                versaoSoftware: values.versaoSoftware,
                                versaoHardware: values.versaoHardware
                            }, id)
                        }else{
                            this.props.addBomba({
                                serialNumber: values.serialNumber,
                                modelo: values.modelo,
                                operativo: values.operativa,
                                tipoBomba: values.tipoBomba,
                                versaoSoftware: values.versaoSoftware,
                                versaoHardware: values.versaoHardware
                            })
                        }
                    }}
                    render={({
                        isSubmitting,
                        errors,
                        touched,
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
                                        <label>{text("bomba.serial_number")}</label>
                                        <InputText
                                            onChange={e => {
                                                handleChange(e)
                                            }}
                                            onBlur={handleBlur}
                                            value={values.serialNumber}
                                            name="serialNumber"
                                            disabled={id ? true : false}
                                        />
                                    </div>
                                    <div className="field">
                                        <label>{text("bomba.operativa")}</label>
                                        <InputSwitch
                                            onChange={e => {
                                                handleChange(e)
                                            }}
                                            checked={values.operativa}
                                            name="operativa"
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group widths='equal'>
                                    
                                <div className="field required">
                                        <label>{text("bomba.tipo")}</label>
                                        <Dropdown
                                            placeholder={text("bomba.tipo")}
                                            search
                                            selection
                                            options={tipoBombas}
                                            onChange={(e, { value }) => {
                                                setFieldValue('tipoBomba', value)
                                            }}
                                            onBlur={handleBlur}
                                            value={values.tipoBomba}
                                            name="tipoBomba"
                                            noResultsMessage={text("geral.nenhum-resultado-encontrado")}
                                        />
                                    </div>
                                                                   
                                    <div className="field required">
                                        <label>{text("bomba.modelo")}</label>
                                        <Dropdown
                                            placeholder={text("bomba.modelo")}
                                            search
                                            selection
                                            options={modeloOptions}
                                            onChange={(e, { value }) => {
                                                setFieldValue('modelo', value)
                                            }}
                                            onBlur={handleBlur}
                                            value={values.modelo}
                                            name="modelo"
                                            noResultsMessage={text("geral.nenhum-resultado-encontrado")}
                                        />
                                    </div>
                                    
                                </Form.Group>

                                <Form.Group widths='equal'>
                                   
                                    <div className="field">
                                        <label>{text("bomba.versao_software")}</label>
                                        <InputText
                                            onChange={e => {
                                                handleChange(e)
                                            }}
                                            onBlur={handleBlur}
                                            value={values.versaoSoftware}
                                            name="versaoSoftware"
                                        />
                                    </div>
                                    <div className="field">
                                        <label>{text("bomba.versao_hardware")}</label>
                                        <InputText
                                            onChange={e => {
                                                handleChange(e)
                                            }}
                                            onBlur={handleBlur}
                                            value={values.versaoHardware}
                                            name="versaoHardware"
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
                                    to="/gerencia/bombas/"
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
                                    <Icon name='save' /> {bomba ? text("formularios.atualizar") : text("formularios.salvar")}
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
        sucesso : state.bombaReducer.sucesso,
        erro: state.bombaReducer.erro,
        executando : state.bombaReducer.executando,
        erroInsert: state.bombaReducer.erro,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addBomba: (usuario) => dispatch(addBomba(usuario)),
        editBomba: (usuario, id) => dispatch(editBomba(usuario, id)),
        setErro: (erro) => dispatch({type: actions.ERRO_BOMBAS, payload: erro})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BombaForm);