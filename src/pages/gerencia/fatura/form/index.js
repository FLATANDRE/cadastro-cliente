import React, { Component } from 'react';
import { connect } from 'react-redux';
import {  Form, Header, Divider,  Message } from 'semantic-ui-react';
import { Formik } from "formik";
import { Redirect } from 'react-router-dom';

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import { RESET_STATES_FATURAS } from '../../../../store/actions';
import { verificaCasasDecimais, formatPrecoValue } from '../../../../utils/functions';
import api from '../../../../services/api';
import { text } from '../../../../services/locales';
import { addFatura, editFatura } from '../../../../store/actionCreators/faturaAction';

import MainActionsForm from '../../../../components/MainActionsForm';
import TableFatura from '../../../../components/TableFatura';
import FaturaFormFields from '../../../../components/FaturaFormFields';

class FaturaForm extends Component {

    state = {
        fatura: null,
        carregandoForm: false,
        disabled: true,
        pessoaJuridicaOptions : null,
        contratoOptions : null,
        naturezaOptions : null,
        tipoItemOptions : null,
        tipoItemLabel : '--',
        listaItensFatura : [],
        itemFatura : {
                    precoUnitario: "0,00",
                    quantidade : '',
                    item : null,
                    tipoItem : null
                },
        objetoInseridoItem : true,
        backTo: '/gerencia/faturas'
    };

    tipoItem = {
        dispositivo : 'dispositivo',
        equipamento : 'equipamento',
        insumo : 'insumo',
    }

    async componentDidMount() {

        if (this.props.location.state != null) {
            this.setState({ backTo: this.props.location.state.backTo })
        }

        this.props.resetStates();
        this.setState({ loading: true });

        let options = [];
        let response = await api.get("/pessoal/pessoas-juridicas/all");
        response.data.forEach(pj => {
            options.push({ key: pj.id, value: pj, text: pj.nome + "(" + pj.cnpj + ")" });
        })
        this.setState({ pessoaJuridicaOptions: options });

        options = [];
        response = await api.get("/contratos/all");
        response.data.forEach(contrato => {
            options.push({ key: contrato.id, value: contrato, text: contrato.numero });
        })
        this.setState({ contratoOptions: options });

        options = [];
        response = await api.get("/faturas/natureza");
        response.data.forEach(natureza => {
            options.push({ key: natureza, value: natureza, text: natureza });
        })
        this.setState({ naturezaOptions: options });

        options = [];
        options.push({ key: this.tipoItem.dispositivo, value: this.tipoItem.dispositivo, text: this.tipoItem.dispositivo.toUpperCase() });
        options.push({ key: this.tipoItem.equipamento, value: this.tipoItem.equipamento, text: this.tipoItem.equipamento.toUpperCase() });
        options.push({ key: this.tipoItem.insumo, value: this.tipoItem.insumo, text: this.tipoItem.insumo.toUpperCase() });
        this.setState({ tipoItemOptions: options });

        if (this.props.match.params.id) {
            const { id } = this.props.match.params;
            const response = await api.get("/faturas/" + id);
            const fatura = response.data;
            let lista = [];

            fatura.data = fatura.dataFormatada;

            let pj = fatura.pessoaJuridica;
            fatura.pessoaJuridica = {
                cnpj : pj.cnpj,
                cnpjFormatado : pj.cnpjFormatado,
                id : pj.id,
                nome : pj.nome,
            }

            let contrato = fatura.contratos.length > 0 ? fatura.contratos[0] : null;
            if (contrato) {
                fatura.contrato = {
                    id : contrato.id,
                    numero : contrato.numero,
                }
            }

            this.setState({ fatura : fatura});

            let aux = [];
            fatura.itensModeloDispositivo.forEach(item => {
                aux.push({
                        tipoItem : this.tipoItem.dispositivo,
                        item : item.modeloDispositivo,
                        precoUnitario : item.precoUnitario,
                        quantidade : item.quantidade,
                    });
            });
            lista.push(...aux);

            aux = [];
            fatura.itensModeloEquipamento.forEach(item => {
                aux.push({
                        tipoItem : this.tipoItem.equipamento,
                        item : item.modeloEquipamento,
                        precoUnitario : item.precoUnitario,
                        quantidade : item.quantidade,
                    });
            });
            lista.push(...aux);

            aux = [];
            fatura.itensInsumo.forEach(item => {
                aux.push({
                        tipoItem : this.tipoItem.insumo,
                        item : item.tipoInsumo,
                        precoUnitario : item.precoUnitario,
                        quantidade : item.quantidade,
                    });
            });
            lista.push(...aux);

            this.setState({ listaItensFatura : lista});
        }
        this.setState({ loading: false });
    }

    
    handleChooseTipoItem = async (tipo) => {

        this.setState({ itemOptions: null });
        let options = [];
        let response = null;
        if (tipo === this.tipoItem.dispositivo) {            
            response = await api.get("/dispositivos/modelos");
            response.data.content.forEach(item => {
                if (!item.desconhecido) {
                    options.push({
                        key: item.id,
                        text: item.nome,
                        value: item,
                    });
                }
                return null;
            });
            this.setState({ tipoItemLabel: 'fatura.dispositivos' });
            
            
        } else if (tipo === this.tipoItem.equipamento) {
            response = await api.get("/equipamentos/modelos");
            response.data.content.forEach(item => {
                if (item.nome.toLowerCase() !== 'desconhecido') {
                    options.push({
                        key: item.id,
                        text: item.nome,
                        value: item,
                    });
                }
                return null;
            });
            this.setState({ tipoItemLabel: 'fatura.equipamentos' });
            

        } else if (tipo === this.tipoItem.insumo) {
            response = await api.get("/insumos/tipos");
            response.data.content.forEach(item => {                
                options.push({
                    key: item.id,
                    text: item.nome,
                    value: item,
                });
            });
            this.setState({ tipoItemLabel: 'fatura.insumos' });
            
        }

        this.setState({ itemOptions: options });
    }

