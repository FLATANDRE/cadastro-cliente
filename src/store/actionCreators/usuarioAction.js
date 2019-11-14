
import api from '../../services/api';
import * as actions from '../actions';
import { error_handling } from '../../services/api';
 
import { text } from '../../services/locales';

export const fetchAllUsuario = (busca = '', page = 0, sort = '' , sortDirection = 'asc') => {
    return dispatch => {
        try {
            dispatch({ type : actions.EXECUTANDO_TAREFA_USUARIOS });

            let complemento = "";
            let url = "";

            if (sort !== '') {
                complemento += '&sort=' + sort + "," + (sortDirection === 'ascending' ? 'asc' : 'desc')
            }

            if(busca !== '' && busca != null) {
                complemento += '&q=' + busca;
            }
            
            url = '/autenticacao/usuario?page=' + page + complemento;

            api.get(url)
                .then(response => {
                    dispatch({ type : actions.FETCH_ALL_USUARIOS, payload : response.data});
                })
                .catch(reason => {
                    dispatch({ type : actions.ERRO_USUARIOS, payload : error_handling(reason)});
                });

        } catch (error) {
            throw error;
        }
    }
}

export const filterUsuario = (filterValue) => {
    return dispatch => {
        try {

            dispatch({ type : actions.EXECUTANDO_TAREFA_USUARIOS });

            let busca = "";
            let url = "";

            if (filterValue) {
                busca = "?q=" + filterValue;
            }

            url = '/autenticacao/usuario' + busca;
            api.get(url)
                .then(response => {
                    dispatch({ type : actions.FILTRAR_USUARIOS, payload : response.data});
                })
                .catch(reason => {
                    dispatch({ type : actions.ERRO_USUARIOS, payload : error_handling(reason)});
                });

        } catch (error) {
            throw error;
        }
    }
}

export const addUsuario = (pessoa) => {
    return dispatch => {

        dispatch({ type : actions.EXECUTANDO_TAREFA_USUARIOS });

        let url = "";
        
        url = '/autenticacao/usuario';

        api.post(url, pessoa)
            .then(response => {
                dispatch({ type : actions.SUCESSO_USUARIOS, payload : text('geral.add_success')});
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_USUARIOS, payload : error_handling(reason)});
            });
    }
}

export const editUsuario = (pessoa, id) => {
    return dispatch => {

        dispatch({ type : actions.EXECUTANDO_TAREFA_USUARIOS });

        let url = "";
        
        url = '/autenticacao/usuario/'+id;

        api.put(url, pessoa)
            .then(response => {
                dispatch({ type : actions.SUCESSO_USUARIOS, payload : text('geral.edit_success')});
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_USUARIOS, payload : error_handling(reason)});
            });
    };
};

export const obterPerfis = () => {
    return dispatch => {
        let url = "/autenticacao/usuario/perfis"
        let perfis = [];

        api.get(url)
            .then(response => {
                response.data.forEach((item) => {
                    perfis.push({key: item.id, text: item.nome, value: item.codigo})
                })
                dispatch({ type : actions.FETCH_PERFIS, payload: perfis});
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_USUARIOS, payload : error_handling(reason)});
            });
    }
}