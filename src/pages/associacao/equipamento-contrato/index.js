import React, { Component } from 'react';
import { Header, Message, Form, Breadcrumb } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

import api from '../../../services/api';
import { text } from '../../../services/locales';
import AssociacaoContratoForm from '../../../components/AssociacaoContratoForm';
import AssociacaoContratoSelectPanel from '../../../components/AssociacaoContratoSelectPanel';
import MainActionsForm from '../../../components/MainActionsForm';

class AssociacaoEquipamentoContrato  extends Component {

    state = {
        error : null,
        sucesses : null,
        contratante : null,
        contratantesOptions : [],
        contrato : null,
        contratosOptions : [],
        modelosEquipamentosContratadosOptions : [],
        modelo : null,
        equipamentoAssociadoAux : null,
        equipamentoNaoAssociadoAux : null,
        equipamentosAssociadosOptions : [],
        equipamentosNaoAssociadosOptions : [],
        quantidadePlanejada : 0,        
        disableInsert : false,
    };

    async componentDidMount() {

        const response = await api.get("/pessoal/pessoas-juridicas/all");
        const lista = response.data.map((item) => ({
            key: item.id,
            text: item.nome + " (" + item.cnpjFormatado + ")",
            value: item,
        }));

        this.setState({contratantesOptions : lista});  
    }

    setContratante = (contratante) => {
        this.setState({error : null});
        this.setState({sucesses : null});
        this.setState({contrato : null});
        this.setState({modelo : null});        
        this.setState({contratante : contratante});  

        this.handleContratanteSelecionado(contratante);
    }

    handleContratanteSelecionado = async (contratante) => {

        if (contratante.nome) {

            const response = await api.get("/contratos?q=" + contratante.cnpj);
            let lista = response.data.content.map((item) => ({
                key: item.id,
                text: item.numero,
                value: item,
            }));

            this.setState({contratosOptions : lista});
        }
    }

    handleContratoSelecionado = (contrato) => {

        if (contrato.id) {

            let modelosEquipamentosContratados = [];
            if (contrato.condicoesContratuais.length > 0) {
                contrato.condicoesContratuais.forEach(condicao => {
                    
                    if (Array.isArray(condicao.modelosEquipamentosContratados)) {
                        condicao.modelosEquipamentosContratados.forEach(modelo => {
                            modelosEquipamentosContratados.push(
                                {
                                    key: modelo.modeloEquipamento.id,
                                    text: modelo.modeloEquipamento.nome,
                                    value: modelo.modeloEquipamento,
                                }
                            )
                        });                        
                    }
                });   
            }
            this.setState({modelosEquipamentosContratadosOptions : modelosEquipamentosContratados});
        }
    }

    setContrato = (contrato) => {
        this.setState({contrato : contrato});
        this.handleContratoSelecionado(contrato);
    }

    setModelo = (modelo) => {
        this.setState({modelo : modelo});
        this.handleListasEquipamentos(this.state.contrato,modelo);
    }

    handleListasEquipamentos = async (contrato, modelo) => {

        let quantidade = 0;
        contrato.condicoesContratuais.forEach(condicao => {                    
            if (Array.isArray(condicao.modelosEquipamentosContratados)) {
                condicao.modelosEquipamentosContratados.forEach(modeloContratado => {
                    if (modeloContratado.modeloEquipamento.id === modelo.id) {
                        quantidade = modeloContratado.quantidadeContratada;
                    }
                });                        
            }
        }); 
        this.setState({quantidadePlanejada : quantidade});

        let equipamentosAssociados = [];
        let response = await api.get("/contratos/alocacoes/contrato/" + contrato.id + "/equipamentos");
        response.data.forEach(item => {
            let index = modelo.equipamentos.findIndex(equipamentoModelo => equipamentoModelo.id === item.equipamento.id);

            if (index >= 0) {
                if (!item.desassociacao) {
                    equipamentosAssociados.push(item.equipamento);
                }
            }
        });
        this.setState({equipamentosAssociadosOptions : equipamentosAssociados});
        
        response = await api.get("/contratos/alocacoes/equipamentos");
        let allEquipamentosAssociados = [];
        response.data.forEach(item => {
            if (!item.desassociacao) {
                allEquipamentosAssociados.push(item.equipamento);
            }
        });

        let equipamentosNaoAssociados = [];
        if (modelo.equipamentos) {
            equipamentosNaoAssociados = [...modelo.equipamentos];        
        }

        if (allEquipamentosAssociados.length > 0 && Array.isArray(equipamentosNaoAssociados)) {
            allEquipamentosAssociados.forEach(equipAssoc => {
                let index = equipamentosNaoAssociados.findIndex(equipNaoAssoc => equipNaoAssoc.id === equipAssoc.id);

                if (index >= 0) {
                    equipamentosNaoAssociados.splice(index,1);
                }
            });
        }

        this.setState({equipamentosNaoAssociadosOptions : equipamentosNaoAssociados});
        this.setState({disableInsert : false});
    }

