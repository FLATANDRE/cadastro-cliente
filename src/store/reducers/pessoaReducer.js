
import * as actions from '../actions';

const initialState = {
  listaPessoas : null,
  listaPessoasFiltrada : null,
  sucesso : null,
  executando : null,
  erro : null,
  firstPage : true,
  lastPage : true,
  numberOfElements : 0,
  totalElements : 0,
  pageNumber : 0, 
  totalPages : null,
  sort: null,
  sortDirection: 'ascending'
}

export default function (state = initialState, action) {
    switch (action.type) {
        case actions.EXECUTANDO_TAREFA_PESSOAS:
            return {...state, executando : true, erro : null, sucesso : null };
        case actions.ERRO_PESSOAS:
            return {...state, erro : action.payload , executando : false};
        case actions.SUCESSO_PESSOAS:
            return {...state, sucesso : action.payload , executando : false, erro : false};
        case actions.FETCH_ALL_PESSOAS:
            return {...state, 
                executando : null,
                erro : null,
                listaPessoas : action.payload.content ? action.payload.content : action.payload, 
                listaPessoasFiltrada : action.payload.content ? action.payload.content : action.payload, 
                firstPage : action.payload.first ? action.payload.first : null,
                lastPage : action.payload.last ? action.payload.last : null,
                numberOfElements : action.payload.numberOfElements ? action.payload.numberOfElements : null,
                totalElements : action.payload.totalElements ? action.payload.totalElements : null,
                pageNumber : action.payload.pageable ? action.payload.pageable.pageNumber : null,
                totalPages : action.payload.totalPages ? action.payload.totalPages : null,
            };
        case actions.FILTRAR_PESSOAS:
            return {...state , 
                listaPessoasFiltrada : action.payload.content,
                executando : null,
                erro : null,
                firstPage : action.payload.first,
                lastPage : action.payload.last,
                numberOfElements : action.payload.numberOfElements,
                totalElements : action.payload.totalElements,
                pageNumber : action.payload.pageable.pageNumber,
                totalPages : action.payload.totalPages,
            };
        case actions.RESET_STATES_PESSOA:
            return {...state, executando : null, erro : null, sucesso : null  };
        default:
            return state;
    }
}