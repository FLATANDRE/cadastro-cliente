import React from 'react';
import { Button, Icon, Table } from 'semantic-ui-react';
import { text } from '../../services/locales';

function TableContrato({ 
                    listaCondicoesContratuais,
                    handleRemoveCondicaoContratual,
                    handleEditCondicaoContratual}) {
   
    return (
        <Table celled striped selectable >
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>{text("contrato.numero-aditivo")}</Table.HeaderCell>
                    <Table.HeaderCell>{text("contrato.data-assinatura")}</Table.HeaderCell>
                    <Table.HeaderCell>{text("tabelas.acoes")}</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {listaCondicoesContratuais.length > 0 &&
                    listaCondicoesContratuais.map((condicao, index) =>
                        <Table.Row key={index} >
                            <Table.Cell style={{ textAlign: "center" }}>
                                {condicao.numeroAditivo ? condicao.numeroAditivo : (index + 1)}
                            </Table.Cell>                            
                            <Table.Cell style={{ textAlign: "center" }}>
                                {condicao.dataAssinaturaFormatada ? condicao.dataAssinaturaFormatada : condicao.dataAssinatura}
                            </Table.Cell>
                            <Table.Cell>
                                {condicao.enableRemove &&
                                    <Button
                                        type='button'
                                        color='red'
                                        icon
                                        size='mini'
                                        onClick={() => handleRemoveCondicaoContratual(index)}
                                    > <Icon name='delete' />
                                    </Button>
                                }

                                <Button
                                    type='button'
                                    icon
                                    size='mini'
                                    onClick={() => handleEditCondicaoContratual(index)}
                                > <Icon name='edit' />
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    )
                }


                {listaCondicoesContratuais.length <= 0 &&
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

export default TableContrato;