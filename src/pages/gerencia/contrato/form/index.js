import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Header, Divider, Icon, Message, Modal, Grid } from 'semantic-ui-react';
import { Formik } from "formik";
import api from '../../../../services/api';
import { text } from '../../../../services/locales';
import { Redirect } from 'react-router-dom';

//Reactprime
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { addContrato, editContrato } from '../../../../store/actionCreators/contratoAction';
import { filterPessoa } from '../../../../store/actionCreators/pessoaAction';
import { pessoaTypes, tiposObjetoContratado } from '../../../../utils/types';
import { limparCampo, verificaCasasDecimais, deepCopy, formatPrecoValue } from '../../../../utils/functions';
import ModeloDispositivoModalForm from '../../../../components/ModeloDispositivoModalForm';
import ModeloEquipamentoModalForm from '../../../../components/ModeloEquipamentoModalForm';
import LocalizacaoPlanejadaModalForm from '../../../../components/LocalizacaoPlanejadaModalForm';
import InsumoModalForm from '../../../../components/InsumoModalForm';
import TableContrato from '../../../../components/TableContrato';
import CondicaoContratualFormFields from '../../../../components/CondicaoContratualFormFields';
import ContratoFormFields from '../../../../components/ContratoFormFields';
import MainActionsForm from '../../../../components/MainActionsForm';

class ContratoForm extends Component {

    TRANSITION_ANIMATION = 'scale';
    TRANSITION_DURATION = 500;

    state = {
        contrato: null,
        id: this.props.match.params.id,
        tipoContratoOptions: null,
        modeloDispositivoOptions: null,
        modeloEquipamentoOptions: null,
        localizacaoFisicaOptions: null,
        pessoasJuridicasOptions: null,
        pessoasFisicasOptions: null,
        infoBasicaCompletas: false,
        tiposInsumosOptions: null,
        objetoInserido: false,
        objetoInseridoLocalizacaoPlanejada: false,
        objetoInseridoModeloDispositivo: false,
        objetoInseridoModeloEquipamento: false,
        objetoInseridoInsumo: false,
        open: false,
        openLocalizacaoPlanejada: false,
        openModeloDispositivo: false,
        openModeloEquipamento: false,
        openInsumo: false,
        listaCondicoesContratuais: [],
        condicaoContratual: {
            dataAssinatura : "",
        },
        localizacaoPlanejada: {},
        listaLocalizacaoPlanejada: [],
        modelo: {
            precoAluguel: "0,00",
            precoInstalacao: "0,00",
            precoManutencao: "0,00",
            precoServico: "0,00",
            precoVenda: "0,00",
        },
        listaModeloDispositivo: [],
        listaModeloEquipamento: [],
        insumo: {
            precoContratado: "0,00",
            tipoInsumo: null,
        },
        listaInsumo: [],
        erroLocalizacao: '',
        erroModeloDispositivo: '',
        erroModeloEquipamento: '',
        erroInsumo: '',
        erroCondicaoContratual : '',
        memento: null,
    };

    async componentDidMount() {

        var options = null;
        this.setState({ loading: true });

        if (!this.state.tiposInsumosOptions) {
            this.carregaTiposInsumos();
        }

        if (!this.state.pessoasFisicasOptions) {
            api.get("/pessoal/pessoas-fisicas/all").then(responsePessoas => {
                const pessoasOptions = responsePessoas.data.map((item) => ({
                    key: item.id,
                    text: item.nome + " (" + item.cpfFormatado + ")",
                    value: item,
                }));
                this.setState({ pessoasFisicasOptions: pessoasOptions });
            })
                .catch(reason => {

                });
        }

        if (!this.state.pessoasJuridicasOptions) {
            api.get("/pessoal/pessoas-juridicas/all").then(responsePessoas => {
                const pessoasOptions = responsePessoas.data.map((item) => ({
                    key: item.id,
                    text: item.nome + " (" + item.cnpjFormatado + ")",
                    value: item,
                }));
                this.setState({ pessoasJuridicasOptions: pessoasOptions });
            })
                .catch(reason => {

                })

        }

        if (!this.state.tipoContratoOptions) {
            api.get("/contratos/tipos").then(response => {
                options = [];
                response.data.forEach(tipo => {
                    options.push({ key: tipo, value: tipo, text: tipo });
                });
                this.setState({ tipoContratoOptions: options });
            })
                .catch(reason => {

                });
        }


        if (this.props.match.params.id) {
            const { id } = this.props.match.params;
            const response = await api.get("/contratos/" + id);
            const contrato = response.data;

            this.setState({ contrato: contrato });
            let listaOrdenada = contrato.condicoesContratuais.sort((item1, item2) => item1.id - item2.id);
            this.setState({ listaCondicoesContratuais: listaOrdenada });

            this.selectLocalizacao(contrato.contratado);
            this.setState({ infoBasicaCompletas: true });

            this.setState({ vinculadoToggle: contrato.vinculadoHolding });
        }

        this.setState({ loading: false });
    }

