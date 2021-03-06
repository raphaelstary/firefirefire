var UniversalTranslator = (function (defaultLanguage) {
    "use strict";

    function UniversalTranslator(locales) {
        this.locales = locales;
        this.language = defaultLanguage ? defaultLanguage.substring(0, 2) : 'en';
    }

    UniversalTranslator.prototype.setLanguage = function (languageCode) {
        this.language = languageCode;
    };

    UniversalTranslator.prototype.get = function (domainKey, msgKey) {
        return this.locales[this.language][domainKey][msgKey];
    };

    return UniversalTranslator;
})(window.navigator.language || window.navigator.userLanguage);