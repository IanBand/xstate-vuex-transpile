module.exports = function transformXstateToVuex({types: t}) {
    return {
        visitor: {
            // https://babeljs.io/docs/en/babel-types
            VariableDeclaration(path, state){

                //console.log(path.node.declarations[0].id); // could check for a specific variable name

                let xState = path.node.declarations[0].init;
                let xProps = xState.properties

                let xID = xProps.find(n => n.key.name == 'id').value.value;

                let xInitState = xProps.find(n => n.key.name == 'initial').value.value;

                console.log(xInitState);



                // https://babeljs.io/docs/en/babel-types#objectexpression
                let vuexState = t.objectExpression(
                    [
                        // t.objectProperty(key, value, computed, shorthand, decorators);
                        t.objectProperty(
                            t.identifier("state"),
                            t.objectExpression([])
                        ),
                        t.objectProperty(
                            t.identifier("mutations"),
                            t.objectExpression([])
                        ),
                        t.objectProperty(
                            t.identifier("actions"),
                            t.objectExpression([])
                        ),
                        t.objectProperty(
                            t.identifier("getters"),
                            t.objectExpression([])
                        ),
                    ]
                );
                
                // replace XState object with Vuex object
                path.node.declarations[0].init = vuexState;
            }
        }
    };
}