    selectLocalizacao = async (pj) => {
        if (pj) {
            try {
                const response = await api.get("/predial/localizacao-fisica/pj/" + pj.id);
                const valores = response.data;
                let options = [];
                if (Array.isArray(valores)) {
                    valores.forEach(item => {
                        options.push({ key: item.id, value: item, text: item.nome + " " + this.formataEndereco(item.endereco) });
                    });
                    this.setState({ localizacaoFisicaOptions: options });
                }
            } catch (error) {
                this.setState({ localizacaoFisicaOptions: null });
            }
        }
    }

    formataEndereco = (objEndereco) => {
        return "(Bairro: " + objEndereco.bairro + ", Cidade: " + objEndereco.cidade.nome + ", Logradouro: " + objEndereco.logradouro + ")";
    }

    habilitaCondicoesContratuais = (values) => {
        if (values.contratante && values.contratado &&
            values.contatoCliente && values.contatoInterno &&
            values.tipoContrato && (values.vinculadoHolding !== undefined)) {

            this.setState({ infoBasicaCompletas: true });
        }
    }
    
    show = () => {
        this.setState({ open: true });
        this.setState({ condicaoContratual: null});
        this.setState({ erroCondicaoContratual : ''});
    }

    showLocalizacaoPlanejada = () => {
        this.setState({ erroLocalizacao: '' });
        this.setState({ openLocalizacaoPlanejada: true });
    }

    showModelo = (tipo) => {

        this.carregaListaModelos(tipo);

        if (tipo === tiposObjetoContratado.dispositivo) {
            this.setState({ erroModeloDispositivo: '' });
            this.setState({ openModeloDispositivo: true });

        } else if (tipo === tiposObjetoContratado.equipamento) {
            this.setState({ erroModeloEquipamento: '' });
            this.setState({ openModeloEquipamento: true });
        }
    }

    showInsumos = () => {
        this.setState({ erroInsumo: '' });
        this.setState({ openInsumo: true });
    }

    close = () => {
        this.setState({ open: false });
        this.setState({ objetoInserido: false });
        this.setState({ condicaoContratual: null});
        this.setState({ listaLocalizacaoPlanejada: [] });
        this.setState({ listaModeloDispositivo: [] });
        this.setState({ listaModeloEquipamento: [] });
        this.setState({ listaInsumo: [] });
        this.setState({ erroCondicaoContratual : ''});

        const estadoAnterior = this.state.memento;
        this.setState({ memento: null });
        if (estadoAnterior) {
            let lista = this.state.listaCondicoesContratuais;
            let indexFound = lista.findIndex((obj => obj.id === estadoAnterior.id));
            lista[indexFound] = estadoAnterior;
            this.setState({ listaCondicoesContratuais: lista });
        }
    }

    closeLocalizacaoPlanejada = () => {
        this.setState({ openLocalizacaoPlanejada: false });
        this.setState({ localizacaoPlanejada: {} });
        this.setState({ erroLocalizacao: '' });
    }

    closeModelo = (tipo) => {

        if (tipo === tiposObjetoContratado.dispositivo) {
            this.setState({ openModeloDispositivo: false });
            
        } else if (tipo === tiposObjetoContratado.equipamento) {
            this.setState({ openModeloEquipamento: false });
        }

        this.setState({
            modelo: {
                precoAluguel: "0,00",
                precoInstalacao: "0,00",
                precoManutencao: "0,00",
                precoServico: "0,00",
                precoVenda: "0,00",
            }
        });
    }

    closeInsumos = () => {
        this.setState({ openInsumo: false });
        this.setState({
            insumo: {
                precoContratado: "0,00",
                tipoInsumo: null,
            }
        });
    }

    setFieldLocalizacaoPlanejada = (name, evt) => {

        if (evt.target || evt.nome) {
            let localizacao = this.state.localizacaoPlanejada;

            if (localizacao) {
                localizacao[name] = evt.target ? evt.target.value : evt;
                this.setState({ localizacaoPlanejada: localizacao });

                if (localizacao.localizacaoFisica && localizacao.quantidadePlanejada) {
                    this.setState({ objetoInseridoLocalizacaoPlanejada: true });
                } else {
                    this.setState({ objetoInseridoLocalizacaoPlanejada: false });
                }

            } else {
                localizacao = {};
                this.setState({ localizacaoPlanejada: localizacao });
            }

        }
    }

