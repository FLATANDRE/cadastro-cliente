import React from 'react';
import { Button, Form, Icon, Message, Dropdown, Table, Modal } from 'semantic-ui-react';
import { text } from '../../services/locales';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import CurrencyFormat from 'react-currency-format';

function InsumoModalForm({condicaoContratual, 
                          contrato, 
                          insumo,
                          listaInsumo,
                          isInserindo, 
                          isOpen, 
                          isObjetoInseridoInsumo,
                          error,                          
                          tiposInsumoOptions,
                          handleCloseInsumo,
                          handleAddInsumo,
                          handleRemoveInsumo,
                          handleShowInsumo,
                          handleCurrencyFormat,
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
                    onClick={handleShowInsumo}
                >
                    <Icon name='plus' /> {text("geral.adicionar") + " " + text("contrato.insumos")}
                </Button>

                <Modal
                    onClose={handleCloseInsumo}
                    open={isOpen}
                    closeIcon
                    centered={true}
                    size={'large'}>
                    <Modal.Header>
                        {text("geral.adicionar") + " " + text("contrato.insumos")}&nbsp;
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
                                <label>{text("contrato.tipo-insumo")}</label>
                                <Dropdown
                                    options={tiposInsumoOptions}
                                    selection
                                    search
                                    fluid
                                    value={insumo.tipoInsumo}
                                    onChange={(e, { value }) => setField('tipoInsumo', value)}
                                    name="tipoInsumo"
                                />
                            </div>

                            <div className="field required">
                                <label>{text("contrato.quantidade-minima")}</label>
                                <InputText
                                    name="quantidadeMinima"
                                    keyfilter={"int"}
                                    onBlur={(e) => setField('quantidadeMinima', e)}
                                />
                            </div>

                            <div className="field">
                                <label>{text("contrato.descricao")}</label>
                                <InputTextarea
                                    name="descricao"
                                    row={5}
                                    onBlur={(e) => setField('descricao', e)}
                                />
                            </div>

                            <div className="field required">
                                <label>{text("contrato.preco-contratado")}</label>
                                <CurrencyFormat
                                    name='precoContratado'
                                    value={insumo.precoContratado}
                                    onChange={(e) => setField('precoContratado', e)}
                                    onBlur={(e) => handleCurrencyFormat('precoContratado', 'insumo', insumo)}
                                    className="form-control"
                                    decimalSeparator={','}
                                    decimalScale={2}
                                    fixedDecimalScale={false}
                                    thousandSeparator={'.'} />
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
                                onClick={handleCloseInsumo}
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
                                disabled={!isObjetoInseridoInsumo}
                                onClick={handleAddInsumo}
                            >
                                <Icon name='save' /> {text("geral.adicionar") + " " + text("contrato.insumos")}
                            </Button>
                        </div>
                    </Modal.Content>
                </Modal>
                </Form.Group>
                <Form.Group>
                <Table celled striped selectable >
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>{text("contrato.tipo-insumo")}</Table.HeaderCell>
                            <Table.HeaderCell>{text("contrato.quantidade-minima")}</Table.HeaderCell>
                            <Table.HeaderCell>{text("contrato.descricao")}</Table.HeaderCell>
                            <Table.HeaderCell>{text("contrato.preco-contratado")}</Table.HeaderCell>
                            <Table.HeaderCell>{text("tabelas.remover")}</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>

                        {listaInsumo.length > 0 &&
                            listaInsumo.map((insumo, index) =>
                                <Table.Row key={index} >
                                    <Table.Cell style={{ textAlign: "center" }}>
                                        {insumo.tipoInsumo.nome}
                                    </Table.Cell>
                                    <Table.Cell style={{ textAlign: "center" }}>
                                        {insumo.quantidadeMinima}
                                    </Table.Cell>
                                    <Table.Cell style={{ textAlign: "center" }}>
                                        {insumo.descricao}
                                    </Table.Cell>
                                    <Table.Cell style={{ textAlign: "center" }}>
                                        <CurrencyFormat
                                            value={insumo.id ? insumo.precoContratado : insumo.precoContratado.replace('.', ',')}
                                            displayType={'text'}
                                            prefix={'R$ '}
                                            decimalSeparator={','}
                                            decimalScale={2}
                                            fixedDecimalScale={insumo.id ? true : false}
                                            thousandSeparator={'.'} />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button
                                            type='button'
                                            color='red'
                                            icon
                                            size='mini'
                                            onClick={() => handleRemoveInsumo(index)}
                                        > <Icon name='delete' />
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        }

                        {listaInsumo.length <= 0 &&
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

export default InsumoModalForm;
