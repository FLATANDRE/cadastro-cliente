export const limparCampo = (valor, trimSpace = false) => {
    valor = valor.toString();
    valor = valor.replace(/\./g, '')
        .replace(/\//g, '')
        .replace(/,/g, '')
        .replace(/-/g, '')
        .replace(/:/g, '')
        .replace(/_/g, '')
        .replace(/\(/g, '')
        .replace(/\)/g, '')
        .replace(/\+/g, '');

    if (trimSpace) {
        valor = valor.replace(/ /g, '');
    }

    return valor;
}

export const formataData = (valor) => {
    const pattern = {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit'
    };

    if (!valor) return;
    return new Date(parseInt(valor)).toLocaleDateString('pt-BR', pattern).replace(/\./g, '/');
}

export const reverseData = (strDate) => {
    return strDate.split("/").reverse().join("-");
}

export const formataDinheiro = (valor) => {
    if (valor === null) {
        return valor;
    }
    valor = valor.toString();
    valor = valor.replace(/\./g, ',');
    return valor;
}

export const verificaCasasDecimais = (name, object) => {
    if (object[name] && !object[name].includes(',')) {
        object[name] = object[name] + ',00';
    }
    return object;  
}

export const deepCopy = (object) => {
    return JSON.parse(JSON.stringify(object));
}

export const formatPrecoValue = (value) => {

    value = value.replace(/\./g, '');
    value = value.replace(',', '.');
    return value;
}


