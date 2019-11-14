
import api from '../../services/api';
import * as actions from '../actions';
import { error_handling } from '../../services/api';

import { text } from '../../services/locales';

export const fetchAllModelosEquipamentos = (busca = '', page = 0, sort = '', sortDirection = 'asc') => {
    return dispatch => {
        try {
            dispatch({ type: actions.EXECUTANDO_TAREFA_MODELOS_EQUIPAMENTOS });

            let complemento = "";
            let url = "";

            if (sort !== '') {
                complemento += '&sort=' + sort + "," + (sortDirection === 'ascending' ? 'asc' : 'desc')
            }

            if (busca !== '' && busca != null) {
                complemento += '&q=' + busca;
            }

            url = '/equipamentos/modelos?page=' + page + complemento;

            api.get(url)
                .then(response => {
                    dispatch({ type: actions.FETCH_ALL_MODELOS_EQUIPAMENTOS, payload: response.data });
                })
                .catch(reason => {
                    dispatch({ type: actions.ERRO_MODELOS_EQUIPAMENTOS, payload: error_handling(reason) });
                });

        } catch (error) {
            throw error;
        }
    }
}

export const filterModeloEquipamento = (filterValue) => {
    return dispatch => {
        try {

            dispatch({ type: actions.EXECUTANDO_TAREFA_MODELOS_EQUIPAMENTOS });

            let busca = "";
            let url = "";

            if (filterValue) {
                busca = "?q=" + filterValue;
            }

            url = '/equipamentos/modelos' + busca;

            api.get(url)
                .then(response => {
                    dispatch({ type: actions.FILTRAR_MODELOS_EQUIPAMENTOS, payload: response.data });
                })
                .catch(reason => {
                    console.log('Axios: ', reason);
                    dispatch({ type: actions.ERRO_MODELOS_EQUIPAMENTOS, payload: error_handling(reason) });
                });

        } catch (error) {
            throw error;
        }
    }
}

export const addModeloEquipamento = (modelo) => {
    return dispatch => {

        dispatch({ type: actions.EXECUTANDO_TAREFA_MODELOS_EQUIPAMENTOS });

        let url = "";

        url = '/equipamentos/modelos';

        api.post(url, modelo)
            .then(response => {
                dispatch({ type: actions.SUCESSO_MODELOS_EQUIPAMENTOS, payload: text('geral.add_success') });
            })
            .catch(reason => {
                dispatch({ type: actions.ERRO_MODELOS_EQUIPAMENTOS, payload: error_handling(reason) });
            });
    }
}

export const editModeloEquipamento = (modelo, id) => {
    return dispatch => {

        dispatch({ type: actions.EXECUTANDO_TAREFA_MODELOS_EQUIPAMENTOS });

        let url = "";

        url = '/equipamentos/modelos/' + id;

        api.put(url, modelo)
            .then(response => {
                dispatch({ type: actions.SUCESSO_MODELOS_EQUIPAMENTOS, payload: text('geral.edit_success') });
            })
            .catch(reason => {
                dispatch({ type: actions.ERRO_MODELOS_EQUIPAMENTOS, payload: error_handling(reason) });
            });
    };
};