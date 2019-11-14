
import {pessoaTypes} from '../../utils/types';
import {limparCampo} from '../../utils/functions';
import api from '../../services/api';
import {reverseData} from '../../utils/functions';
import * as actions from '../actions';
import { error_handling } from '../../services/api';
 
import { text } from '../../services/locales';

export const fetchAllPessoa = (type, busca = '', page = '' , sort = '' , sortDirection = 'asc') => {
    return dispatch => {
        try {
            dispatch({ type : actions.EXECUTANDO_TAREFA_PESSOAS });

            let complemento = "";
            let url = "";

            if (sort !== '') {
                complemento += '&sort=' + sort + "," + (sortDirection === 'ascending' ? 'asc' : 'desc')
            }

            if(busca !== '' && busca != null) {
                complemento += '&q=' + busca;
            }

            if (type === pessoaTypes.PESSOA_JURIDICA)  {

                if (page && complemento !== '') {
                    url = '/pessoal/pessoas-juridicas?page=' + page + complemento;
                } else {
                    url = '/pessoal/pessoas-juridicas';
                }
            }  else  if (type === pessoaTypes.PESSOA_FISICA)  {

                if (page && complemento !== '') {
                    url = '/pessoal/pessoas-fisicas?page=' + page + complemento;
                } else {
                    url = '/pessoal/pessoas-fisicas';
                }
            }

            api.get(url)
                .then(response => {
                    let data = response.data;
                    dispatch({ type : actions.FETCH_ALL_PESSOAS, payload : data});
                })
                .catch(reason => {
                    console.log('Axios: ', reason);
                    dispatch({ type : actions.ERRO_PESSOAS, payload: reason.data ?  error_handling(reason): ''});
                });

        } catch (error) {
            throw error;
        }
    }
}

export const filterPessoa = (type, filterValue) => {
    return dispatch => {
        try {

            dispatch({ type : actions.EXECUTANDO_TAREFA_PESSOAS });

            let busca = "";
            let url = "";

            if (filterValue) {
                busca = "?q=" + filterValue;
            }

            if (type === pessoaTypes.PESSOA_JURIDICA)     url = '/pessoal/pessoas-juridicas' + busca;
            else if (type === pessoaTypes.PESSOA_FISICA)  url = '/pessoal/pessoas-fisicas' + busca;

            api.get(url)
                .then(response => {
                    dispatch({ type : actions.FILTRAR_PESSOAS, payload : response.data});
                })
                .catch(reason => {
                    dispatch({ type : actions.ERRO_PESSOAS, payload: reason.data ?  error_handling(reason): ''});
                });

        } catch (error) {
            throw error;
        }
    }
}

export const addPessoa = (pessoa, type) => {
    return dispatch => {

        dispatch({ type : actions.EXECUTANDO_TAREFA_PESSOAS });

        let url = "";
        
        if (type === pessoaTypes.PESSOA_JURIDICA) {
            pessoa = tratarFieldsPJ(pessoa);
            url = '/pessoal/pessoas-juridicas';
               
        } else if (type === pessoaTypes.PESSOA_FISICA) {
            pessoa = tratarFieldsPF(pessoa);
            url = '/pessoal/pessoas-fisicas';
        }

        api.post(url, pessoa)
            .then(response => {
                dispatch({ type : actions.SUCESSO_PESSOAS, payload : text('geral.add_success')});
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_PESSOAS, payload : error_handling(reason)});
            });

    }
}

export const editPessoa = (pessoa, type) => {
    return dispatch => {

        dispatch({ type : actions.EXECUTANDO_TAREFA_PESSOAS });

        let url = "";
        
        if (type === pessoaTypes.PESSOA_JURIDICA) {
            pessoa = tratarFieldsPJ(pessoa);
            url = '/pessoal/pessoas-juridicas/' + pessoa.id;
                
        } else if (type === pessoaTypes.PESSOA_FISICA) {
            pessoa = tratarFieldsPF(pessoa);
            url = '/pessoal/pessoas-fisicas/' + pessoa.id;
        }

        api.put(url, pessoa)
            .then(response => {
                dispatch({ type : actions.SUCESSO_PESSOAS, payload : text('geral.edit_success')});
            })
            .catch(reason => {
                dispatch({ type : actions.ERRO_PESSOAS, payload : error_handling(reason)});
            });
    }
}

const tratarFieldsPF = (pessoa) => {
    pessoa.cpf = limparCampo(pessoa.cpf);
    pessoa.rg = limparCampo(pessoa.rg);
    pessoa.cep = limparCampo(pessoa.cep);
    pessoa.dataNascimento = reverseData(pessoa.dataNascimento);
    return pessoa;
}

const tratarFieldsPJ = (pessoa) => {
    pessoa.cnpj = limparCampo(pessoa.cnpj);
    pessoa.cep = limparCampo(pessoa.cep);
    return pessoa;
}