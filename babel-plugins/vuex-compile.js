module.exports = function transformXstateToVuex({types: t}) {
    return {
        visitor: {
            // https://babeljs.io/docs/en/babel-types
            ObjectExpression(path, state){
                console.log('its an object!');
            }
        }
    };
}