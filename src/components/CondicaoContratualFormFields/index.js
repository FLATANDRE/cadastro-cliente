import React from 'react';
import { Form } from 'semantic-ui-react';
import { text } from '../../services/locales';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { InputMask } from 'primereact/inputmask';

function CondicaoContratualFormFields({condicaoContratual, 
                                        setField}) {
   
    const checkDataAssinatura = () => {

        if (condicaoContratual) {

            if (condicaoContratual.dataAssinaturaFormatada) {
                return condicaoContratual.dataAssinaturaFormatada;
            } else {
                return condicaoContratual.dataAssinatura;
            }
        } else {
            return "";
        }
    }

    const checkDataEncerramento = () => {

        if (condicaoContratual) {

            if (condicaoContratual.dataEncerramentoFormatada) {
                return condicaoContratual.dataEncerramentoFormatada;
            } else {
                return condicaoContratual.dataEncerramento;
            }
        } else {
            return "";
        }
    }

    return (
        <>
            <Form.Group widths='equal'>
                <div className="field required">
                    <label>{text("contrato.data-assinatura")}</label>
                    <InputMask
                        mask="99/99/9999"
                        placeholder="99/99/9999"
                        slotChar="dd/mm/yyyy"
                        name="dataAssinatura"
                        value={checkDataAssinatura()}
                        autoComplete={"off"}
                        onChange={(e) => setField('dataAssinatura', e)}
                    >
                    </InputMask>
                </div>

                <div className="field">
                    <label>{text("contrato.data-encerramento")}</label>
                    <InputMask
                        mask="99/99/9999"
                        placeholder="99/99/9999"
                        slotChar="dd/mm/yyyy"
                        name="dataEncerramento"
                        value={checkDataEncerramento()}
                        autoComplete={"off"}
                        onChange={(e) => setField('dataEncerramento', e)}
                    >
                    </InputMask>
                </div>
            </Form.Group>
        </>
    )
}

export default CondicaoContratualFormFields;