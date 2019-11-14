import React, { Component } from 'react';
import { Header, Message, Form, Breadcrumb } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

import api from '../../../services/api';
import { text } from '../../../services/locales';
import AssociacaoContratoForm from '../../../components/AssociacaoContratoForm';
import AssociacaoContratoSelectPanel from '../../../components/AssociacaoContratoSelectPanel';
import MainActionsForm from '../../../components/MainActionsForm';

class AssociacaoDispositivoContrato  extends Component {

    state = {
        error : null,
        sucesses : null,
        contratante : null,
        contratantesOptions : [],
        contrato : null,
        contratosOptions : [],
        modelosDispositivosContratadosOptions : [],
        modelo : null,
        dispositivoAssociadoAux : null,
        dispositivoNaoAssociadoAux : null,
        dispositivosAssociadosOptions : [],
        dispositivosNaoAssociadosOptions : [],
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

            let modelosDispositivosContratados = [];
            if (contrato.condicoesContratuais.length > 0) {
                contrato.condicoesContratuais.forEach(condicao => {
                    
                    if (Array.isArray(condicao.modelosDispositivosContratados)) {
                        condicao.modelosDispositivosContratados.forEach(modelo => {
                            modelosDispositivosContratados.push(
                                {
                                    key: modelo.modeloDispositivo.id,
                                    text: modelo.modeloDispositivo.nome,
                                    value: modelo.modeloDispositivo,
                                }
                            )
                        });                        
                    }
                });   
            }
            this.setState({modelosDispositivosContratadosOptions : modelosDispositivosContratados});
        }
    }

    setContrato = (contrato) => {
        this.setState({contrato : contrato});
        this.handleContratoSelecionado(contrato);
    }

    setModelo = (modelo) => {
        this.setState({modelo : modelo});
        this.handleListasDispositivos(this.state.contrato,modelo);
    }

    handleListasDispositivos = async (contrato, modelo) => {

        let quantidade = 0;
        contrato.condicoesContratuais.forEach(condicao => {                    
            if (Array.isArray(condicao.modelosDispositivosContratados)) {
                condicao.modelosDispositivosContratados.forEach(modeloContratado => {
                    if (modeloContratado.modeloDispositivo.id === modelo.id) {
                        quantidade = modeloContratado.quantidadeContratada;
                    }
                });                        
            }
        }); 
        this.setState({quantidadePlanejada : quantidade});

        let dispositivosAssociados = [];
        let response = await api.get("/contratos/alocacoes/contrato/" + contrato.id + "/dispositivos");
        response.data.forEach(item => {
            let index = modelo.dispositivos.findIndex(dispositivoModelo => dispositivoModelo.id === item.dispositivo.id);

            if (index >= 0) {
                if (!item.desassociacao) {
                    dispositivosAssociados.push(item.dispositivo);
                }
            }
        });
        this.setState({dispositivosAssociadosOptions : dispositivosAssociados});
        
        response = await api.get("/contratos/alocacoes/dispositivos");
        let allDispositivosAssociados = [];
        response.data.forEach(item => {
            if (!item.desassociacao) {
                allDispositivosAssociados.push(item.dispositivo);
            }
        });

        let dispositivosNaoAssociados = [];
        if (modelo.dispositivos) {
            dispositivosNaoAssociados = [...modelo.dispositivos];       
        }

        if (allDispositivosAssociados.length > 0 && Array.isArray(dispositivosNaoAssociados)) {
            allDispositivosAssociados.forEach(dispAssoc => {
                let index = dispositivosNaoAssociados.findIndex(dispNaoAssoc => dispNaoAssoc.id === dispAssoc.id);

                if (index >= 0) {
                    dispositivosNaoAssociados.splice(index,1);
                }
            });
        }

        this.setState({dispositivosNaoAssociadosOptions : dispositivosNaoAssociados});
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

        this.setState({dispositivoAssociadoAux : null});
        this.setState({dispositivoNaoAssociadoAux : null});
        this.setState({dispositivosAssociadosOptions : []});
        this.setState({dispositivosNaoAssociadosOptions : []});

        return <Redirect to="/associacao/dispositivo-contrato" /> ;
    }

    setDispositivoAssociado = (value) => {

        this.setState({ dispositivoAssociadoAux : value});
    }

    setDispositivoNaoAssociado = (value) => {
        this.setState({ dispositivoNaoAssociadoAux : value});
    }


    isLimiteExcedido = (valorCompara) => {
        let quantidadePlanejada = this.state.quantidadePlanejada;
        if (parseInt(valorCompara) > parseInt(quantidadePlanejada)) return true;
        return false;
    }

    addSelectedDispositivoNaoAssociado = () => {
        let dispositivoNaoAssociadoAux       = this.state.dispositivoNaoAssociadoAux;
        let dispositivosNaoAssociadosOptions = this.state.dispositivosNaoAssociadosOptions;
        let dispositivosAssociadosOptions    = this.state.dispositivosAssociadosOptions;
       
        if (this.isLimiteExcedido(dispositivosAssociadosOptions.length)) {
            this.setState({disableInsert : true});
        }

        if (dispositivoNaoAssociadoAux) {
            dispositivosAssociadosOptions.push(dispositivoNaoAssociadoAux);

            let index = dispositivosNaoAssociadosOptions.findIndex(opt => opt.id === dispositivoNaoAssociadoAux.id);
            dispositivosNaoAssociadosOptions.splice(index,1);
         
            this.setState({dispositivoNaoAssociadoAux : null});
            this.setState({dispositivoAssociadoAux : null});
            this.setState({dispositivosNaoAssociadosOptions : dispositivosNaoAssociadosOptions});
            this.setState({dispositivosAssociadosOptions : dispositivosAssociadosOptions});
        }
    }

    addAllDispositivoNaoAssociado = () => {
        let dispositivosNaoAssociadosOptions = this.state.dispositivosNaoAssociadosOptions;
        let dispositivosAssociadosOptions = this.state.dispositivosAssociadosOptions;
        let total = dispositivosAssociadosOptions.length + dispositivosNaoAssociadosOptions.length;

        if (this.isLimiteExcedido(total)) {
            this.setState({disableInsert : true});
        }

        dispositivosAssociadosOptions  = [...dispositivosAssociadosOptions, ...dispositivosNaoAssociadosOptions];
    
        this.setState({dispositivosAssociadosOptions : dispositivosAssociadosOptions});
        this.setState({dispositivosNaoAssociadosOptions : []});
        this.setState({dispositivoNaoAssociadoAux : null});       
        this.setState({dispositivoAssociadoAux : null}); 
    }

    removeSelectedDispositivoAssociado = () => {
        let dispositivoAssociadoAux = this.state.dispositivoAssociadoAux;
        let dispositivosNaoAssociadosOptions = this.state.dispositivosNaoAssociadosOptions;
        let dispositivosAssociadosOptions = this.state.dispositivosAssociadosOptions;


        if (dispositivoAssociadoAux) {
            dispositivosNaoAssociadosOptions.push(dispositivoAssociadoAux);  

            let index = dispositivosAssociadosOptions.findIndex(opt => opt.id === dispositivoAssociadoAux.id);
            dispositivosAssociadosOptions.splice(index,1);

            this.setState({dispositivoAssociadoAux : null});
            this.setState({dispositivoNaoAssociadoAux : null}); 
            this.setState({dispositivosAssociadosOptions : dispositivosAssociadosOptions});
            this.setState({dispositivosNaoAssociadosOptions : dispositivosNaoAssociadosOptions});
            this.setState({disableInsert : false});
        }
    }

    removeAllDispositivoAssociado = () => {
        let dispositivosNaoAssociadosOptions = this.state.dispositivosNaoAssociadosOptions;
        let dispositivosAssociadosOptions = this.state.dispositivosAssociadosOptions;

        dispositivosNaoAssociadosOptions  = [...dispositivosNaoAssociadosOptions, ...dispositivosAssociadosOptions];

        this.setState({dispositivosNaoAssociadosOptions : dispositivosNaoAssociadosOptions});
        this.setState({dispositivosAssociadosOptions : []});
        this.setState({dispositivoAssociadoAux : null});
        this.setState({dispositivoNaoAssociadoAux : null}); 
        this.setState({disableInsert : false});
    }

    saveDispositivosAssociados = async () => {
        let dispositivosAssociadosOptions = this.state.dispositivosAssociadosOptions;
        let contrato = this.state.contrato;

        dispositivosAssociadosOptions.map(dispositivo => {
            dispositivo.tipo = dispositivo.tipo.id;
            dispositivo.modelo = dispositivo.modelo.id;
            return dispositivo;
        });

        await api.post("/contratos/alocacao/contrato/" + contrato.id + "/dispositivos", dispositivosAssociadosOptions);
        this.setState({sucesses : text("associacao-dispositivo-contrato.sucesso-insert")});
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
            dispositivoAssociadoAux, 
            dispositivoNaoAssociadoAux, 
            dispositivosAssociadosOptions, 
            dispositivosNaoAssociadosOptions,
            error,
            sucesses, 
        } = this.state;

        return (
            <>
                <Header as="h1" > 

                    <Header.Content>
                        {text("associacao-dispositivo-contrato.titulo")}&nbsp;{contrato ? contrato.numero : ""}
                    </Header.Content>

                    <Header.Subheader>
                        <Breadcrumb>

                            {contratante &&
                                <Breadcrumb.Section
                                onClick={() => this.toContratante()}
                                >
                                    {text("associacao-dispositivo-contrato.contratante")}
                                </Breadcrumb.Section>
                            }

                            {!contratante &&
                                <Breadcrumb.Section    
                                    active                                
                                >
                                    {text("associacao-dispositivo-contrato.contratante")}
                                </Breadcrumb.Section>
                            }

                            <Breadcrumb.Divider icon='right chevron' />

                            {contrato &&
                                <Breadcrumb.Section
                                    onClick={() => this.toContrato()}
                                >
                                    {text('associacao-dispositivo-contrato.contrato')}
                                </Breadcrumb.Section>
                            }

                            {!contrato &&  contratante &&
                                <Breadcrumb.Section active >
                                    {text('associacao-dispositivo-contrato.contrato')}
                                </Breadcrumb.Section>
                            }

                            {!contrato &&  !contratante &&
                                <Breadcrumb.Section >
                                    {text('associacao-dispositivo-contrato.contrato')}
                                </Breadcrumb.Section>
                            }

                            <Breadcrumb.Divider icon='right chevron' />

                            {modelo &&
                                <Breadcrumb.Section
                                    onClick={() => this.toModelo()}
                                >
                                    {text('associacao-dispositivo-contrato.modelo-dispositivo')}
                                </Breadcrumb.Section>
                            }

                            {!modelo && contrato &&
                                <Breadcrumb.Section 
                                    active                                   
                                >
                                    {text('associacao-dispositivo-contrato.modelo-dispositivo')}
                                </Breadcrumb.Section>
                            }

                            {!modelo && !contrato &&
                                <Breadcrumb.Section>
                                    {text('associacao-dispositivo-contrato.modelo-dispositivo')}
                                </Breadcrumb.Section>
                            }

                            <Breadcrumb.Divider icon='right chevron' />

                            {!modelo &&
                                <Breadcrumb.Section                                
                                >
                                    {text('associacao-dispositivo-contrato.associacao')}
                                </Breadcrumb.Section>
                            }

                            {modelo &&
                                <Breadcrumb.Section    
                                    active                            
                                >
                                    {text('associacao-dispositivo-contrato.associacao')}
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
                        modelosItensOptions={this.state.modelosDispositivosContratadosOptions}    
                        modelo={modelo}    
                        setModelo={this.setModelo}    
                        labelContrato={text('associacao-dispositivo-contrato.contrato')}
                        labelContratante={text('associacao-dispositivo-contrato.contratante')}
                        labelModelo={text('associacao-dispositivo-contrato.modelo-dispositivo')}     
                    >
                        {this.state.modelo && 
                            <>
                                <AssociacaoContratoSelectPanel 
                                    itemAssociadoAux={dispositivoAssociadoAux}
                                    itemNaoAssociadoAux={dispositivoNaoAssociadoAux}
                                    itensAssociadosOptions={dispositivosAssociadosOptions}
                                    itensNaoAssociadosOptions={dispositivosNaoAssociadosOptions}
                                    setItemAssociado={this.setDispositivoAssociado}
                                    setItemNaoAssociado={this.setDispositivoNaoAssociado}
                                    addSelectedItemNaoAssociado={this.addSelectedDispositivoNaoAssociado}
                                    addAllItemNaoAssociado={this.addAllDispositivoNaoAssociado}
                                    removeSelectedItemAssociado={this.removeSelectedDispositivoAssociado}
                                    removeAllItemAssociado={this.removeAllDispositivoAssociado}
                                    quantidadePlanejada={this.state.quantidadePlanejada}
                                    fieldToShow="macFormatado"
                                    disableInsertNew={this.state.disableInsert}
                                    labelNaoAssociado={text('associacao-dispositivo-contrato.dispositivos-nao-associados')}
                                    labelAssociado={text('associacao-dispositivo-contrato.dispositivos-associados')}
                                />

                                <MainActionsForm
                                    cancelOnClick={this.resetStates}
                                    insertOnClick={this.saveDispositivosAssociados}  
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

export default AssociacaoDispositivoContrato;