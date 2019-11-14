import React from 'react';
import { Button, Icon, Table } from 'semantic-ui-react';
import { text } from '../../services/locales';

import CurrencyFormat from 'react-currency-format';

function TableFatura({
    listaItensFatura,
    handleRemove }) {

    return (
        <Table celled striped selectable >
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>{text("fatura.item")}</Table.HeaderCell>
                    <Table.HeaderCell>{text("fatura.quantidade")}</Table.HeaderCell>
                    <Table.HeaderCell>{text("fatura.valor-unitario")}</Table.HeaderCell>
                    <Table.HeaderCell>{text("tabelas.remover")}</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {listaItensFatura.length > 0 &&
                    listaItensFatura.map((item, index) =>
                        <Table.Row key={index} >

                            <Table.Cell style={{ textAlign: "center" }}>
                                {item.item.nome} ({item.tipoItem.toUpperCase()})
                            </Table.Cell>
                            <Table.Cell style={{ textAlign: "center" }}>
                                {item.quantidade}
                            </Table.Cell>
                            <Table.Cell style={{ textAlign: "center" }}>
                                <CurrencyFormat
                                    value={item.precoUnitario}
                                    displayType={'text'}
                                    prefix={'R$ '}
                                    decimalSeparator={','}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    thousandSeparator={'.'} />
                            </Table.Cell>
                            <Table.Cell>
                                <Button
                                    type='button'
                                    color='red'
                                    icon
                                    size='mini'
                                    onClick={() => handleRemove(index)}
                                > <Icon name='delete' />
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    )
                }


                {listaItensFatura.length <= 0 &&
                    <Table.Row >
                        <Table.Cell colSpan="5" style={{ textAlign: "center" }}>
                            <b>{text("tabelas.sem-registros")}</b>
                        </Table.Cell>
                    </Table.Row>
                }
            </Table.Body>
        </Table>
    )
}

export default TableFatura;