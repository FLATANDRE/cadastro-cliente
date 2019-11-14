import api from '../../services/api';
import * as actions from '../actions';
import { error_handling } from '../../services/api';
 
import { text } from '../../services/locales';

export const fetchAllManutencao = (busca = '', page = 0, sort = '' , sortDirection = 'asc') => {
    return dispatch => {
        try {
            dispatch({ type : actions.EXECUTANDO_TAREFA_MANUTENCAO });

            let complemento = "";
            let url = "";

            if (sort !== '') {
                complemento += '&sort=' + sort + "," + (sortDirection === 'ascending' ? 'asc' : 'desc')
            }

            if(busca !== '' && busca != null) {
                complemento += '&q=' + busca;
            }
            
            url = '/equipamentos/manutencoes?page=' + page + complemento;

            api.get(url)
                .then(response => {
                    dispatch({ type : actions.FETCH_ALL_MANUTENCAO, payload : response.data});
                })
                .catch(reason => {
                    dispatch({ type : actions.ERRO_MANUTENCAO, payload : error_handling(reason)});
                });

        } catch (error) {
            throw error;
        }
    }
}

export const filterManutencao = (filterValue) => {
    return dispatch => {
        try {

            dispatch({ type : actions.EXECUTANDO_TAREFA_MANUTENCAO });

            let busca = "";
            let url = "";

            if (filterValue) {
                busca = "?q=" + filterValue;
            }

            url = '/equipamentos/manutencoes' + busca;
            api.get(url)
                .then(response => {
                    dispatch({ type : actions.FILTRAR_MANUTENCAO, payload : response.data});
                })
                .catch(reason => {
                    dispatch({ type : actions.ERRO_MANUTENCAO, payload : error_handling(reason)});
                });

        } catch (error) {
            throw error;
        }
    }
}

export const addManutencao = (manutencao) => {
    return dispatch => {

        dispatch({ type : actions.EXECUTANDO_TAREFA_MANUTENCAO });

        let url = "";
        
        url = '/equipamentos/manutencoes';

        api.post(url, manutencao)
            .then(response => {
                dispatch({ type : actions.SUCESSO_MANUTENCAO, payload : text('geral.add_success')});
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_MANUTENCAO, payload : error_handling(reason)});
            });
    }
}

export const editManutencao = (manutencao, id) => {
    return dispatch => {

        dispatch({ type : actions.EXECUTANDO_TAREFA_MANUTENCAO });

        let url = "";
        
        url = '/equipamentos/manutencoes/'+id;

        api.put(url, manutencao)
            .then(response => {
                dispatch({ type : actions.SUCESSO_MANUTENCAO, payload : text('geral.edit_success')});
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_MANUTENCAO, payload : error_handling(reason)});
            });
    };
};