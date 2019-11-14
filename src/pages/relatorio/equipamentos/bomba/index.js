import React, { Component } from 'react';

import { Statistic } from 'semantic-ui-react'

import { text } from '../../../../services/locales';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default class DetalhesBombaInfusao extends Component {

    state = {
        item: null,
        loading: false,
        error: null
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.item !== this.state.item) {
            this.setState({ item: nextProps.item });
        }
    }

    render() {

        const { item } = this.state;

        return (
            <div>

                {item &&
                    <>
                        <Statistic size="mini" label={text("relatorio-equipamentos.tipo-bomba")} value={item ? (item.tipoBomba.nome) : ''} />
                        <Statistic size="mini" label={text("relatorio-equipamentos.intervalo-manutencao")} value={item ? (item.modelo.intervaloManutencaoObrigatoria) : ''} />
                    </>
                }
            </div>
        );
    }

}