    handleCurrencyFormat = (name, object) => {
        this.setState({ itemFatura: verificaCasasDecimais(name, object) });        
    }

    setItemField = (name, evt) => {
         if (evt.target || evt) {
            let itemFatura = this.state.itemFatura;

            if (itemFatura) {
                itemFatura[name] = evt.target ? evt.target.value : evt;
                this.setState({ itemFatura: itemFatura });
                if (itemFatura.tipoItem && itemFatura.item && itemFatura.quantidade && itemFatura.precoUnitario) {
                    this.setState({ objetoInseridoItem: false });
                } else {
                    this.setState({ objetoInseridoItem: true });
                }
            } 
        }
    }

    addItemFatura = () => {
        let itemFatura = this.state.itemFatura;
        let lista = this.state.listaItensFatura;

        if (itemFatura) {
            lista.push(itemFatura);
            this.setState({ listaItensFatura :  lista});
            this.setState({ itemFatura :  {
                    precoUnitario: "0,00",
                    quantidade : '',
                    item : null,
                    tipoItem : null
                } });
            this.setState({ objetoInseridoItem: true });
        }
    }

    
    removeItemFatura = (index) => {
        let lista = this.state.listaItensFatura;
        lista.splice(index, 1);
        this.setState({ listaItensFatura: lista });
    }

