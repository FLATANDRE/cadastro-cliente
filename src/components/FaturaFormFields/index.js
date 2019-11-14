import React from 'react';
import { Form, Dropdown, Divider, Button, Icon } from 'semantic-ui-react';
import { text } from '../../services/locales';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import {InputTextarea} from 'primereact/inputtextarea';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import CurrencyFormat from 'react-currency-format';

function FaturaFormFields({values, 
                            handleChange,
                            handleBlur,
                            handleCurrencyFormat,
                            setFieldValue,
                            handleChoose,
                            setItemField,
                            addItemFatura,
                            objetoInseridoItem,
                            naturezaOptions,
                            contratoOptions,
                            pessoaJuridicaOptions,
                            tipoItemOptions,
                            itemOptions,
                            itemFatura,
                            tipoItemLabel}) {
   
    return (
        <>
            <Form.Group widths='equal'>
                <div className="field required">
                    <label>{text("fatura.numero-nota-fiscal")}</label>
                    <InputText
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.numeroNotaFiscal}
                        name="numeroNotaFiscal"
                    />
                </div>

                <div className="field required">
                    <label>{text("fatura.data")}</label>
                    <InputMask
                        mask="99/99/9999"
                        slotChar="dd/mm/yyyy"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.data}
                        name="data"
                    />
                </div>

                <div className="field required">
                    <label>{text("fatura.natureza")}</label>
                    <Dropdown
                        options={naturezaOptions}
                        selection
                        search
                        onChange={(e, { value }) => setFieldValue("natureza", value)}
                        name="natureza"
                        value={values.natureza} 
                    />
                </div>
            </Form.Group>

            <Form.Group widths='equal'>
                <div className="field">
                    <label>{text("fatura.contrato")}</label>
                    <Dropdown
                        options={contratoOptions}
                        selection
                        search
                        onChange={(e, { value }) => setFieldValue("contrato", value)}
                        name="contrato"
                        value={values.contrato} 
                    />
                </div>

                <div className="field required">
                    <label>{text("fatura.cliente-faturado")}</label>
                    <Dropdown
                        options={pessoaJuridicaOptions}
                        selection
                        search
                        onChange={(e, { value }) => setFieldValue("pessoaJuridica", value)}
                        name="pessoaJuridica"
                        value={values.pessoaJuridica} 
                    />
                </div>
            </Form.Group>

            <Form.Group widths='equal'>
                <div className="field">
                    <label>{text("fatura.descricao")}</label>
                    <InputTextarea 
                        rows={5} 
                        cols={30} 
                        value={values.descricao} 
                        onChange={(e) => setFieldValue("descricao", e.target.value)}
                        name="descricao"
                    />
                </div>
            </Form.Group>

            <br />
            <Divider />
            <h2>{text("fatura.itens")}</h2>

            <Form.Group widths='equal'>
                <div className="field">
                    <label>{text("fatura.tipo-item")}</label>
                    <Dropdown
                        options={tipoItemOptions}
                        selection
                        search
                        onChange={(e, { value }) => {
                            handleChoose(value);
                            setItemField("tipoItem", value);
                        }}
                        name="tipoItem"
                        value={itemFatura.tipoItem}
                    />
                </div>

                <div className="field">
                    <label>{text(tipoItemLabel)}</label>
                    <Dropdown
                        options={itemOptions}
                        selection
                        search
                        onChange={(e, { value }) => setItemField("item", value)}
                        name="item"
                        value={itemFatura.item}
                    />
                </div>

                <div className="field">
                    <label>{text("fatura.quantidade")}</label>
                    <InputText
                        onChange={(e) => setItemField("quantidade", e)}
                        keyfilter="int"
                        name="quantidade"
                        value={itemFatura.quantidade}
                    />
                </div>

                <div className="field">
                    <label>{text("fatura.valor-unitario")}</label>
                    <CurrencyFormat
                        name='precoUnitario'
                        onChange={(e) => setItemField("precoUnitario", e)}
                        onBlur={(e) => handleCurrencyFormat('precoUnitario', itemFatura)}
                        className="form-control"
                        decimalSeparator={','}
                        decimalScale={2}
                        fixedDecimalScale={false}
                        thousandSeparator={'.'}
                        value={itemFatura.precoUnitario} />
                </div>                                   

            </Form.Group>

            <br />
            <div style={{ marginBottom: "50px" }}>
            <Button
                type='button'
                floated='right'
                icon 
                color="green"
                size='large'
                labelPosition='right'
                disabled={objetoInseridoItem}
                onClick={addItemFatura}
            >
                <Icon name='plus' /> {text("geral.adicionar")}
            </Button>
            </div>
        </>
    )
}

export default FaturaFormFields;