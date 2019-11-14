import intl from 'react-intl-universal';

export const LOCALE_KEY = "locale";

const locales = {
    'pt-BR': require('../locales/pt-BR.json'),
    'en-US': require('../locales/en-US.json')
};

export const init = () => {
    const currentLocale = getLocale();

    intl.init({
        currentLocale,
        locales
    });
}

export const setLocale = locale => {
    localStorage.setItem(LOCALE_KEY, locale);
}

export const getLocale = () => {

    var currentLocale = localStorage.getItem(LOCALE_KEY);

    if (!currentLocale || !locales[currentLocale]) {
        currentLocale = locales[navigator.language] ? navigator.language : 'en-US';
        localStorage.setItem(LOCALE_KEY, currentLocale);
    }

    return currentLocale;
}

export const getLanguage = () => {
    var currentLocale = getLocale();
    var p = currentLocale.split("-");
    var country = p[0];
    return country.toLowerCase();
}

export const getCountry = () => {
    var currentLocale = getLocale();
    var p = currentLocale.split("-");
    var country = p[1];
    return country.toLowerCase();
}

export const text = key => {
    init();
    return intl.get(key).d(key);
}

export const html = (key, value) => {
    init();
    return intl.getHTML(key, value).d(key);
}