    configuraListasItens = (lista, fatura) => {

        let itensModeloDispositivo = [];
        let itensModeloEquipamento = [];
        let itensInsumo = [];

        if (lista.length > 0 && fatura) {

            lista.forEach(item => {

                if (item.item.fabricante) {
                    item.item.fabricante = item.item.fabricante.id;
                }

                if (isNaN(item.precoUnitario)) {
                    item.precoUnitario = formatPrecoValue(item.precoUnitario);
                }

                if (item.tipoItem === this.tipoItem.dispositivo) {
                    itensModeloDispositivo.push({
                        modeloDispositivo : item.item,
                        precoUnitario : item.precoUnitario,
                        quantidade : item.quantidade,
                    });
                } else if(item.tipoItem === this.tipoItem.equipamento) {
                    itensModeloEquipamento.push({
                        modeloEquipamento : item.item,
                        precoUnitario : item.precoUnitario,
                        quantidade : item.quantidade,
                    });
                } else if (item.tipoItem === this.tipoItem.insumo) {
                    itensInsumo.push({
                        tipoInsumo : item.item,
                        precoUnitario : item.precoUnitario,
                        quantidade : item.quantidade,
                    });
                }
            });

            fatura.itensModeloDispositivo = itensModeloDispositivo;
            fatura.itensModeloEquipamento = itensModeloEquipamento;
            fatura.itensInsumo = itensInsumo;
        }

        return fatura;
    }

    render() {

        const { fatura, loading, backTo } = this.state;

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
                    {text('fatura.titulo-form')}
                </Header>

                {this.props.erroInsert &&
                    <Message negative>
                        <p>{text('fatura.mensagem-erro')}</p>
                        <b>{text('fatura.mensagem-erro-detalhes')}:</b> {this.props.erroInsert }
                    </Message>
                }

                <Formik
                    initialValues={{
                        numeroNotaFiscal: fatura ? fatura.numeroNotaFiscal : '',
                        data: fatura ? fatura.data : '',
                        descricao: fatura ? fatura.descricao : '',
                        natureza: fatura ? fatura.natureza : '',
                        pessoaJuridica: fatura ? fatura.pessoaJuridica : null,
                        contrato : fatura ? fatura.contrato : null
                    }}
                    enableReinitialize={true}
                    onSubmit={async (values) => {
                        let fatura = Object.assign({}, values);
                        try {
                            let listaItens = this.state.listaItensFatura;
                            fatura = this.configuraListasItens(listaItens, fatura);

                            if (this.state.fatura) {//editando um item
                                fatura.id = this.state.fatura.id;
                                this.props.editFatura(fatura);
                            } else {//novo item                            
                                this.props.addFatura(fatura);
                            }
                        } catch (reason) {
                        }
                    }}
                    render={({
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

                                <FaturaFormFields
                                    addItemFatura={this.addItemFatura}
                                    contratoOptions={this.state.contratoOptions}
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    handleChoose={this.handleChooseTipoItem}
                                    handleCurrencyFormat={this.handleCurrencyFormat}
                                    itemFatura={this.state.itemFatura}
                                    itemOptions={this.state.itemOptions}
                                    naturezaOptions={this.state.naturezaOptions}
                                    objetoInseridoItem={this.state.objetoInseridoItem}
                                    pessoaJuridicaOptions={this.state.pessoaJuridicaOptions}
                                    setFieldValue={setFieldValue}
                                    setItemField={this.setItemField}
                                    tipoItemLabel={this.state.tipoItemLabel}
                                    tipoItemOptions={this.state.tipoItemOptions}
                                    values={values}
                                />

                                <Form.Group>
                                    <TableFatura
                                        listaItensFatura={this.state.listaItensFatura}
                                        handleRemove={this.removeItemFatura}
                                    />                               
                                </Form.Group>

                                <br />
                                <Divider />

                                <MainActionsForm
                                    cancelTo={backTo}
                                    isInserindo={this.props.inserindo}
                                    objectToCheck={fatura}
                                />

                            </Form>
                        )}
                />
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        erroInsert: state.faturaReducer.erro,
        sucessoInsert: state.faturaReducer.sucesso,
        inserindo: state.faturaReducer.executando,        
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addFatura: (fatura) => dispatch(addFatura(fatura)),
        editFatura: (fatura) => dispatch(editFatura(fatura)),
        resetStates: () => dispatch({ type: RESET_STATES_FATURAS }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FaturaForm);