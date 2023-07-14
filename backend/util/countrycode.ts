import { getAlpha2Codes } from 'i18n-iso-countries';


var countries = require("i18n-iso-countries");
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
countries.registerLocale(require("i18n-iso-countries/langs/de.json"));
export function getCountryCodeByName(name: string, language: string) {
    const countrycode = countries.getAlpha2Code(name, language);
    return countrycode || "un"
}