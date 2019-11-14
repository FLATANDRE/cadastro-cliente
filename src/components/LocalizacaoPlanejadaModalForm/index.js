import React from 'react';
import { Button, Form, Icon, Message, Dropdown, Table, Modal, Label } from 'semantic-ui-react';
import { text } from '../../services/locales';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function LocalizacaoPlanejadaModalForm({
                        condicaoContratual, 
                        contrato, 
                        isInserindo, 
                        isOpenLocalizacaoPlanejada, 
                        isObjetoInseridoLocalizacaoPlanejada,
                        error,
                        listaLocalizacaoPlanejada,
                        localizacaoFisicaOptions,
                        handleCloseLocalizacaoPlanejada,
                        handleAddLocalizacaoPlanejada,
                        handleRemoveLocalizacaoPlanejada,
                        handleShowLocalizacaoPlanejada,
                        setField}) {


    return (
        <>
             <Form.Group>
                <Button
                    primary
                    loading={isInserindo}
                    type='button'
                    floated='right'
                    icon labelPosition='right'
                    size="medium"
                    style={{ minWidth: "290px", maxWidth: "290px" }}
                    disabled={!Array.isArray(localizacaoFisicaOptions)}
                    onClick={handleShowLocalizacaoPlanejada}
                >
                    <Icon name='plus' /> {text("geral.adicionar") + " " + text("contrato.localizacao-planejada")}
                </Button>
                <div style={{ display: Array.isArray(localizacaoFisicaOptions) ? "none" : "visible" }}>
                    <Label basic color='red' pointing='left'>
                        {text("contrato.localizacao-nao-encontrada")}
                    </Label>
                </div>

                <Modal
                    onClose={handleCloseLocalizacaoPlanejada}
                    open={isOpenLocalizacaoPlanejada}
                    closeIcon
                    centered={true}
                    size={'large'}>
                    <Modal.Header>
                        {text("geral.adicionar") + " " + text("contrato.localizacao-planejada")}&nbsp;
                        {contrato && contrato.numero && <>{" - " + text("contrato.titulo-form") + ": " + contrato.numero}</>}&nbsp;
                        {condicaoContratual && condicaoContratual.numeroAditivo && <>{" - " + text("contrato.aditivo") + ": " + condicaoContratual.numeroAditivo}</>}
                    </Modal.Header>
                    <Modal.Content >
                        {error &&
                            <Message negative>
                                <p>{text('contrato.mensagem-erro')}</p>
                                <b>{text('contrato.mensagem-erro-detalhes')}:</b> {error}
                            </Message>
                        }

                        <Form>
                            <div className="field required">
                                <label>{text("contrato.localizacao-planejada")}</label>
                                <Dropdown
                                    placeholder="Escolha uma opção"
                                    options={localizacaoFisicaOptions}
                                    selection
                                    search
                                    onChange={(e, { value }) => setField('localizacaoFisica', value)}
                                    name="localizacaoFisica"
                                />
                            </div>

                            <div className="field required">
                                <label>{text("contrato.quantidade-planejada-dispositivo")}</label>
                                <InputText
                                    name="quantidadePlanejada"
                                    keyfilter={"int"}
                                    onBlur={(e) => setField('quantidadePlanejada', e)}
                                />
                            </div>
                        </Form>

                        <br />
                        <div style={{ marginBottom: "50px" }}>
                            <Button
                                type='button'
                                floated='left'
                                icon
                                labelPosition='left'
                                size="medium"
                                onClick={handleCloseLocalizacaoPlanejada}
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
                                disabled={!isObjetoInseridoLocalizacaoPlanejada}
                                onClick={handleAddLocalizacaoPlanejada}
                            >
                                <Icon name='save' /> {text("geral.adicionar") + " " + text("contrato.localizacao-planejada")}
                            </Button>
                        </div>
                    </Modal.Content>
                </Modal>
                </Form.Group>
                <Form.Group>
                <Table celled striped selectable >
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>{text("contrato.localizacao-planejada")}</Table.HeaderCell>
                            <Table.HeaderCell>{text("contrato.quantidade-planejada-dispositivo")}</Table.HeaderCell>
                            <Table.HeaderCell>{text("tabelas.remover")}</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>

                        {listaLocalizacaoPlanejada.length > 0 &&
                            listaLocalizacaoPlanejada.map((localizacao, index) =>
                                <Table.Row key={index} >
                                    <Table.Cell style={{ textAlign: "center" }}>
                                        {localizacao.localizacaoFisica.nome}
                                    </Table.Cell>
                                    <Table.Cell style={{ textAlign: "center" }}>
                                        {localizacao.quantidadePlanejada}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button
                                            type='button'
                                            color='red'
                                            icon
                                            size='mini'
                                            onClick={() => handleRemoveLocalizacaoPlanejada(index)}
                                        > <Icon name='delete' />
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        }

                        {listaLocalizacaoPlanejada.length <= 0 &&
                            <Table.Row >
                                <Table.Cell colSpan="5" style={{ textAlign: "center" }}>
                                    <b>{text("tabelas.sem-registros")}</b>
                                </Table.Cell>
                            </Table.Row>
                        }

                    </Table.Body>
                </Table>
                </Form.Group>

        </>
    )
}

export default LocalizacaoPlanejadaModalForm;