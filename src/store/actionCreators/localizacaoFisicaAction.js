
import api from '../../services/api';
import * as actions from '../actions';
import { error_handling } from '../../services/api';
 
import { text } from '../../services/locales';

export const fetchAll = (busca = '', pessoaJuridica = 0, page = 0, sort = '', sortDirection = 'asc') => {
    return dispatch => {
        try {
            dispatch({ type: actions.EXECUTANDO_TAREFA_LOCALIZACAO_FISICA });

            let nome = "";
            let idPessoaJuridica = "";
            let url = "";
            if (sort !== '') {
                nome += '&sort=' + sort + "," + (sortDirection === 'ascending' ? 'asc' : 'desc')
            }

            if (busca !== '' && busca != null) {
                nome += '&q=' + busca;
            }

            idPessoaJuridica += '&pj=' + pessoaJuridica;
            url = '/predial/localizacao-fisica?page=' + page + nome + idPessoaJuridica;

            api.get(url)
                .then(response => {
                    dispatch({ type: actions.FETCH_ALL_LOCALIZACAO_FISICA, payload: response.data });
                })
                .catch(reason => {
                    dispatch({ type: actions.ERRO_LOCALIZACAO_FISICA, payload: error_handling(reason) });
                });

        } catch (error) {
            throw error;
        }
    }
}

export const filterLocalizacaoFisica = (filterValue) => {
    return dispatch => {
        try {

            dispatch({ type: actions.EXECUTANDO_TAREFA_LOCALIZACAO_FISICA });

            let busca = "";
            let url = "";

            if (filterValue) {
                busca = "?q=" + filterValue;
            }

            url = '/predial/localizacao-fisica' + busca;

            api.get(url)
                .then(response => {
                    dispatch({ type: actions.FILTRAR_LOCALIZACAO_FISICA, payload: response.data });
                })
                .catch(reason => {
                    dispatch({ type: actions.ERRO_LOCALIZACAO_FISICA, payload: error_handling(reason) });
                });

        } catch (error) {
            throw error;
        }
    }
}

export const addLocalizacaoFisica = (localizacaoFisica) => {
    return dispatch => {

        dispatch({ type: actions.EXECUTANDO_TAREFA_LOCALIZACAO_FISICA });

        let url = "";

        url = '/predial/localizacao-fisica';

        api.post(url, localizacaoFisica)
            .then(response => {
                dispatch({ type: actions.SUCESSO_LOCALIZACAO_FISICA, payload: text('geral.add_success') });
            })
            .catch(reason => {
                dispatch({ type: actions.ERRO_LOCALIZACAO_FISICA, payload: error_handling(reason) });
            });

    }
}

export const editLocalizacaoFisica = (localizacaoFisica) => {
    return dispatch => {

        dispatch({ type: actions.EXECUTANDO_TAREFA_LOCALIZACAO_FISICA });

        let url = "";
        url = '/predial/localizacao-fisica/' + localizacaoFisica.id;

        api.put(url, localizacaoFisica)
            .then(response => {
                dispatch({ type: actions.SUCESSO_LOCALIZACAO_FISICA, payload: text('geral.edit_success') });
            })
            .catch(reason => {
                dispatch({ type: actions.ERRO_LOCALIZACAO_FISICA, payload: error_handling(reason) });
            });
    }
}

export const filterPessoaJuridica = (filterValue) => {
    return dispatch => {
        try {

            dispatch({ type: actions.EXECUTANDO_TAREFA_LOCALIZACAO_PESSOA_JURIDICA });

            let busca = "";
            let url = "";

            if (filterValue) {
                busca = "?q=" + filterValue;
            }

            url = '/pessoal/pessoas-juridicas' + busca;
            api.get(url)
                .then(response => {
                    dispatch({ type: actions.FETCH_ALL_LOCALIZACAO_PESSOA_JURIDICA, payload: response.data });
                })
                .catch(reason => {
                    dispatch({ type: actions.ERRO_LOCALIZACAO_PESSOA_JURIDICA, payload: reason.data ? error_handling(reason) : '' });
                });

        } catch (error) {
            throw error;
        }
    }
}


export const tratarFieldsLocalizacaoFisica = (localizacaoFisica) => {
    return localizacaoFisica;
}
