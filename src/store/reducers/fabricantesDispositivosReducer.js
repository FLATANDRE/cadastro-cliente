
import * as actions from '../actions';

const initialState = {
  listaFabricantesDispositivos : null,
  listaFabricantesDispositivosFiltrada : null,
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
        case actions.EXECUTANDO_TAREFA_FABRICANTES_DISPOSITIVOS:
            return {...state, executando : true, erro : null, sucesso : null };
        case actions.ERRO_FABRICANTES_DISPOSITIVOS:
            return {...state, erro : action.payload , executando : false};
        case actions.SUCESSO_FABRICANTES_DISPOSITIVOS:
            return {...state, sucesso : action.payload , executando : false, erro : false};
        case actions.FETCH_ALL_FABRICANTES_DISPOSITIVOS:
            return {...state, 
                executando : null,
                erro : null,
                listaFabricantesDispositivos : action.payload.content, 
                listaFabricantesDispositivosFiltrada : action.payload.content, 
                firstPage : action.payload.first,
                lastPage : action.payload.last,
                numberOfElements : action.payload.numberOfElements,
                totalElements : action.payload.totalElements,
                pageNumber : action.payload.pageable.pageNumber,
                totalPages : action.payload.totalPages,
            };
        case actions.FILTRAR_FABRICANTES_DISPOSITIVOS:
            return {...state , 
                listaFabricantesDispositivosFiltrada : action.payload.content,
                executando : null,
                erro : null,
                firstPage : action.payload.first,
                lastPage : action.payload.last,
                numberOfElements : action.payload.numberOfElements,
                totalElements : action.payload.totalElements,
                pageNumber : action.payload.pageable.pageNumber,
                totalPages : action.payload.totalPages,
            };
        case actions.RESET_STATES_FABRICANTE_DISPOSITIVO:
            return {...state, executando : null, erro : null, sucesso : null  };
        default:
            return state;
    }
}