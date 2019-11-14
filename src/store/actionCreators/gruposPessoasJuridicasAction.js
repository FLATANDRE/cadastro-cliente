import api from '../../services/api';
import * as actions from '../actions';
import { error_handling } from '../../services/api';
 
import { text } from '../../services/locales';

export const fetchAllGruposPessoasJuridicas = (busca = '', page = 0, sort = '' , sortDirection = 'asc') => {
    return dispatch => {
        try {
            dispatch({ type : actions.EXECUTANDO_TAREFA_GRUPOS_PESSOAS_JURIDICAS });

            let complemento = "";
            let url = "";

            if (sort !== '') {
                complemento += '&sort=' + sort + "," + (sortDirection === 'ascending' ? 'asc' : 'desc')
            }

            if(busca !== '' && busca != null) {
                complemento += '&q=' + busca;
            }
            
            url = '/pessoal/grupo-pessoas-juridicas?page=' + page + complemento;

            api.get(url)
                .then(response => {
                    dispatch({ type : actions.FETCH_ALL_GRUPOS_PESSOAS_JURIDICAS, payload : response.data});
                })
                .catch(reason => {
                    console.log('Axios: ', reason);
                    dispatch({ type : actions.ERRO_GRUPOS_PESSOAS_JURIDICAS, payload : error_handling(reason)});
                });

        } catch (error) {
            throw error;
        }
    }
}

export const filterGruposPessoasJuridicas = (filterValue) => {
    return dispatch => {
        try {

            dispatch({ type : actions.EXECUTANDO_TAREFA_GRUPOS_PESSOAS_JURIDICAS });

            let busca = "";
            let url = "";

            if (filterValue) {
                busca = "?q=" + filterValue;
            }

            url = '/pessoal/grupo-pessoas-juridicas' + busca;
            api.get(url)
                .then(response => {
                    dispatch({ type : actions.FILTRAR_GRUPOS_PESSOAS_JURIDICAS, payload : response.data});
                })
                .catch(reason => {
                    dispatch({ type : actions.ERRO_GRUPOS_PESSOAS_JURIDICAS, payload : error_handling(reason)});
                });

        } catch (error) {
            throw error;
        }
    }
}

export const addGrupoPessoaJuridica = (grupo) => {
    return dispatch => {

        dispatch({ type : actions.EXECUTANDO_TAREFA_GRUPOS_PESSOAS_JURIDICAS });

        let url = "";
        
        url = '/pessoal/grupo-pessoas-juridicas';

        api.post(url, grupo)
            .then(response => {
                dispatch({ type : actions.SUCESSO_GRUPOS_PESSOAS_JURIDICAS, payload : text('geral.add_success')});
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_GRUPOS_PESSOAS_JURIDICAS, payload : error_handling(reason)});
            });
    }
}

export const editGrupoPessoaJuridica = (grupo, id) => {
    return dispatch => {

        dispatch({ type : actions.EXECUTANDO_TAREFA_GRUPOS_PESSOAS_JURIDICAS });

        let url = "";
        
        url = '/pessoal/grupo-pessoas-juridicas/'+id;

        api.put(url, grupo)
            .then(response => {
                dispatch({ type : actions.SUCESSO_GRUPOS_PESSOAS_JURIDICAS, payload : text('geral.edit_success')});
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_GRUPOS_PESSOAS_JURIDICAS, payload : error_handling(reason)});
            });
    };
};