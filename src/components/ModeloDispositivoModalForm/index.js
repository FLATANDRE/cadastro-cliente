import React from 'react';
import { Button, Form, Icon, Message, Dropdown, Table, Modal } from 'semantic-ui-react';
import { text } from '../../services/locales';
import { tiposObjetoContratado } from '../../utils/types';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import CurrencyFormat from 'react-currency-format';

function ModeloDispositivoModalForm({condicaoContratual, 
                          contrato, 
                          modelo,
                          listaModelo,
                          isInserindo, 
                          isOpen, 
                          isObjetoInseridoModelo,
                          error,                          
                          modeloOptions,
                          handleClose,
                          handleAddModelo,
                          handleRemoveModelo,
                          handleShowModelo,
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
                icon 
                labelPosition='right'
                size="medium"
                style={{ minWidth: "290px", maxWidth: "290px" }}
                onClick={() => handleShowModelo(tiposObjetoContratado.dispositivo)}
            >
                <Icon name='plus' /> 
                {text("geral.adicionar") + " " + 
                text("contrato.modelo") + " " + 
                text("contrato.dispositivo")}
            </Button>
            <Modal
                onClose={() => handleClose(tiposObjetoContratado.dispositivo)}
                open={isOpen}
                closeIcon
                centered={true}
                size={'large'}>
                <Modal.Header>
                    {text("geral.adicionar") + " " + text("contrato.modelo") + " " + text("contrato.dispositivo") + " "} 
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
                        <Form.Group widths='equal'>
                            <div className="field required">
                                <label>{text("contrato.modelo")}</label>
                                <Dropdown
                                    options={modeloOptions}
                                    selection
                                    search
                                    fluid
                                    value={modelo.modeloDispositivo ? modelo.modeloDispositivo : ""}
                                    onChange={(e, { value }) => setField('modelo', tiposObjetoContratado.dispositivo,  value)}
                                    name="modelo"
                                />
                            </div>

                            <div className="field required">
                                <label>{text("contrato.uid-instance-id")}</label>
                                <InputText
                                    name="uidInstanceId"
                                    autoComplete={"off"}
                                    onBlur={(e) => setField('uidInstanceId', tiposObjetoContratado.dispositivo, e)}
                                />
                            </div>                            
                       
                            <div className="field required">
                                <label>{text("contrato.qtd-contratada")}</label>
                                <InputText
                                    name="quantidadeContratada"
                                    keyfilter={"int"}
                                    autoComplete={"off"}
                                    value={modelo.quantidadeContratada}
                                    onChange={(e) => setField('quantidadeContratada', tiposObjetoContratado.dispositivo,  e)}
                                />
                            </div>
                        </Form.Group>

                        <Form.Group widths='equal'>
                            <div className="field required">
                                <label>{text("contrato.preco-instalacao")}</label>
                                <CurrencyFormat
                                    name='precoInstalacao'
                                    value={modelo.precoInstalacao}
                                    onChange={(e) => setField('precoInstalacao', tiposObjetoContratado.dispositivo, e)}
                                    onBlur={(e) => handleCurrencyFormat('precoInstalacao', 'modelo', modelo)}
                                    className="form-control"
                                    decimalSeparator={','}
                                    decimalScale={2}
                                    fixedDecimalScale={false}
                                    thousandSeparator={'.'} />
                            </div>

                            <div className="field required">
                                <label>{text("contrato.preco-manutencao")}</label>
                                <CurrencyFormat
                                    name='precoManutencao'
                                    value={modelo.precoManutencao}
                                    onChange={(e) => setField('precoManutencao', tiposObjetoContratado.dispositivo, e)}
                                    onBlur={(e) => handleCurrencyFormat('precoManutencao', 'modelo', modelo)}
                                    className="form-control"
                                    decimalSeparator={','}
                                    decimalScale={2}
                                    fixedDecimalScale={false}
                                    thousandSeparator={'.'} />
                            </div>
                        </Form.Group>

                        <Form.Group widths='equal'>
                            <div className="field required">
                                <label>{text("contrato.preco-venda")}</label>
                                <CurrencyFormat
                                    name='precoVenda'
                                    value={modelo.precoVenda}
                                    onChange={(e) => setField('precoVenda', tiposObjetoContratado.dispositivo, e)}
                                    onBlur={(e) => handleCurrencyFormat('precoVenda', 'modelo', modelo)}
                                    className="form-control"
                                    decimalSeparator={','}
                                    decimalScale={2}
                                    fixedDecimalScale={false}
                                    thousandSeparator={'.'} />
                            </div>

                            <div className="field required">
                                <label>{text("contrato.preco-aluguel")}</label>
                                <CurrencyFormat
                                    name='precoAluguel'
                                    value={modelo.precoAluguel}
                                    onChange={(e) => setField('precoAluguel', tiposObjetoContratado.dispositivo, e)}
                                    onBlur={(e) => handleCurrencyFormat('precoAluguel', 'modelo', modelo)}
                                    className="form-control"
                                    decimalSeparator={','}
                                    decimalScale={2}
                                    fixedDecimalScale={false}
                                    thousandSeparator={'.'} />
                            </div>

                            <div className="field required">
                                <label>{text("contrato.preco-servico")}</label>
                                <CurrencyFormat
                                    name='precoServico'
                                    value={modelo.precoServico}
                                    onChange={(e) => setField('precoServico', tiposObjetoContratado.dispositivo, e)}
                                    onBlur={(e) => handleCurrencyFormat('precoServico', 'modelo', modelo)}
                                    className="form-control"
                                    decimalSeparator={','}
                                    decimalScale={2}
                                    fixedDecimalScale={false}
                                    thousandSeparator={'.'} />
                            </div>
                        </Form.Group>

                    </Form>

                    <br />
                    <div style={{ marginBottom: "50px" }}>
                        <Button
                            type='button'
                            floated='left'
                            icon
                            labelPosition='left'
                            size="medium"
                            onClick={() => handleClose(tiposObjetoContratado.dispositivo)}
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
                            disabled={!isObjetoInseridoModelo}
                            onClick={() => handleAddModelo(tiposObjetoContratado.dispositivo)}
                        >
                            <Icon name='save' /> {text("geral.adicionar") + " " + text("contrato.modelo")}
                        </Button>
                    </div>
                </Modal.Content>
            </Modal>
        </Form.Group>
        <Form.Group>
            <Table celled striped selectable >
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>{text("contrato.modelo")}</Table.HeaderCell>
                        <Table.HeaderCell>{text("contrato.uid-instance-id")}</Table.HeaderCell>                       
                        <Table.HeaderCell>{text("contrato.qtd-contratada")}</Table.HeaderCell>
                        <Table.HeaderCell>{text("contrato.preco-instalacao")}</Table.HeaderCell>
                        <Table.HeaderCell>{text("contrato.preco-manutencao")}</Table.HeaderCell>
                        <Table.HeaderCell>{text("contrato.preco-venda")}</Table.HeaderCell>
                        <Table.HeaderCell>{text("contrato.preco-aluguel")}</Table.HeaderCell>
                        <Table.HeaderCell>{text("contrato.preco-servico")}</Table.HeaderCell>
                        <Table.HeaderCell>{text("tabelas.remover")}</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>

                    {listaModelo && 
                        listaModelo.length > 0 &&
                            listaModelo.map((modelo, index) =>
                            
                            <Table.Row key={index} >
                                <Table.Cell style={{ textAlign: "center" }}>
                                    { modelo.modeloDispositivo && modelo.modeloDispositivo.nome}
                                </Table.Cell>
                                <Table.Cell style={{ textAlign: "center" }}>{modelo.uidInstanceId}</Table.Cell> 
                                <Table.Cell style={{ textAlign: "center" }}>{modelo.quantidadeContratada}</Table.Cell>
                                <Table.Cell style={{ textAlign: "center" }}>
                                    <CurrencyFormat
                                        value={modelo.id ? modelo.precoInstalacao : modelo.precoInstalacao.replace('.', ',')}
                                        displayType={'text'}
                                        prefix={'R$ '}
                                        decimalSeparator={','}
                                        decimalScale={2}
                                        fixedDecimalScale={modelo.id ? true : false}
                                        thousandSeparator={'.'} />

                                </Table.Cell>
                                <Table.Cell style={{ textAlign: "center" }}>
                                    <CurrencyFormat
                                        value={modelo.id ? modelo.precoManutencao : modelo.precoManutencao.replace('.', ',')}
                                        displayType={'text'}
                                        prefix={'R$ '}
                                        decimalSeparator={','}
                                        decimalScale={2}
                                        fixedDecimalScale={modelo.id ? true : false}
                                        thousandSeparator={'.'} />

                                </Table.Cell>
                                <Table.Cell style={{ textAlign: "center" }}>
                                    <CurrencyFormat
                                        value={modelo.id ? modelo.precoVenda : modelo.precoVenda.replace('.', ',')}
                                        displayType={'text'}
                                        prefix={'R$ '}
                                        decimalSeparator={','}
                                        decimalScale={2}
                                        fixedDecimalScale={modelo.id ? true : false}
                                        thousandSeparator={'.'} />
                                </Table.Cell>
                                <Table.Cell style={{ textAlign: "center" }}>
                                    <CurrencyFormat
                                        value={modelo.id ? modelo.precoAluguel : modelo.precoAluguel.replace('.', ',')}
                                        displayType={'text'}
                                        prefix={'R$ '}
                                        decimalSeparator={','}
                                        decimalScale={2}
                                        fixedDecimalScale={modelo.id ? true : false}
                                        thousandSeparator={'.'} />

                                </Table.Cell>
                                <Table.Cell style={{ textAlign: "center" }}>
                                    <CurrencyFormat
                                        value={modelo.id ? modelo.precoServico : modelo.precoServico.replace('.', ',')}
                                        displayType={'text'}
                                        prefix={'R$ '}
                                        decimalSeparator={','}
                                        decimalScale={2}
                                        fixedDecimalScale={modelo.id ? true : false}
                                        thousandSeparator={'.'} />
                                </Table.Cell>
                                <Table.Cell>
                                    <Button
                                        type='button'
                                        color='red'
                                        icon
                                        size='mini'
                                        onClick={() => handleRemoveModelo(index, tiposObjetoContratado.dispositivo)}
                                    > <Icon name='delete' />
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        )
                    }

                    { (!listaModelo ||
                        listaModelo.length <= 0) &&

                        <Table.Row >
                            <Table.Cell colSpan="11" style={{ textAlign: "center" }}>
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


export default ModeloDispositivoModalForm;