    setFieldModelo = (name, tipo, evt) => {
        if (evt.target || evt) {
            let modelo = this.state.modelo;

            if (modelo) {

                if (name === 'modelo' && tipo === tiposObjetoContratado.dispositivo) {
                    name += 'Dispositivo';
                } else if (name === 'modelo' && tipo === tiposObjetoContratado.equipamento) {
                    name += 'Equipamento';
                }

                if (evt.fabricante) {
                    evt.fabricante = 0;
                }

                modelo[name] = evt.target ? evt.target.value : evt;
                this.setState({ modelo: modelo });

                if ((evt.target && evt.target.value === "") || !evt.nome) {
                    this.setState({ objetoInseridoModeloDispositivo: false });
                    this.setState({ objetoInseridoModeloEquipamento: false });
                }

                if (modelo['modeloDispositivo'] !== undefined && modelo['modeloDispositivo'].nome) {
                    if (modelo.uidInstanceId && modelo.precoInstalacao && modelo.precoManutencao
                        && modelo.precoAluguel && modelo.precoVenda && modelo.precoServico) {

                        this.setState({ objetoInseridoModeloDispositivo: true });
                    }
                }

                if (modelo['modeloEquipamento'] !== undefined && modelo['modeloEquipamento'].nome) {
                    if (modelo.intervaloManutencaoNaoObrigatoria && modelo.intervaloCalibracao && modelo.precoInstalacao &&
                        modelo.precoManutencao && modelo.precoAluguel && modelo.precoVenda && modelo.precoServico) {

                        this.setState({ objetoInseridoModeloEquipamento: true });
                    }
                }

            } else {
                modelo = {};
                this.setState({ modelo: modelo });
            }
        }
    }

    setFieldInsumo = (name, evt) => {
        if (evt.target || evt) {
            let insumo = this.state.insumo;

            if (insumo) {
                insumo[name] = evt.target ? evt.target.value : evt;
                this.setState({ insumo: insumo });
                if ((insumo.tipoInsumo && insumo.tipoInsumo.nome) && insumo.quantidadeMinima && insumo.precoContratado) {
                    this.setState({ objetoInseridoInsumo: true });
                } else {
                    this.setState({ objetoInseridoInsumo: false });
                }
            } else {
                insumo = {
                    precoContratado: "0,00",
                };
                this.setState({ insumo: insumo });
            }
        }
    }

    setFieldCondicaoContratual = (name, evt) => {
        if (evt.target) {
            let valoresAtuais = this.state.condicaoContratual;

            if (valoresAtuais) {
                valoresAtuais[name] = evt.target.value;
                this.setState({ condicaoContratual: valoresAtuais });
                if (valoresAtuais.dataAssinatura) {
                    this.setState({ objetoInserido: true });
                } else {
                    this.setState({ objetoInserido: false });
                }

            } else {
                valoresAtuais = {};
                this.setState({ condicaoContratual: valoresAtuais });
            }
        }
    }

    addLocalizacaoPlanejada = () => {

        const localizacao = this.state.localizacaoPlanejada;
        let condicao = this.state.condicaoContratual;

        if (localizacao) {
            let lista = this.state.listaLocalizacaoPlanejada;

            let found = lista.find(item => item.localizacaoFisica.nome === localizacao.localizacaoFisica.nome);
            if (found) {
                this.setState({ erroLocalizacao: text("contrato.erro-localizacao") });
                return;
            }

            let listaModelo = [];         
            if (condicao && condicao.modelosDispositivosContratados) {
                listaModelo = [...listaModelo, ...condicao.modelosDispositivosContratados];
            }
            if (condicao && condicao.modelosEquipamentosContratados) {
                listaModelo = [...listaModelo, ...condicao.modelosEquipamentosContratados];
            }

            if (!listaModelo ||  !Array.isArray(listaModelo) || listaModelo.length < 1) {
                this.setState({ erroLocalizacao: text("contrato.erro-modelo-nao-definido") });
                return;
            }

            let quantidadeContratada = parseInt(listaModelo.reduce((total, item) => parseInt(total) + parseInt(item.quantidadeContratada), 0));
            let somaQuantidadePlanejada = 0;
            if (lista.length > 0) {
                somaQuantidadePlanejada = lista.reduce((total, item) => parseInt(total) + parseInt(item.quantidadePlanejada), 0);
            }
            if ((parseInt(somaQuantidadePlanejada) + parseInt(localizacao.quantidadePlanejada)) > quantidadeContratada) {
                this.setState({ erroLocalizacao: text("contrato.erro-quantidade") + quantidadeContratada });
                return;
            }

            //somente depois das validações deve ser limpado o objeto
            this.setState({ localizacaoPlanejada: {} });

            lista.push(localizacao);
            this.setState({ listaLocalizacaoPlanejada: lista });

            condicao['possiveisLocais'] = lista;
            this.setState({ condicaoContratual: condicao });

            this.setState({ objetoInseridoLocalizacaoPlanejada: false });
            this.setState({ erroLocalizacao: '' });
            this.closeLocalizacaoPlanejada();
        }

    }

