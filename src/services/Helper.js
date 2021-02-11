

module.exports = {

    toUpperCase: (str) => {
        if (str.length > 0) {
            const newStr = str.toLowerCase()
                .replace(/_([a-z])/, (m) => m.toUpperCase())
                .replace(/_/, '');
            return str.charAt(0)
                .toUpperCase() + newStr.slice(1);
        }
        return '';
    },

    /**
     * @description This function use for create validation unique key
     * @param apiTag
     * @param error
     * @returns {*}
     */
    validationMessageKey: (apiTag, error) => {
        let key = module.exports.toUpperCase(error.details[0].context.key);
        let type = error.details[0].type.split('.');
        type = module.exports.toUpperCase(type[1]);
        key = apiTag + key + type;
        return key;
    },

    /**
     * @description This function use for create random number
     * @param length
     * @returns {*}
     */

    makeRandomNumber: (length) => {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },

};
