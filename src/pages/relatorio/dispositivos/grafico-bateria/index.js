import React, { Component } from 'react';

import { Segment, Button, Icon, Dropdown, Grid, Header } from 'semantic-ui-react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

import api from '../../../../services/api';
import { text } from '../../../../services/locales';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Calendar } from 'primereact/calendar';

export default class GraficoBateria extends Component {

    state = {
        data: [],
        loading: true,
        pageNumber: 0,
        totalPages: 0,
        totalElements: 0,
        numberOfElements: 0,
        lastPage: true,
        firstPage: true,
        lt: null,
        gt: null,
        pageSize: 30,
        timestamp: -1
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.mac !== null && nextProps.timestamp !== this.state.timestamp) {
            this.setState(
                {
                    mac: nextProps.mac,
                    timestamp: nextProps.timestamp
                },
                () => {
                    this.loadItens();
                }
            );
        }
    }

    loadItens = async (page = 0) => {

        const { mac, lt, gt, pageSize } = this.state;

        if (mac === null) {
            return;
        }

        this.setState({ loading: true, error: null });

        let url = '/eventos?mac=' + mac + '&t=BTR&size=' + pageSize + '&sort=dataHora,desc&page=' + page;

        if (lt != null) {
            url = url + "&lt=" + lt.getTime();
        }

        if (gt != null) {
            url = url + "&gt=" + gt.getTime();
        }


        api.get(url)
            .then((response) => {
                if (response.data.content != null) {
                    this.setState({
                        loading: false,
                        data: response.data.content.reverse(),
                        totalPages: response.data.totalPages,
                        totalElements: response.data.totalElements,
                        lastPage: response.data.last,
                        firstPage: response.data.first,
                        pageNumber: response.data.number,
                        numberOfElements: response.data.numberOfElements
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    loading: false,
                    data: [],
                    error: text("formularios.erro_request")
                });
            });
    };

    handlePreviousPage = () => {
        const { pageNumber, lastPage } = this.state;
        if (lastPage === true) return;

        const novoPageNumber = pageNumber + 1;
        this.loadItens(novoPageNumber);
    }
    handleNextPage = () => {
        const { pageNumber, firstPage } = this.state;
        if (firstPage === true) return;

        const novoPageNumber = pageNumber - 1;
        this.loadItens(novoPageNumber);
    }

    handleChangeDropdown = (e, { name, value }) => {
        this.setState({ [name]: value }, () => { this.loadItens(0); });
    }

    handleRefresh = () => {
        this.loadItens(0);
    }

    render() {

        const { data, lastPage, firstPage, loading } = this.state;

        const optionsPageSize = [
            { key: 10, text: '10', value: 10 },
            { key: 30, text: '30', value: 30 },
            { key: 50, text: '50', value: 50 },
            { key: 100, text: '100', value: 100 },
        ]

        return (

            <div style={{ width: '100%' }}>

                <Grid stackable columns={2} >
                    <Grid.Column>
                        <Header as="h2" > {text("relatorio-dispositivos.bateria-historico")}</Header>
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                        {text("tabelas.filtros")}:&nbsp;
                <Calendar
                            value={this.state.gt}
                            onChange={(e) => this.setState({ gt: e.value })}
                            name="gt"
                            showTime={true}
                            showSeconds={true}
                            dateFormat="dd/mm/yy"
                            showButtonBar={true}
                            hideOnDateTimeSelect={true}
                            placeholder={text("tabelas.filtro-data-inicial")}
                        ></Calendar>
                        &nbsp;-&nbsp;
                <Calendar
                            value={this.state.lt}
                            onChange={(e) => this.setState({ lt: e.value })}
                            name="lt"
                            showTime={true}
                            showSeconds={true}
                            showButtonBar={true}
                            hideOnDateTimeSelect={true}
                            placeholder={text("tabelas.filtro-data-final")}
                        ></Calendar>
                        &nbsp;
                <Button icon size='medium' onClick={this.handleRefresh} loading={loading}>
                            <Icon name='refresh' />
                        </Button>
                    </Grid.Column>
                </Grid>

                {data.length ? (
                    <>
                        <ResponsiveContainer height={400}>
                            <LineChart
                                data={data}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="dataHoraFormatada" />
                                <YAxis domain={[2400, 4300]} />
                                <Tooltip />
                                <Line type="monotone" dataKey="dado" name={text("relatorio-dispositivos.bateria")} />
                            </LineChart>
                        </ResponsiveContainer>
                    </>
                ) : (
                        <Segment>{text("geral.nao_disponivel")}</Segment>
                    )}
                {text("tabelas.tamanho-pagina")}&nbsp;
            <Dropdown
                    compact
                    selection
                    value={this.state.pageSize}
                    options={optionsPageSize}
                    onChange={this.handleChangeDropdown}
                    name="pageSize"
                />

                <Button
                    disabled={firstPage}
                    floated='right'
                    icon labelPosition='right'
                    size='medium'
                    onClick={this.handleNextPage}
                >
                    <Icon name='angle right' />  {text("tabelas.proxima-pagina")}
                </Button>
                <Button
                    disabled={lastPage}
                    floated='right'
                    icon labelPosition='left'
                    size='medium'
                    onClick={this.handlePreviousPage}
                >
                    <Icon name='angle left' />  {text("tabelas.pagina-anterior")}
                </Button>



            </div>
        );
    }

}