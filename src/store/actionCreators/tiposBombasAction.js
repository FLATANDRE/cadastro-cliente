
import api from '../../services/api';
import * as actions from '../actions';
import { error_handling } from '../../services/api';
 
import { text } from '../../services/locales';

export const fetchAllTiposBombas = (busca = '', page = 0, sort = '' , sortDirection = 'asc') => {
    return dispatch => {
        try {
            dispatch({ type : actions.EXECUTANDO_TAREFA_TIPOS_BOMBAS });

            let complemento = "";
            let url = "";

            if (sort !== '') {
                complemento += '&sort=' + sort + "," + (sortDirection === 'ascending' ? 'asc' : 'desc')
            }

            if(busca !== '' && busca != null) {
                complemento += '&q=' + busca;
            }
            
            url = '/equipamentos/bombas/tipos?page=' + page + complemento;

            api.get(url)
                .then(response => {
                    dispatch({ type : actions.FETCH_ALL_TIPOS_BOMBAS, payload : response.data});
                })
                .catch(reason => {
                    dispatch({ type : actions.ERRO_TIPOS_BOMBAS, payload : error_handling(reason)});
                });

        } catch (error) {
            throw error;
        }
    }
}

export const filterTipoBomba = (filterValue) => {
    return dispatch => {
        try {

            dispatch({ type : actions.EXECUTANDO_TAREFA_TIPOS_BOMBAS });

            let busca = "";
            let url = "";

            if (filterValue) {
                busca = "?q=" + filterValue;
            }

            url = '/equipamentos/bombas/tipos' + busca;
            api.get(url)
                .then(response => {
                    dispatch({ type : actions.FILTRAR_TIPOS_BOMBAS, payload : response.data});
                })
                .catch(reason => {
                    dispatch({ type : actions.ERRO_TIPOS_BOMBAS, payload : error_handling(reason)});
                });

        } catch (error) {
            throw error;
        }
    }
}

export const addTipoBomba = (bomba) => {
    return dispatch => {

        dispatch({ type : actions.EXECUTANDO_TAREFA_TIPOS_BOMBAS });

        let url = "";
        
        url = '/equipamentos/bombas/tipos';
        api.post(url, bomba)
            .then(response => {
                dispatch({ type : actions.SUCESSO_TIPOS_BOMBAS, payload : text('geral.add_success')});
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_TIPOS_BOMBAS, payload : error_handling(reason)});
            });
    }
}

export const editTipoBomba = (bomba, id) => {
    return dispatch => {

        dispatch({ type : actions.EXECUTANDO_TAREFA_TIPOS_BOMBAS });

        let url = "";
        
        url = '/equipamentos/bombas/tipos/'+id;

        api.put(url, bomba)
            .then(response => {
                dispatch({ type : actions.SUCESSO_TIPOS_BOMBAS, payload : text('geral.edit_success')});
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_TIPOS_BOMBAS, payload : error_handling(reason)});
            });
    };
};