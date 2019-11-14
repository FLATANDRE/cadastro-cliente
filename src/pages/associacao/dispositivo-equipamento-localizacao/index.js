import React, { Component } from 'react';
import { Button, Form, Header, Icon, Message, Segment, Confirm, Checkbox, Dropdown, Grid } from 'semantic-ui-react';

import api from '../../../services/api';
import { text } from '../../../services/locales';

import Associacao from '../../relatorio/dispositivos/associacao';

//Reactprime
import { AutoComplete } from 'primereact/autocomplete';

export default class AssociacaoDispositivoEquipamentoLocalizacao extends Component {

    state = {
        autocompleteDispositivos: [],
        associacaoCorrente: null,
        dispositivoSelecionado: null,
        estadoDialogoRemoverAssociacao: false,
        error: null,
        sucesses: null,
        autocompleteEquipamentos: [],
        equipamentoSelecionado: null,
        mac: null,
        serialNumber: null,
        localizacaoTipo: 'compartimento',
        compartimentos: [],
        containers: [],
        compartimento: null,
        container: null
    };

    async componentDidMount() {

        const responseCompartimentos = await api.get("/localizacao/compartimento?size=999");
        const compartimentoOptions = responseCompartimentos.data.content.map((item) => ({
            key: item.id,
            text: item.nome + " (" + item.tipoCompartimento.nome + ")",
            value: item.id,
        }))

        const responseContainers = await api.get("/localizacao/container?size=999");
        const containerOptions = responseContainers.data.content.map((item) => ({
            key: item.id,
            text: item.nome + " (" + item.tipoContainer.nome + ")",
            value: item.id,
        }))

        this.setState({ compartimentos: compartimentoOptions, containers: containerOptions });

    }

