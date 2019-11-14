import * as actions from '../actions';

const initialState = {
  listaEstados : null,
  listaPaises : null,
  executando : null,
  erro : null,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case actions.EXECUTANDO_TAREFA_ENDERECO:
            return {...state, executando : true, erro : null};
        case actions.ERRO_ENDERECO:
            return {...state, erro : action.payload , executando : false};
        case actions.FETCH_ALL_CIDADE_ESTADO:
            return {...state, 
                executando : null,
                erro : null,
                listaEstados : action.payload.content,                 
            };
        case actions.FETCH_ALL_PAISES:
            return {...state, 
                executando : null,
                erro : null,
                listaPaises : action.payload.content,                 
            };
        default:
            return state;
    }
}