    resetStates = (clearMessage = true) => {
        this.setState({contratante : null });
        this.setState({contrato : null });
        this.setState({modelo : null });

        if (clearMessage) {
            this.setState({sucesses : null});
            this.setState({error : null });
        }

        this.setState({equipamentoAssociadoAux : null});
        this.setState({equipamentoNaoAssociadoAux : null});
        this.setState({equipamentosAssociadosOptions : []});
        this.setState({equipamentosNaoAssociadosOptions : []});

        return <Redirect to="/associacao/equipamento-contrato" /> ;
    }

    setEquipamentoAssociado = (value) => {

        this.setState({ equipamentoAssociadoAux : value});
    }

    setEquipamentoNaoAssociado = (value) => {
        this.setState({ equipamentoNaoAssociadoAux : value});
    }


    isLimiteExcedido = (valorCompara) => {
        let quantidadePlanejada = this.state.quantidadePlanejada;
        if (parseInt(valorCompara) > parseInt(quantidadePlanejada)) return true;
        return false;
    }

    addSelectedEquipamentoNaoAssociado = () => {
        let equipamentoNaoAssociadoAux       = this.state.equipamentoNaoAssociadoAux;
        let equipamentosNaoAssociadosOptions = this.state.equipamentosNaoAssociadosOptions;
        let equipamentosAssociadosOptions    = this.state.equipamentosAssociadosOptions;
       
        if (this.isLimiteExcedido(equipamentosAssociadosOptions.length)) {
            this.setState({disableInsert : true});
        }

        if (equipamentoNaoAssociadoAux) {
            equipamentosAssociadosOptions.push(equipamentoNaoAssociadoAux);

            let index = equipamentosNaoAssociadosOptions.findIndex(opt => opt.id === equipamentoNaoAssociadoAux.id);
            equipamentosNaoAssociadosOptions.splice(index,1);
         
            this.setState({equipamentoNaoAssociadoAux : null});
            this.setState({equipamentoAssociadoAux : null});
            this.setState({equipamentosNaoAssociadosOptions : equipamentosNaoAssociadosOptions});
            this.setState({equipamentosAssociadosOptions : equipamentosAssociadosOptions});
        }
    }

    addAllEquipamentoNaoAssociado = () => {
        let equipamentosNaoAssociadosOptions = this.state.equipamentosNaoAssociadosOptions;
        let equipamentosAssociadosOptions = this.state.equipamentosAssociadosOptions;
        let total = equipamentosAssociadosOptions.length + equipamentosNaoAssociadosOptions.length;

        if (this.isLimiteExcedido(total)) {
            this.setState({disableInsert : true});
        }

        equipamentosAssociadosOptions  = [...equipamentosAssociadosOptions, ...equipamentosNaoAssociadosOptions];
    
        this.setState({equipamentosAssociadosOptions : equipamentosAssociadosOptions});
        this.setState({equipamentosNaoAssociadosOptions : []});
        this.setState({equipamentoNaoAssociadoAux : null});       
        this.setState({equipamentoAssociadoAux : null}); 
    }