    addModelo = (tipoLista) => {

        let modelo = this.state.modelo;
        let condicao = this.state.condicaoContratual;

        if (condicao) {

            let lista = [];

            if (tipoLista === tiposObjetoContratado.dispositivo) {
                lista = this.state.listaModeloDispositivo;
            } else if (tipoLista === tiposObjetoContratado.equipamento) {
                lista = this.state.listaModeloEquipamento;
            }

            if (tipoLista === tiposObjetoContratado.dispositivo) {

                let found = lista.find(item => 
                    item.modeloDispositivo.nome === modelo.modeloDispositivo.nome
                );

                if (found) {
                    this.setState({ erroModeloDispositivo: text("contrato.erro-modelo") });
                    return;
                } else {
                    this.setState({
                        modelo: {
                            precoAluguel: "0,00",
                            precoInstalacao: "0,00",
                            precoManutencao: "0,00",
                            precoServico: "0,00",
                            precoVenda: "0,00",
                        }
                    });
                }

                modelo.precoAluguel = formatPrecoValue(modelo.precoAluguel);
                modelo.precoInstalacao = formatPrecoValue(modelo.precoInstalacao);
                modelo.precoManutencao = formatPrecoValue(modelo.precoManutencao);
                modelo.precoServico = formatPrecoValue(modelo.precoServico);
                modelo.precoVenda = formatPrecoValue(modelo.precoVenda);

                lista.push(modelo);
                this.setState({ listaModeloDispositivo: lista });
                condicao.modelosDispositivosContratados = lista;

            } else if (tipoLista === tiposObjetoContratado.equipamento) {

                let found = lista.find(item => 
                    item.modeloEquipamento.nome === modelo.modeloEquipamento.nome
                );

                if (found) {
                    this.setState({ erroModeloEquipamento: text("contrato.erro-modelo") });
                    return;
                } else {
                    this.setState({
                        modelo: {
                            precoAluguel: "0,00",
                            precoInstalacao: "0,00",
                            precoManutencao: "0,00",
                            precoServico: "0,00",
                            precoVenda: "0,00",
                        }
                    });
                }

                modelo.precoAluguel = formatPrecoValue(modelo.precoAluguel);
                modelo.precoInstalacao = formatPrecoValue(modelo.precoInstalacao);
                modelo.precoManutencao = formatPrecoValue(modelo.precoManutencao);
                modelo.precoServico = formatPrecoValue(modelo.precoServico);
                modelo.precoVenda = formatPrecoValue(modelo.precoVenda);

                lista.push(modelo);
                this.setState({ listaModeloEquipamento: lista });
                condicao.modelosEquipamentosContratados = lista;
            }
            
            
            this.setState({ condicaoContratual: condicao });
            this.setState({ objetoInseridoModeloDispositivo: false });
            this.setState({ objetoInseridoModeloEquipamento: false });
            this.closeModelo(tipoLista);
        }
    }