    async autoCompleteDispositivo(event) {

        let url = '/dispositivos?q=' + event.query;

        api.get(url)
            .then((response) => {
                if (response.data.content != null) {
                    this.setState({
                        autocompleteDispositivos: response.data.content
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    autocompleteDispositivos: []
                });
            });
    }

    dispositivoTemplate(item) {
        return item.macFormatado + " (" + item.tipo.nome + ")";
    }

    dispositivoSelecionado(item) {

        if (item.mac) {

            this.setState({
                dispositivoSelecionado: item,
                sucesses: null,
                error: null
            });

            let url = '/dispositivos/associacao/' + item.mac;

            api.get(url)
                .then((response) => {
                    if (response.data != null) {
                        if (response.data.associado !== null) {
                            this.setState({
                                associacaoCorrente: response.data
                            });
                        } else {
                            this.setState({
                                associacaoCorrente: null
                            });
                        }
                    }
                })
                .catch((error) => {
                    var mensagemErro = text("formularios.erro");
                    if (error.response && error.response.data.message) {
                        mensagemErro = error.response.data.message;
                    } else if (error.request) {
                        mensagemErro = text("formularios.erro_request")
                    }
                    this.setState({
                        error: mensagemErro,
                        associacaoCorrente: null
                    });
                });
        } else {
            this.setState({
                dispositivoSelecionado: null,
                associacaoCorrente: null
            });
        }
    }

    autoCompleteEquipamento(event) {

        let url = '/equipamentos/bombas?q=' + event.query;

        api.get(url)
            .then((response) => {
                if (response.data.content != null) {
                    this.setState({
                        autocompleteEquipamentos: response.data.content
                    });
                }
            })
            .catch((error) => {
                var mensagemErro = text("formularios.erro");
                if (error.response && error.response.data.message) {
                    mensagemErro = error.response.data.message;
                } else if (error.request) {
                    mensagemErro = text("formularios.erro_request")
                }
                this.setState({
                    error: mensagemErro,
                    autocompleteEquipamentos: []
                });
            });
    }

    equipamentoTemplate(item) {
        return item.serialNumber + " (" + item.tipoEquipamentoNome + ")";
    }

    equipamentoSelecionado(item) {

        if (item.serialNumber) {

            this.setState({
                equipamentoSelecionado: item,
                sucesses: null,
                error: null
            });

        }
    }

    handleOpenConfirm = () => this.setState({ estadoDialogoRemoverAssociacao: true });
    handleCancelConfirm = () => this.setState({ estadoDialogoRemoverAssociacao: false });


    handleRemoverAssociacao() {

        if (!this.state.dispositivoSelecionado) {
            return;
        }

        let url = '/dispositivos/associacao/' + this.state.dispositivoSelecionado.mac;

        api.delete(url)
            .then((response) => {
                this.setState({
                    sucesses: text("associacao.remocao-associacao-mensagem-sucesso"),
                    estadoDialogoRemoverAssociacao: false,
                    associacaoCorrente: null,
                    dispositivoSelecionado: null,
                    mac: null,
                    serialNumber: null
                });
            })
            .catch((error) => {
                var mensagemErro = text("formularios.erro");
                if (error.response && error.response.data.message) {
                    mensagemErro = error.response.data.message;
                } else if (error.request) {
                    mensagemErro = text("formularios.erro_request")
                }
                this.setState({
                    error: mensagemErro,
                    estadoDialogoRemoverAssociacao: false
                });
            });
    }

    handleAssociarEquipamento() {
        if (!this.state.dispositivoSelecionado || !this.state.equipamentoSelecionado) {
            return;
        }

        let url = '/dispositivos/associacao/' + this.state.dispositivoSelecionado.mac + "/equipamento/" + this.state.equipamentoSelecionado.serialNumber;

        api.put(url)
            .then((response) => {
                if (response.data != null) {
                    if (response.data.error != null) {
                        this.setState({ error: response.data.message });
                    } else {
                        this.setState({
                            sucesses: text("associacao.associacao-mensagem-sucesso"),
                            associacaoCorrente: null,
                            dispositivoSelecionado: null,
                            equipamentoSelecionado: null,
                            mac: null,
                            serialNumber: null,
                            error: null
                        });
                    }
                }
            })
            .catch((error) => {
                var mensagemErro = text("formularios.erro");
                if (error.response && error.response.data.message) {
                    mensagemErro = error.response.data.message;
                } else if (error.request) {
                    mensagemErro = text("formularios.erro_request")
                }
                this.setState({
                    error: mensagemErro
                });
            });
    }

    handleLimpar() {
        this.setState({
            sucesses: null,
            error: null,
            associacaoCorrente: null,
            dispositivoSelecionado: null,
            equipamentoSelecionado: null,
            mac: null,
            serialNumber: null
        });
    }

    handleLimparEquipamentoSelecionado() {
        this.setState({
            sucesses: null,
            error: null,
            equipamentoSelecionado: null,
            serialNumber: null
        });
    }

    handleChangeCheckBoxLocalizacao = (e, { value }) => this.setState({ localizacaoTipo: value });

    handleChangeDropdown = (e, { name, value }) => this.setState({ [name]: value })

    handleAssociarLocalizacao() {

        const { dispositivoSelecionado, localizacaoTipo, compartimento, container } = this.state;

        if (!dispositivoSelecionado) {
            return;
        }

        var idLocalizacao = null;

        if (compartimento) {
            idLocalizacao = compartimento;
        }
        if (container) {
            idLocalizacao = container;
        }
        if (idLocalizacao === null) {
            return;
        }

        let url = '/dispositivos/associacao/' + dispositivoSelecionado.mac + "/" + localizacaoTipo + "/" + idLocalizacao;

        api.put(url)
            .then((response) => {
                if (response.data != null) {
                    if (response.data.error != null) {
                        this.setState({ error: response.data.message });
                    } else {
                        this.setState({
                            sucesses: text("associacao.associacao-mensagem-sucesso"),
                            associacaoCorrente: null,
                            dispositivoSelecionado: null,
                            equipamentoSelecionado: null,
                            mac: null,
                            serialNumber: null,
                            error: null
                        });
                    }
                }
            })
            .catch((error) => {
                var mensagemErro = text("formularios.erro");
                if (error.response && error.response.data.message) {
                    mensagemErro = error.response.data.message;
                } else if (error.request) {
                    mensagemErro = text("formularios.erro_request")
                }
                this.setState({
                    error: mensagemErro
                });
            });
    }

    render() {

        const { associacaoCorrente, dispositivoSelecionado, equipamentoSelecionado } = this.state;

        return (
            <>


                <Header as="h1" > {text("associacao.titulo")}</Header>


                {this.state.error && <Message negative>{this.state.error}</Message>}
                {this.state.sucesses && <Message positive>{this.state.sucesses}</Message>}

                <Form size='large' className="form">

                    <div className="field">
                        <label>{text("associacao.dispositivo")}</label>
                        <div className="p-col-12 p-md-4">
                            <div className="p-inputgroup">
                                <AutoComplete
                                    suggestions={this.state.autocompleteDispositivos}
                                    completeMethod={this.autoCompleteDispositivo.bind(this)}
                                    field="mac"
                                    onChange={e => {
                                        this.setState({ mac: e.value });
                                        this.dispositivoSelecionado(e.target.value);
                                    }}
                                    itemTemplate={this.dispositivoTemplate}
                                    style={{ width: "100%" }}
                                    name="dispositivo"
                                    value={this.state.mac}
                                    placeholder={text("associacao.dispositivo-placeholder")}
                                />
                                {dispositivoSelecionado &&
                                    <Button
                                        onClick={this.handleLimpar.bind(this)}
                                        attached='right'
                                        icon='close'
                                        size='small'
                                    />
                                }
                            </div>
                        </div>
                    </div>

                    {dispositivoSelecionado &&
                        <>
                            <Segment >
                                <b>{text("associacao.dispositivo-selecionado")}</b><br /><br />

                                <b>{text("relatorio-dispositivos.mac")}:</b> {dispositivoSelecionado.macFormatado}<br />
                                <b>{text("relatorio-dispositivos.tipo")}:</b> {dispositivoSelecionado.tipo.nome}<br />
                                <b>{text("relatorio-dispositivos.modelo")}:</b> {dispositivoSelecionado.modelo.nome} ({dispositivoSelecionado.modelo.fabricante.nome})<br />
                                <b>{text("gerencia-dispositivos.operativo")}:</b> {dispositivoSelecionado.operativo ? text("geral.sim") : text("geral.nao")}<br />
                            </Segment>
                        </>
                    }

                    {dispositivoSelecionado && associacaoCorrente &&
                        <>
                            <Segment placeholder>
                                <Header icon>
                                    <Icon name='warning sign' />
                                    {text("associacao.dispositivo-ja-associado")}: {associacaoCorrente.associadoNome}
                                </Header>
                                <Button
                                    color='red'
                                    onClick={this.handleOpenConfirm}
                                >
                                    {text("associacao.remover-associacao")}
                                </Button>

                                <Confirm
                                    content={text("associacao.confirmacao-remover-associacao")}
                                    open={this.state.estadoDialogoRemoverAssociacao}
                                    onCancel={this.handleCancelConfirm}
                                    onConfirm={this.handleRemoverAssociacao.bind(this)}
                                />
                            </Segment>
                        </>
                    }

                    {dispositivoSelecionado &&
                        <Associacao mac={dispositivoSelecionado.mac} />
                    }

                    {dispositivoSelecionado && !associacaoCorrente &&
                        <>
                            {!dispositivoSelecionado.tipo.associavelEquipamento && !dispositivoSelecionado.tipo.associavelLocalizacao &&
                                <Segment placeholder>
                                    < Header icon>
                                        <Icon name='warning sign' />
                                        {text("associacao.dispositivo-nao-pode-ser-associado")}
                                    </Header>
                                    <Button
                                        onClick={this.handleLimpar.bind(this)}
                                    >
                                        {text("geral.ok")}
                                    </Button>
                                </Segment>
                            }

                            {dispositivoSelecionado.tipo.associavelEquipamento &&
                                <>
                                    <Segment>
                                        <div className="field">
                                            <label>{text("associacao.equipamento")}</label>
                                            <div className="p-col-12 p-md-4">
                                                <div className="p-inputgroup">
                                                    <AutoComplete
                                                        suggestions={this.state.autocompleteEquipamentos}
                                                        completeMethod={this.autoCompleteEquipamento.bind(this)}
                                                        field="serialNumber"
                                                        onChange={e => {
                                                            this.setState({ serialNumber: e.value });
                                                            this.equipamentoSelecionado(e.target.value);
                                                        }}
                                                        itemTemplate={this.equipamentoTemplate}
                                                        style={{ width: "100%" }}
                                                        name="equipamento"
                                                        value={this.state.serialNumber}
                                                        placeholder={text("associacao.equipamento-placeholder")}
                                                    />
                                                    {equipamentoSelecionado &&
                                                        <Button
                                                            onClick={this.handleLimparEquipamentoSelecionado.bind(this)}
                                                            attached='right'
                                                            icon='close'
                                                            size='small'
                                                        />
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </Segment>

                                    {equipamentoSelecionado &&
                                        <>
                                            <Segment>
                                                <b>{text("associacao.equipamento-selecionado")}</b><br /><br />

                                                <b>{text("associacao.serial-number")}:</b> {equipamentoSelecionado.serialNumber}<br />
                                                <b>{text("relatorio-dispositivos.tipo")}:</b> {equipamentoSelecionado.tipoEquipamentoNome}<br />
                                                <b>{text("relatorio-dispositivos.modelo")}:</b> {equipamentoSelecionado.modelo.nome} ({equipamentoSelecionado.modelo.fabricante.nome})<br />
                                                <b>{text("gerencia-dispositivos.operativo")}:</b> {equipamentoSelecionado.operativo ? text("geral.sim") : text("geral.nao")}<br />
                                            </Segment>

                                            <Segment placeholder>
                                                < Header icon>
                                                    <Icon name='check circle outline' />
                                                    {text("associacao.concluindo-associacao")}
                                                </Header>
                                                <Button
                                                    size="huge"
                                                    color='green'
                                                    onClick={this.handleAssociarEquipamento.bind(this)}
                                                >
                                                    {text("associacao.inserir-associacao")}
                                                </Button>
                                            </Segment >
                                        </>
                                    }

                                </>
                            }

                            {dispositivoSelecionado.tipo.associavelLocalizacao &&
                                <>
                                    <Segment>
                                        <b>Selecione um compartimento ou container (beta)</b><br /><br />

                                        <Grid stackable columns={3}  >
                                            <Grid.Column >

                                                <Form.Field>
                                                    <Checkbox
                                                        radio
                                                        label='Compartimento'
                                                        name='checkboxRadioGroup'
                                                        value='compartimento'
                                                        checked={this.state.localizacaoTipo === 'compartimento'}
                                                        onChange={this.handleChangeCheckBoxLocalizacao}
                                                    />
                                                </Form.Field>
                                                <Form.Field>
                                                    <Checkbox
                                                        radio
                                                        label='Container'
                                                        name='checkboxRadioGroup'
                                                        value='container'
                                                        checked={this.state.localizacaoTipo === 'container'}
                                                        onChange={this.handleChangeCheckBoxLocalizacao}
                                                    />
                                                </Form.Field>
                                            </Grid.Column>
                                            <Grid.Column>

                                                {this.state.localizacaoTipo === 'compartimento' &&
                                                    <>
                                                        <b>Selecione um compartimento:</b><br />
                                                        <Dropdown
                                                            placeholder="Compartimento"
                                                            search
                                                            selection
                                                            options={this.state.compartimentos}
                                                            onChange={this.handleChangeDropdown}
                                                            value={this.state.compartimento}
                                                            name="compartimento"
                                                        />
                                                    </>
                                                }

                                                {this.state.localizacaoTipo === 'container' &&
                                                    <>
                                                        <b>Selecione um container:</b><br />
                                                        <Dropdown
                                                            placeholder="Container"
                                                            search
                                                            selection
                                                            options={this.state.containers}
                                                            onChange={this.handleChangeDropdown}
                                                            value={this.state.container}
                                                            name="container"
                                                        />
                                                    </>
                                                }
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Button
                                                    onClick={this.handleLimpar.bind(this)}
                                                    size="huge"
                                                >
                                                    {text("geral.cancelar")}
                                                </Button>

                                                <Button
                                                    size="huge"
                                                    color='green'
                                                    onClick={this.handleAssociarLocalizacao.bind(this)}
                                                >
                                                    {text("associacao.inserir-associacao")}
                                                </Button>
                                            </Grid.Column>
                                        </Grid>

                                    </Segment>

                                </>
                            }


                        </>
                    }

                </Form>
            </>
        )
    }
}