    removeSelectedEquipamentoAssociado = () => {
        let equipamentoAssociadoAux = this.state.equipamentoAssociadoAux;
        let equipamentosNaoAssociadosOptions = this.state.equipamentosNaoAssociadosOptions;
        let equipamentosAssociadosOptions = this.state.equipamentosAssociadosOptions;


        if (equipamentoAssociadoAux) {
            equipamentosNaoAssociadosOptions.push(equipamentoAssociadoAux);  

            let index = equipamentosAssociadosOptions.findIndex(opt => opt.id === equipamentoAssociadoAux.id);

            if (index > -1) {
               equipamentosAssociadosOptions.splice(index,1);
            }

            this.setState({equipamentoAssociadoAux : null});
            this.setState({equipamentoNaoAssociadoAux : null}); 
            this.setState({equipamentosAssociadosOptions : equipamentosAssociadosOptions});
            this.setState({equipamentosNaoAssociadosOptions : equipamentosNaoAssociadosOptions});
            this.setState({disableInsert : false});
        }
    }

    removeAllEquipamentoAssociado = () => {
        let equipamentosNaoAssociadosOptions = this.state.equipamentosNaoAssociadosOptions;
        let equipamentosAssociadosOptions = this.state.equipamentosAssociadosOptions;

        equipamentosNaoAssociadosOptions  = [...equipamentosNaoAssociadosOptions, ...equipamentosAssociadosOptions];

        this.setState({equipamentosNaoAssociadosOptions : equipamentosNaoAssociadosOptions});
        this.setState({equipamentosAssociadosOptions : []});
        this.setState({equipamentoAssociadoAux : null});
        this.setState({equipamentoNaoAssociadoAux : null}); 
        this.setState({disableInsert : false});
    }

    saveEquipamentosAssociados = async () => {
        let equipamentosAssociadosOptions = this.state.equipamentosAssociadosOptions;
        let contrato = this.state.contrato;

        equipamentosAssociadosOptions.map(equipamento => {
            equipamento.modelo = equipamento.modelo.id;
            return equipamento;
        });

        await api.post("/contratos/alocacao/contrato/" + contrato.id + "/equipamentos", equipamentosAssociadosOptions);
        this.setState({sucesses : text("associacao-equipamento-contrato.sucesso-insert")});
        this.setState({error : null });

        this.resetStates(false);
    }

    toContratante = () => {
        this.setState({contratante : null,
                        contrato : null,
                        modelo : null});

    }

    toContrato = () => {
        this.setState({contrato : null,
            modelo : null});
    }

    toModelo = () => {
        this.setState({modelo : null});
    }

