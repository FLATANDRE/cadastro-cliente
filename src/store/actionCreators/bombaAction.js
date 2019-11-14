
import api from '../../services/api';
import * as actions from '../actions';
import { error_handling } from '../../services/api';
import { text } from '../../services/locales';

export const fetchAllBomba = (busca = '', page = 0, sort = '', sortDirection = 'asc') => {
    return dispatch => {
        try {
            dispatch({ type: actions.EXECUTANDO_TAREFA_BOMBAS });

            let complemento = "";
            let url = "";

            if (sort !== '') {
                complemento += '&sort=' + sort + "," + (sortDirection === 'ascending' ? 'asc' : 'desc')
            }

            if (busca !== '' && busca != null) {
                complemento += '&q=' + busca;
            }

            url = '/equipamentos/bombas?page=' + page + complemento;

            api.get(url)
                .then(response => {
                    dispatch({ type: actions.FETCH_ALL_BOMBAS, payload: response.data });
                })
                .catch(reason => {
                    dispatch({ type: actions.ERRO_BOMBAS, payload: error_handling(reason) });
                });

        } catch (error) {
            throw error;
        }
    }
}

export const filterBomba = (filterValue) => {
    return dispatch => {
        try {

            dispatch({ type: actions.EXECUTANDO_TAREFA_BOMBAS });

            let busca = "";
            let url = "";

            if (filterValue) {
                busca = "?q=" + filterValue;
            }

            url = '/equipamentos/bombas' + busca;

            api.get(url)
                .then(response => {
                    dispatch({ type: actions.FILTRAR_BOMBAS, payload: response.data });
                })
                .catch(reason => {
                    dispatch({ type: actions.ERRO_BOMBAS, payload: error_handling(reason) });
                });

        } catch (error) {
            throw error;
        }
    }
}

export const addBomba = (pessoa) => {
    return dispatch => {

        dispatch({ type: actions.EXECUTANDO_TAREFA_BOMBAS });

        let url = "";

        url = '/equipamentos/bombas';

        api.post(url, pessoa)
            .then(response => {
                dispatch({ type: actions.SUCESSO_BOMBAS, payload: text('geral.add_success') });
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_BOMBAS, payload :error_handling(reason)});
            });
    }
}

export const editBomba = (pessoa, id) => {
    return dispatch => {

        dispatch({ type: actions.EXECUTANDO_TAREFA_BOMBAS });

        let url = "";

        url = '/equipamentos/bombas/' + id;

        api.put(url, pessoa)
            .then(response => {
                dispatch({ type: actions.SUCESSO_BOMBAS, payload: text('geral.edit_success') });
            })
            .catch(reason => {
                dispatch({ type: actions.ERRO_BOMBAS, payload: error_handling(reason) });
            });
    };
};