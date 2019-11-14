
import api from '../../services/api';
import * as actions from '../actions';
import { error_handling } from '../../services/api';
 
import { text } from '../../services/locales';

export const fetchAll = (busca = '', localizacao = 0, page = 0, sort = '', sortDirection = 'asc') => {
    return dispatch => {
        try {
            dispatch({ type: actions.EXECUTANDO_TAREFA_CONTAINERS });

            let nome = "";
            let idPessoaJuridica = "";
            let url = "";
            if (sort !== '') {
                nome += '&sort=' + sort + "," + (sortDirection === 'ascending' ? 'asc' : 'desc')
            }

            if (busca !== '' && busca != null) {
                nome += '&q=' + busca;
            }

            idPessoaJuridica += '&c=' + localizacao;
            url = 'predial/container?page=' + page + nome + idPessoaJuridica;
            api.get(url)
                .then(response => {
                    dispatch({ type: actions.FETCH_ALL_CONTAINERS, payload: response.data });
                })
                .catch(reason => {
                    dispatch({ type: actions.ERRO_CONTAINERS, payload: error_handling(reason) });
                });

        } catch (error) {
            throw error;
        }
    }
}

export const filterContainers = (filterValue) => {
    return dispatch => {
        try {

            dispatch({ type: actions.EXECUTANDO_TAREFA_CONTAINERS });

            let busca = "";
            let url = "";

            if (filterValue) {
                busca = "?q=" + filterValue;
            }

            url = '/predial/container' + busca;

            api.get(url)
                .then(response => {
                    dispatch({ type: actions.FILTRAR_CONTAINERS, payload: response.data });
                })
                .catch(reason => {
                    dispatch({ type: actions.ERRO_CONTAINERS, payload: error_handling(reason) });
                });

        } catch (error) {
            throw error;
        }
    }
}

export const addContainer = (Container) => {
    return dispatch => {

        dispatch({ type: actions.EXECUTANDO_TAREFA_CONTAINERS });

        let url = "";

        url = '/predial/container';

        api.post(url, Container)
            .then(response => {
                dispatch({ type: actions.SUCESSO_CONTAINERS, payload: text('geral.add_success') });
            })
            .catch(reason => {
                dispatch({ type: actions.ERRO_CONTAINERS, payload: error_handling(reason) });
            });

    }
}

export const editContainer = (Container, id) => {
    return dispatch => {

        dispatch({ type: actions.EXECUTANDO_TAREFA_CONTAINERS });

        let url = "";
        url = '/predial/container/' + id;

        api.put(url, Container)
            .then(response => {
                dispatch({ type: actions.SUCESSO_CONTAINERS, payload: text('geral.edit_success') });
            })
            .catch(reason => {
                dispatch({ type: actions.ERRO_CONTAINERS, payload: error_handling(reason) });
            });
    }
}
