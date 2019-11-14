
import * as actions from '../actions';

const initialState = {
    listaContainers: null,
    listaContainersFiltrada: null,

    containers: null,
    container: null,

    sucesso: null,
    executando: null,
    erro: null,
    firstPage: true,
    lastPage: true,
    numberOfElements: 0,
    totalElements: 0,
    pageNumber: 0,
    totalPages: null,
    sort: null,
    sortDirection: 'ascending'
}

export default function (state = initialState, action) {
    switch (action.type) {
        case actions.EXECUTANDO_TAREFA_CONTAINERS:
            return { ...state, executando: true, erro: null, sucesso: null };
        case actions.ERRO_CONTAINERS:
            return { ...state, erro: action.payload, executando: false };
        case actions.SUCESSO_CONTAINERS:
            return {
                ...state,
                sucesso: action.payload,
                executando: false,
                erro: false
            };
        case actions.FETCH_ALL_CONTAINERS:
            return {
                ...state,
                executando: null,
                erro: null,
                listaContainers: action.payload.content,
                listaContainersFiltrada: action.payload.content,
                firstPage: action.payload.first,
                lastPage: action.payload.last,
                numberOfElements: action.payload.numberOfElements,
                totalElements: action.payload.totalElements,
                pageNumber: action.payload.pageable.pageNumber,
                totalPages: action.payload.totalPages,
            };
        case actions.FILTRAR_CONTAINERS:
            return {
                ...state,
                listaContainers: action.payload.content,
                executando: null,
                erro: null,
                firstPage: action.payload.first,
                lastPage: action.payload.last,
                numberOfElements: action.payload.numberOfElements,
                totalElements: action.payload.totalElements,
                pageNumber: action.payload.pageable.pageNumber,
                totalPages: action.payload.totalPages,
            };
        case actions.RESET_CONTAINERS:
            return {
                ...state,
                executando: null,
                erro: null,
                sucesso: null,
                listaContainers: null,
                listaContainersFiltrada: null
            };
        case actions.FETCH_ALL_CONTAINERS_LOCALIZACAO:
            return {
                ...state,
                executando: null,
                erro: null,
                sucesso: null,
                containers: action.payload.content,
            };
        default:
            return state;
    }
}