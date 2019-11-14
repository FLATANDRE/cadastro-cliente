
import api from '../../services/api';
import * as actions from '../actions';
import { error_handling } from '../../services/api';
 
import { text } from '../../services/locales';

export const fetchAll = (busca = '', localizacao = 0, page = 0, sort = '', sortDirection = 'asc') => {
    return dispatch => {
        try {
            dispatch({ type: actions.EXECUTANDO_TAREFA_COMPARTIMENTOS });

            let nome = "";
            let idPessoaJuridica = "";
            let url = "";
            if (sort !== '') {
                nome += '&sort=' + sort + "," + (sortDirection === 'ascending' ? 'asc' : 'desc')
            }

            if (busca !== '' && busca != null) {
                nome += '&q=' + busca;
            }

            idPessoaJuridica += '&l=' + localizacao;
            url = 'predial/compartimento?page=' + page + nome + idPessoaJuridica;
            api.get(url)
                .then(response => {

                    dispatch({ type: actions.FETCH_ALL_COMPARTIMENTOS, payload: response.data });
                })
                .catch(reason => {
                    dispatch({ type: actions.ERRO_COMPARTIMENTOS, payload: error_handling(reason) });
                });

        } catch (error) {
            throw error;
        }
    }
}

export const filterCompartimento = (filterValue) => {
    return dispatch => {
        try {

            dispatch({ type: actions.EXECUTANDO_TAREFA_COMPARTIMENTOS });

            let busca = "";
            let url = "";

            if (filterValue) {
                busca = "?q=" + filterValue;
            }

            url = '/predial/compartimento' + busca;

            api.get(url)
                .then(response => {
                    dispatch({ type: actions.FILTRAR_COMPARTIMENTOS, payload: response.data });
                })
                .catch(reason => {
                    dispatch({ type: actions.ERRO_COMPARTIMENTOS, payload: error_handling(reason) });
                });

        } catch (error) {
            throw error;
        }
    }
}

export const addCompartimento = (compartimento) => {
    return dispatch => {

        dispatch({ type: actions.EXECUTANDO_TAREFA_COMPARTIMENTOS });

        let url = "";

        url = '/predial/compartimento';

        api.post(url, compartimento)
            .then(response => {
                dispatch({ type: actions.SUCESSO_COMPARTIMENTOS, payload: text('geral.add_success') });
            })
            .catch(reason => {
                dispatch({ type: actions.ERRO_COMPARTIMENTOS, payload: error_handling(reason) });
            });

    }
}

export const editCompartimento = (compartimento, id) => {
    return dispatch => {

        dispatch({ type: actions.EXECUTANDO_TAREFA_COMPARTIMENTOS });

        let url = "";
        url = '/predial/compartimento/' + id;

        api.put(url, compartimento)
            .then(response => {
                dispatch({ type: actions.SUCESSO_COMPARTIMENTOS, payload: text('geral.edit_success') });
            })
            .catch(reason => {
                dispatch({ type: actions.ERRO_COMPARTIMENTOS, payload: error_handling(reason) });
            });
    }
}