    addInsumo = () => {
        let insumo = this.state.insumo;
        let condicao = this.state.condicaoContratual;

        if (insumo) {
            let lista = this.state.listaInsumo;
            let found = lista.find(item => item.nome === insumo.nome);
            if (found) {
                this.setState({ erroInsumo: text("contrato.erro-insumo") });
                return;
            } else {
                this.setState({
                    insumo: {
                        precoContratado: "0,00",
                        tipoInsumo: null,
                    }
                });
            }

            insumo.precoContratado = formatPrecoValue(insumo.precoContratado);
            lista.push(insumo);
            this.setState({ listaInsumo: lista });

            condicao['insumosCobertos'] = lista;
            this.setState({ condicaoContratual: condicao });

            this.setState({ objetoInseridoInsumo: false });
            this.closeInsumos();
        }
    }

    
    addCondicaoContratual = () => {

        let condicao = this.state.condicaoContratual;        
        let listaLocalizacaoPlanejada = condicao.possiveisLocais;
        let listaModelo = [];   

        if (condicao && condicao.modelosDispositivosContratados) {
            listaModelo = [...listaModelo, ...condicao.modelosDispositivosContratados];
        }
        if (condicao && condicao.modelosEquipamentosContratados) {
            listaModelo = [...listaModelo, ...condicao.modelosEquipamentosContratados];
        }
        
        let quantidadeContratada = parseInt(listaModelo.reduce((total, item) => parseInt(total) + parseInt(item.quantidadeContratada), 0));
        let somaQuantidadePlanejada = 0;
        if (listaLocalizacaoPlanejada.length > 0) {
            somaQuantidadePlanejada = listaLocalizacaoPlanejada.reduce((total, item) => parseInt(total) + parseInt(item.quantidadePlanejada), 0);
        }

        if ( parseInt(somaQuantidadePlanejada) !== parseInt(quantidadeContratada)) {
            this.setState({ erroCondicaoContratual: text("contrato.erro-quantidade-diferente") });
            return;
        } else {
            this.setState({ erroCondicaoContratual: '' });
        }
        
        this.setState({ condicaoContratual: null});

        if (condicao.id) {
            let lista = this.state.listaCondicoesContratuais;
            let indexFound = lista.findIndex((obj => obj.id === condicao.id));
            lista[indexFound] = condicao;
            this.setState({ listaCondicoesContratuais: lista });

        } else {
            let lista = this.state.listaCondicoesContratuais;
            condicao.enableRemove = true;
            lista.push(condicao);
            this.setState({ listaCondicoesContratuais: lista });
        }

        this.setState({ open: false });
        this.setState({ objetoInserido: false });
        this.setState({ listaLocalizacaoPlanejada: [] });
        this.setState({ listaModeloDispositivo: [] });
        this.setState({ listaModeloEquipamento: [] });
        this.setState({ listaInsumo: [] });
        this.setState({ opcaoCondicoesContratuais: null });
    }

    removeCondicaoContratual = (index) => {
        let lista = this.state.listaCondicoesContratuais;
        lista.splice(index, 1);
        this.setState({ listaCondicoesContratuais: lista });
    }

    editCondicaoContratual = (index) => {
        let condicao = this.state.listaCondicoesContratuais[index];
        this.setState({ condicaoContratual: condicao });
        this.setState({ memento: deepCopy(condicao) }); //novo objeto
        this.setState({ objetoInserido: true });

        let modelos = [];
        if (Array.isArray(condicao.modelosDispositivosContratados) &&
            condicao.modelosDispositivosContratados.length > 0) {

            modelos = condicao.modelosDispositivosContratados;
            this.setState({ listaModeloDispositivo: modelos });

        } 
        
        if (Array.isArray(condicao.modelosEquipamentosContratados) &&
            condicao.modelosEquipamentosContratados.length > 0) {

            modelos = condicao.modelosEquipamentosContratados;
            this.setState({ listaModeloEquipamento: modelos });
        }        
        
        this.carregaListaModelos(tiposObjetoContratado.dispositivo);
        this.carregaListaModelos(tiposObjetoContratado.equipamento);

        if (condicao.possiveisLocais) {
            this.setState({ listaLocalizacaoPlanejada: condicao.possiveisLocais });
        }

        if (condicao.insumosCobertos) {
            this.setState({ listaInsumo: condicao.insumosCobertos });
        }

        this.setState({ open: true });
    }

    removeModelo = (index, tipo) => {
        let lista = [];
        let condicao = this.state.condicaoContratual;

        if (tipo === tiposObjetoContratado.dispositivo) {
            condicao.modelosDispositivosContratados.splice(index, 1);
            lista = condicao.modelosDispositivosContratados;
            this.setState({ listaModeloDispositivo: lista });

        } else if (tipo === tiposObjetoContratado.equipamento) {
            condicao.modelosEquipamentosContratados.splice(index, 1);
            lista = condicao.modelosEquipamentosContratados;
            this.setState({ listaModeloEquipamento: lista });

        }
        this.setState({ condicaoContratual: condicao });        
    }

    removeLocalizacaoPlanejada = (index) => {
        let lista = this.state.listaLocalizacaoPlanejada;
        lista.splice(index, 1);
        this.setState({ listaLocalizacaoPlanejada: lista });
    }

    removeInsumo = (index) => {
        let lista = this.state.listaInsumo;
        lista.splice(index, 1);
        this.setState({ listaInsumo: lista });
    }

    carregaTiposInsumos = async () => {
        try {
            let response = await api.get("/insumos/tipos/all");
            const lista = response.data.map((item) => ({
                key: item.id,
                text: item.nome,
                value: item,
            }))
            this.setState({ tiposInsumosOptions: lista });

        } catch (error) {
            this.setState({ tiposInsumosOptions: null });
        }
    }

