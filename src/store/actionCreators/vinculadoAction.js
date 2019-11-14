import api from '../../services/api';
import * as actions from '../actions';
import { reverseData } from '../../utils/functions';
import { error_handling } from '../../services/api';
 
import { text } from '../../services/locales';

export const fetchAllVinculado = (busca = '', page = 0, sort = '', sortDirection = 'asc') => {
    return dispatch => {
        try {
            dispatch({ type: actions.EXECUTANDO_TAREFA_VINCULADOS });

            let matricula = "";
            let url = "";

            if (sort !== '') {
                matricula += '&sort=' + sort + "," + (sortDirection === 'ascending' ? 'asc' : 'desc')
            }

            if (busca !== '' && busca != null) {
                matricula += '&q=' + busca;
            }

            url = '/pessoal/vinculado?page=' + page + matricula;
            api.get(url)
                .then(response => {
                    dispatch({ type: actions.FETCH_ALL_VINCULADOS, payload: response.data });
                })
                .catch(reason => {
                    dispatch({ type: actions.ERRO_VINCULADOS, payload: error_handling(reason) });
                });

        } catch (error) {
            throw error;
        }
    }
}

export const filterVinculado = (filterValue) => {
    return dispatch => {
        try {

            dispatch({ type: actions.EXECUTANDO_TAREFA_VINCULADOS });

            let busca = "";
            let url = "";

            if (filterValue) {
                busca = "?q=" + filterValue;
            }

            url = '/pessoal/vinculado' + busca;
            api.get(url)
                .then(response => {
                    dispatch({ type: actions.FETCH_ALL_VINCULADOS, payload: response.data });
                })
                .catch(reason => {
                    dispatch({ type: actions.ERRO_VINCULADOS, payload: error_handling(reason) });
                });


        } catch (error) {
            throw error;
        }
    }
}

export const addVinculado = (vinculado) => {
    return dispatch => {

        dispatch({ type: actions.EXECUTANDO_TAREFA_VINCULADOS });

        let url = '/pessoal/vinculado';
        vinculado = tratarFields(vinculado);
        api.post(url, vinculado)
            .then(_response => {
                dispatch({ type: actions.SUCESSO_VINCULADOS, payload: text('geral.add_success') });
            })
            .catch(reason => {
                dispatch({ type: actions.ERRO_VINCULADOS, payload: error_handling(reason) });
            });
    }
}

export const editVinculado = (vinculado) => {
    return dispatch => {

        dispatch({ type: actions.EXECUTANDO_TAREFA_VINCULADOS });

        let url = '/pessoal/vinculado/' + vinculado.id;
        vinculado = tratarFields(vinculado);
        api.put(url, vinculado)
            .then(_response => {
                dispatch({ type: actions.SUCESSO_VINCULADOS, payload: text('geral.edit_success') });
            })
            .catch(reason => {
                dispatch({ type: actions.ERRO_VINCULADOS, payload: error_handling(reason) });
            });
    }
}


export const filterPessoaFisica = (filterValue) => {
    return dispatch => {
        try {

            dispatch({ type: actions.EXECUTANDO_TAREFA_VINCULADOS_PESSOA_FISICA });

            let busca = "";
            let url = "";

            if (filterValue) {
                busca = "?q=" + filterValue;
            }

            url = '/pessoal/pessoas-fisicas' + busca;
            api.get(url)
                .then(response => {
                    dispatch({ type: actions.FETCH_ALL_VINCULADOS_PESSOA_FISICA, payload: response.data });
                })
                .catch(reason => {
                    dispatch({ type: actions.ERRO_VINCULADOS_PESSOA_FISICA, payload: reason.data ? error_handling(reason) : '' });
                });

        } catch (error) {
            throw error;
        }
    }
}

const tratarFields = (vinculado) => {
    vinculado.inicio = vinculado.inicio ? reverseData(vinculado.inicio) : '';
    vinculado.fim = vinculado.fim ? reverseData(vinculado.fim) : '';
    return vinculado;
}