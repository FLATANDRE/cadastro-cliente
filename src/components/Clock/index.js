import React, { Component } from 'react';

import api from "../../services/api";
import { Icon, Popup } from 'semantic-ui-react';

export default class Clock extends Component {

    state = {
        hora: '--:--',
        data: '--/--/---',
        timestamp: -1
    }

    componentDidMount() {
        this.handlePing();
        this.interval1 = setInterval(() => this.handlePing(), 300000);//A cada 5 minutos faz uma requisição ao servidor para corrigir a hora
        this.interval2 = setInterval(() => this.handleDateIncrement(), 1000);//A cada segundo incrementa o tempo
    }

    componentWillUnmount() {
        clearInterval(this.interval1);
        clearInterval(this.interval2);
    }

    handlePing = async e => {
        api.get("/ping?salt=" + (new Date().getTime()))
            .then((response) => {
                if (response.data.ping === "aicare") {
                    this.setState({ timestamp: response.data.timestamp }, () => { this.handleDateFormat(); })
                }
            })
    }

    handleDateIncrement = async e => {
        const { timestamp } = this.state;
        if (timestamp > 0) {
            this.setState({ timestamp: (timestamp + 1000) }, () => { this.handleDateFormat(); });
        }
    }

    handleDateFormat = () => {
        const { timestamp } = this.state;
        var date = new Date(timestamp);
        var hora
            = (date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours())
            + ":"
            + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes())
            + ":"
            + (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
        var data
            = (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate())
            + "/"
            + ((date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1))
            + "/"
            + (date.getFullYear() < 10 ? ('0' + date.getFullYear()) : date.getFullYear());
        this.setState({ hora: hora, data: data })
    }

    render() {

        const { hora, data } = this.state;

        return (
            <>
                <Popup content={data} trigger={
                    <Icon name='clock outline' />
                } />
                {hora}
            </>
        )
    }
}