    carregaListaModelos = async (value) => {

        try {
            let response = null;
            if (value === tiposObjetoContratado.equipamento) {
                response = await api.get("/equipamentos/modelos/all");
            } else {
                response = await api.get("/dispositivos/modelos/all");
            }
            let lista = [];
            response.data.map((item) => {
                if (item.nome.toLowerCase() !== "desconhecido") {
                    lista.push({
                        key: item.id,
                        text: item.nome,
                        value: item,
                    });
                }
                return null;
            });

            if (value === tiposObjetoContratado.equipamento) {
                this.setState({ modeloEquipamentoOptions: lista });
            } else {
                this.setState({ modeloDispositivoOptions: lista });
            }
            
        } catch (error) {
            this.setState({ modeloDispositivoOptions: null });
            this.setState({ modeloEquipamentoOptions: null });
        }
    }

    pesquisaPJ(event) {
        this.props.filterPessoa(pessoaTypes.PESSOA_JURIDICA, event.query.toLowerCase());
    }

    pesquisaPF(event) {
        this.props.filterPessoa(pessoaTypes.PESSOA_FISICA, event.query.toLowerCase());
    }

    trataModeloEDataDispositivo = (listaCondicoes) => {

        listaCondicoes.forEach(condicao => {

            if (condicao.dataAssinaturaFormatada && Number.isInteger(condicao.dataAssinatura)) {
                condicao.dataAssinatura = condicao.dataAssinaturaFormatada;
            }

            if (condicao.dataEncerramentoFormatada && Number.isInteger(condicao.dataEncerramento)) {
                condicao.dataEncerramento = condicao.dataEncerramentoFormatada;
            }

            if (Array.isArray(condicao.modelosDispositivosContratados) && condicao.modelosDispositivosContratados.length > 0) {
                condicao.modelosDispositivosContratados.map(modelo => modelo.modeloDispositivo.fabricante = 0);
                condicao.tipoCondicao = tiposObjetoContratado.dispositivo;
            }

            if (Array.isArray(condicao.modelosEquipamentosContratados) && condicao.modelosEquipamentosContratados.length > 0) {
                condicao.modelosEquipamentosContratados.map(modelo => modelo.modeloEquipamento.fabricante = 0);
                condicao.tipoCondicao = tiposObjetoContratado.equipamento;
            }
        });

        return listaCondicoes;
    }

    configuraSimplePF = (oldObject) => {
        return {
            id: oldObject.id,
            nome: oldObject.nome,
            cpfFormatado: oldObject.cpfFormatado,
        };
    }

    configuraSimplePJ = (oldObject) => {
        return {
            id: oldObject.id,
            nome: oldObject.nome,
            cnpjFormatado: oldObject.cnpjFormatado,
        };
    }

    handleCurrencyFormat = (name, type, object) => {
        if (type === 'modelo') {
            this.setState({ modelo: verificaCasasDecimais(name, object) });
        } else if (type === 'insumo') {
            this.setState({ insumo: verificaCasasDecimais(name, object) });
        }
    }
   

