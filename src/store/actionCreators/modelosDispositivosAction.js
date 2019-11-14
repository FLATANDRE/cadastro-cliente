
import api from '../../services/api';
import * as actions from '../actions';
import { error_handling } from '../../services/api';

import { text } from '../../services/locales';

export const fetchAllModelosDispositivos = (busca = '', page = 0, sort = '', sortDirection = 'asc') => {
    return dispatch => {
        try {
            dispatch({ type: actions.EXECUTANDO_TAREFA_MODELOS_DISPOSITIVOS });

            let complemento = "";
            let url = "";

            if (sort !== '') {
                complemento += '&sort=' + sort + "," + (sortDirection === 'ascending' ? 'asc' : 'desc')
            }

            if (busca !== '' && busca != null) {
                complemento += '&q=' + busca;
            }

            url = '/dispositivos/modelos?page=' + page + complemento;

            api.get(url)
                .then(response => {
                    dispatch({ type: actions.FETCH_ALL_MODELOS_DISPOSITIVOS, payload: response.data });
                })
                .catch(reason => {
                    dispatch({ type: actions.ERRO_MODELOS_DISPOSITIVOS, payload: error_handling(reason) });
                });

        } catch (error) {
            throw error;
        }
    }
}

export const filterModeloDispositivo = (filterValue) => {
    return dispatch => {
        try {

            dispatch({ type: actions.EXECUTANDO_TAREFA_MODELOS_DISPOSITIVOS });

            let busca = "";
            let url = "";

            if (filterValue) {
                busca = "?q=" + filterValue;
            }

            url = '/dispositivos/modelos' + busca;

            api.get(url)
                .then(response => {
                    dispatch({ type: actions.FILTRAR_MODELOS_DISPOSITIVOS, payload: response.data });
                })
                .catch(reason => {
                    dispatch({ type: actions.ERRO_MODELOS_DISPOSITIVOS, payload: error_handling(reason) });
                });

        } catch (error) {
            throw error;
        }
    }
}

export const addModeloDispositivo = (modelo) => {
    return dispatch => {

        dispatch({ type: actions.EXECUTANDO_TAREFA_MODELOS_DISPOSITIVOS });

        let url = "";

        url = '/dispositivos/modelos';

        api.post(url, modelo)
            .then(response => {
                dispatch({ type: actions.SUCESSO_MODELOS_DISPOSITIVOS, payload: text('geral.add_success') });
            })
            .catch(reason => {
                dispatch({ type: actions.ERRO_MODELOS_DISPOSITIVOS, payload: error_handling(reason) });
            });
    }
}

export const editModeloDispositivo = (modelo, id) => {
    return dispatch => {

        dispatch({ type: actions.EXECUTANDO_TAREFA_MODELOS_DISPOSITIVOS });

        let url = "";

        url = '/dispositivos/modelos/' + id;

        api.put(url, modelo)
            .then(response => {
                dispatch({ type: actions.SUCESSO_MODELOS_DISPOSITIVOS, payload: text('geral.edit_success') });
            })
            .catch(reason => {
                dispatch({ type: actions.ERRO_MODELOS_DISPOSITIVOS, payload: error_handling(reason) });
            });
    };
};