    render () {

        const { 
            contratante , 
            contrato, 
            modelo, 
            equipamentoAssociadoAux, 
            equipamentoNaoAssociadoAux, 
            equipamentosAssociadosOptions, 
            equipamentosNaoAssociadosOptions,
            error,
            sucesses, 
        } = this.state;

        return (
            <>
                <Header as="h1" > 

                    <Header.Content>
                        {text("associacao-equipamento-contrato.titulo")}&nbsp;{contrato ? contrato.numero : ""}
                    </Header.Content>

                    <Header.Subheader>
                        <Breadcrumb>

                            {contratante &&
                                <Breadcrumb.Section
                                onClick={() => this.toContratante()}
                                >
                                    {text("associacao-equipamento-contrato.contratante")}
                                </Breadcrumb.Section>
                            }

                            {!contratante &&
                                <Breadcrumb.Section    
                                    active                                
                                >
                                    {text("associacao-equipamento-contrato.contratante")}
                                </Breadcrumb.Section>
                            }

                            <Breadcrumb.Divider icon='right chevron' />

                            {contrato &&
                                <Breadcrumb.Section
                                    onClick={() => this.toContrato()}
                                >
                                    {text('associacao-equipamento-contrato.contrato')}
                                </Breadcrumb.Section>
                            }

                            {!contrato &&  contratante &&
                                <Breadcrumb.Section active >
                                    {text('associacao-equipamento-contrato.contrato')}
                                </Breadcrumb.Section>
                            }

                            {!contrato &&  !contratante &&
                                <Breadcrumb.Section >
                                    {text('associacao-equipamento-contrato.contrato')}
                                </Breadcrumb.Section>
                            }

                            <Breadcrumb.Divider icon='right chevron' />

                            {modelo &&
                                <Breadcrumb.Section
                                    onClick={() => this.toModelo()}
                                >
                                    {text('associacao-equipamento-contrato.modelo-equipamento')}
                                </Breadcrumb.Section>
                            }

                            {!modelo && contrato &&
                                <Breadcrumb.Section 
                                    active                                   
                                >
                                    {text('associacao-equipamento-contrato.modelo-equipamento')}
                                </Breadcrumb.Section>
                            }

                            {!modelo && !contrato &&
                                <Breadcrumb.Section>
                                    {text('associacao-equipamento-contrato.modelo-equipamento')}
                                </Breadcrumb.Section>
                            }

                            <Breadcrumb.Divider icon='right chevron' />

                            {!modelo &&
                                <Breadcrumb.Section                                
                                >
                                    {text('associacao-equipamento-contrato.associacao')}
                                </Breadcrumb.Section>
                            }

                            {modelo &&
                                <Breadcrumb.Section    
                                    active                            
                                >
                                    {text('associacao-equipamento-contrato.associacao')}
                                </Breadcrumb.Section>
                            }

                        </Breadcrumb>
                    </Header.Subheader>
                </Header>

                {error && <Message negative>{error}</Message>}
                {sucesses && <Message positive>{sucesses}</Message>}

                <Form size='large' className="form">
                    <AssociacaoContratoForm
                        contratante={contratante}
                        contratantesOptions={this.state.contratantesOptions}
                        setContratante={this.setContratante}
                        contrato={contrato}
                        contratosOptions={this.state.contratosOptions}
                        setContrato={this.setContrato}   
                        modelosItensOptions={this.state.modelosEquipamentosContratadosOptions}    
                        modelo={modelo}    
                        setModelo={this.setModelo}      
                        labelContrato={text('associacao-equipamento-contrato.contrato')}
                        labelContratante={text('associacao-equipamento-contrato.contratante')}
                        labelModelo={text('associacao-equipamento-contrato.modelo-equipamento')}
                    >
                        {this.state.modelo && 
                            <>
                                <AssociacaoContratoSelectPanel 
                                    itemAssociadoAux={equipamentoAssociadoAux}
                                    itemNaoAssociadoAux={equipamentoNaoAssociadoAux}
                                    itensAssociadosOptions={equipamentosAssociadosOptions}
                                    itensNaoAssociadosOptions={equipamentosNaoAssociadosOptions}
                                    setItemAssociado={this.setEquipamentoAssociado}
                                    setItemNaoAssociado={this.setEquipamentoNaoAssociado}
                                    addSelectedItemNaoAssociado={this.addSelectedEquipamentoNaoAssociado}
                                    addAllItemNaoAssociado={this.addAllEquipamentoNaoAssociado}
                                    removeSelectedItemAssociado={this.removeSelectedEquipamentoAssociado}
                                    removeAllItemAssociado={this.removeAllEquipamentoAssociado}
                                    quantidadePlanejada={this.state.quantidadePlanejada}
                                    fieldToShow="serialNumber"
                                    disableInsertNew={this.state.disableInsert}
                                    labelNaoAssociado={text('associacao-equipamento-contrato.equipamentos-nao-associados')}
                                    labelAssociado={text('associacao-equipamento-contrato.equipamentos-associados')}
                                />

                                <MainActionsForm
                                    cancelOnClick={this.resetStates}
                                    insertOnClick={this.saveEquipamentosAssociados}  
                                    disableInsertNew={this.state.disableInsert}                                 
                                />
                            </>
                        }
                        
                    </AssociacaoContratoForm>
                </Form>

            </>
        );
    }

}


export default AssociacaoEquipamentoContrato;