    render() {

        const { contrato, loading, condicaoContratual, modelo, erroCondicaoContratual } = this.state;

        if (this.props.sucessoInsert) {
            return <Redirect to={{
                pathname: '/gerencia/contratos',
                state: { sucesses: this.props.sucessoInsert }
            }}
            />
        }

        return (
            <div>
                <Header as="h1">
                    {text('contrato.titulo-form')}
                </Header>

                {this.props.erroInsert &&
                    <Message negative>
                        {this.props.erroInsert }
                    </Message>
                }

                <Formik
                    initialValues={{
                        numero: contrato ? contrato.numero : null,
                        contratante: contrato ? this.configuraSimplePJ(contrato.contratante) : null,
                        contratado: contrato ? this.configuraSimplePJ(contrato.contratado) : null,
                        contatoCliente: contrato ? this.configuraSimplePF(contrato.contatoCliente) : null,
                        contatoInterno: contrato ? this.configuraSimplePF(contrato.contatoInterno) : null,
                        tipoContrato: contrato ? contrato.tipoContrato : null,
                        vinculadoHolding: contrato ? contrato.vinculadoHolding : null,
                    }}
                    enableReinitialize={true}
                    onSubmit={async (values) => {

                        let contrato = Object.assign({}, values);
                        let vazio = false;
                        if (!contrato.numero || !contrato.contatoCliente || !contrato.contatoInterno ||
                            !contrato.contratado || !contrato.contratante || !contrato.tipoContrato) {

                            vazio = true;
                        }

                        try {

                            if (!vazio) {
                                contrato.listaCondicoesContratuais = this.state.listaCondicoesContratuais;
                                contrato.listaCondicoesContratuais = this.trataModeloEDataDispositivo(contrato.listaCondicoesContratuais);

                                contrato.contratante = { cnpj: limparCampo(contrato.contratante.cnpjFormatado) };
                                contrato.contratado = { cnpj: limparCampo(contrato.contratado.cnpjFormatado) };
                                contrato.contatoCliente = { cpf: limparCampo(contrato.contatoCliente.cpfFormatado) };
                                contrato.contatoInterno = { cpf: limparCampo(contrato.contatoInterno.cpfFormatado) };
                            }

                            if (this.state.contrato) {//editando um item
                                contrato.id = this.state.contrato.id;
                                this.props.editContrato(contrato);
                            } else {//novo item  
                                this.props.addContrato(contrato);
                            }
                        } catch (reason) {

                        }
                    }}
                    render={({
                        values,
                        handleSubmit,
                        setFieldValue,
                    }) => (
                            <Form
                                onSubmit={handleSubmit}
                                loading={loading}
                            >
                                <ContratoFormFields
                                    values={values}
                                    handleHabilita={this.habilitaCondicoesContratuais}
                                    pessoasFisicasOptions={this.state.pessoasFisicasOptions}
                                    pessoasJuridicasOptions={this.state.pessoasJuridicasOptions}
                                    tipoContratoOptions={this.state.tipoContratoOptions}
                                    setField={setFieldValue}
                                    selectLocalizacao={this.selectLocalizacao}
                                />

                                <br />
                                <Divider />
                                <br />

                                <Grid stackable columns={2}>
                                    <Grid.Column>
                                        <Header as='h2'>
                                            {text("contrato.condicoes-contratuais")}
                                        </Header>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Button
                                            loading={this.props.inserindo}
                                            icon labelPosition='right'
                                            color="green"
                                            size='medium'
                                            type="button"
                                            floated="right"
                                            disabled={!this.state.infoBasicaCompletas}
                                            onClick={this.show}
                                        >
                                            <Icon name='plus' /> {text("geral.adicionar") + " " + text("contrato.condicoes-contratuais")}
                                        </Button>
                                    </Grid.Column>
                                </Grid>


                                <Form.Group>
                                    <Modal
                                        onClose={this.close}
                                        open={this.state.open}
                                        closeIcon
                                        centered={true}
                                        size={'large'}>
                                        <Modal.Header>{text("geral.adicionar") + " " + text("contrato.condicoes-contratuais")}
                                            {contrato &&
                                                <>
                                                    {" - "}{text("contrato.titulo-form") + ": " + contrato.numero}
                                                </>
                                            }
                                        </Modal.Header>
                                        <Modal.Content >
                                            {erroCondicaoContratual &&
                                                <Message negative>
                                                    <p>{text('contrato.mensagem-erro')}</p>
                                                    <b>{text('contrato.mensagem-erro-detalhes')}:</b> {erroCondicaoContratual}
                                                </Message>
                                            }
                                           
                                           
                                            <Form >
                                                <CondicaoContratualFormFields
                                                    condicaoContratual={condicaoContratual}
                                                    setField={this.setFieldCondicaoContratual}
                                                />

                                                <br />
                                                <ModeloDispositivoModalForm
                                                    condicaoContratual={condicaoContratual}
                                                    contrato={contrato}
                                                    modelo={modelo}
                                                    modeloOptions={this.state.modeloDispositivoOptions}
                                                    setField={this.setFieldModelo}
                                                    error={this.state.erroModeloDispositivo}
                                                    listaModelo={this.state.listaModeloDispositivo}
                                                    isOpen={this.state.openModeloDispositivo}
                                                    isObjetoInseridoModelo={this.state.objetoInseridoModeloDispositivo}
                                                    isInserindo={this.props.inserindo}
                                                    handleAddModelo={this.addModelo}
                                                    handleClose={this.closeModelo}
                                                    handleShowModelo={this.showModelo}
                                                    handleRemoveModelo={this.removeModelo}
                                                    handleCurrencyFormat={this.handleCurrencyFormat}
                                                />

                                                <br />
                                                <ModeloEquipamentoModalForm
                                                    condicaoContratual={condicaoContratual}
                                                    contrato={contrato}
                                                    modelo={modelo}
                                                    modeloOptions={this.state.modeloEquipamentoOptions}
                                                    setField={this.setFieldModelo}
                                                    error={this.state.erroModeloEquipamento}
                                                    listaModelo={this.state.listaModeloEquipamento}
                                                    isOpen={this.state.openModeloEquipamento}
                                                    isObjetoInseridoModelo={this.state.objetoInseridoModeloEquipamento}
                                                    isInserindo={this.props.inserindo}
                                                    handleAddModelo={this.addModelo}
                                                    handleClose={this.closeModelo}
                                                    handleShowModelo={this.showModelo}
                                                    handleRemoveModelo={this.removeModelo}
                                                    handleCurrencyFormat={this.handleCurrencyFormat}
                                                />

                                                <br />
                                                <LocalizacaoPlanejadaModalForm
                                                    condicaoContratual={condicaoContratual}
                                                    contrato={contrato}
                                                    listaLocalizacaoPlanejada={this.state.listaLocalizacaoPlanejada}
                                                    setField={this.setFieldLocalizacaoPlanejada}
                                                    localizacaoFisicaOptions={this.state.localizacaoFisicaOptions}
                                                    error={this.state.erroLocalizacao}
                                                    isOpenLocalizacaoPlanejada={this.state.openLocalizacaoPlanejada}
                                                    isInserindo={this.props.inserindo}
                                                    isObjetoInseridoLocalizacaoPlanejada={this.state.objetoInseridoLocalizacaoPlanejada}
                                                    handleShowLocalizacaoPlanejada={this.showLocalizacaoPlanejada}
                                                    handleRemoveLocalizacaoPlanejada={this.removeLocalizacaoPlanejada}
                                                    handleCloseLocalizacaoPlanejada={this.closeLocalizacaoPlanejada}
                                                    handleAddLocalizacaoPlanejada={this.addLocalizacaoPlanejada}
                                                />

                                                <br />
                                                <InsumoModalForm
                                                    condicaoContratual={condicaoContratual}
                                                    contrato={contrato}
                                                    error={this.state.erroInsumo}
                                                    insumo={this.state.insumo}
                                                    isInserindo={this.props.inserindo}
                                                    isOpen={this.state.openInsumo}
                                                    isObjetoInseridoInsumo={this.state.objetoInseridoInsumo}
                                                    listaInsumo={this.state.listaInsumo}
                                                    setField={this.setFieldInsumo}
                                                    tiposInsumoOptions={this.state.tiposInsumosOptions}
                                                    handleShowInsumo={this.showInsumos}
                                                    handleAddInsumo={this.addInsumo}
                                                    handleCurrencyFormat={this.handleCurrencyFormat}
                                                    handleRemoveInsumo={this.removeInsumo}
                                                    handleCloseInsumo={this.closeInsumos}
                                                />

                                            </Form>

                                            <div style={{ marginBottom: "50px" }}>
                                                <Button
                                                    type='button'
                                                    floated='left'
                                                    icon
                                                    labelPosition='left'
                                                    size="medium"
                                                    onClick={this.close}
                                                >
                                                    <Icon name='cancel' /> {text("formularios.cancelar")}
                                                </Button>
                                                <Button
                                                    color='green'
                                                    type='button'
                                                    floated='right'
                                                    icon
                                                    labelPosition='right'
                                                    size="medium"
                                                    disabled={!this.state.objetoInserido}
                                                    onClick={this.addCondicaoContratual}
                                                >
                                                    <Icon name='save' /> {condicaoContratual && condicaoContratual.id ? text("formularios.atualizar") : text("geral.adicionar")}  {text("contrato.condicoes-contratuais")}
                                                </Button>
                                            </div>

                                        </Modal.Content>
                                    </Modal>
                                </Form.Group>

                                <Form.Group>
                                    <TableContrato
                                        handleEditCondicaoContratual={this.editCondicaoContratual}
                                        handleRemoveCondicaoContratual={this.removeCondicaoContratual}
                                        listaCondicoesContratuais={this.state.listaCondicoesContratuais}
                                    />
                                </Form.Group>

                                <br />
                                <Divider />

                                <MainActionsForm
                                    cancelTo={"/gerencia/contratos"}
                                    isInserindo={this.props.inserindo}
                                    objectToCheck={contrato}
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
        listaContratosFiltrados: state.contratoReducer.listaContratosFiltrados,
        erroInsert: state.contratoReducer.erro,
        sucessoInsert: state.contratoReducer.sucesso,
        inserindo: state.contratoReducer.executando,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addContrato: (contrato) => dispatch(addContrato(contrato)),
        editContrato: (contrato) => dispatch(editContrato(contrato)),
        filterPessoa: (type, filterValue) => dispatch(filterPessoa(type, filterValue)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContratoForm);