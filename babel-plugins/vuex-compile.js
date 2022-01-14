module.exports = function transformXstateToVuex({types: t}) {
    return {
        visitor: {
            // https://babeljs.io/docs/en/babel-types

            FunctionDeclaration(path,state){
                console.log(path.node.params[0].properties[0]);
            },
            VariableDeclaration(path, state){

                // could check for a specific variable name
                // console.log(path.node.declarations[0].id); 

                let xStateMachine = path.node.declarations[0].init;
                let xProps = xStateMachine.properties

                // TODO: if any of the finds fail, its not a valid xState object

                let xID = xProps.find(n => n.key.name == 'id').value.value;

                let xInitState = xProps.find(n => n.key.name == 'initial').value.value;

                let vuexState = t.objectExpression([
                    t.objectProperty(
                        t.identifier("curState"),
                        t.stringLiteral(xInitState)
                    ),
                ]);

                /*
                put additional state variables (counters, ect) into the vuex state
                for(...){
                    vuexState.push(

                    )
                }
                */

                let xActions = [
                    ...new Set(
                        xProps.find(n => n.key.name == 'states').value.properties.map(
                            n1 => n1.value.properties.map(
                                n2 => n2.value.properties
                            )
                        ).flat(2).map(n3 => n3.key.name)
                    )
                ];

                // map xState action names to vuex action methods
                let vuexActions = t.objectExpression(xActions.map(
                    actionName => t.objectMethod(
                        "method",
                        t.identifier(actionName),
                        // function example({method}){}
                        // is just syntactic sugar for 
                        // function example({method: method}){}
                        [t.objectPattern([t.objectProperty(t.identifier("commit"), t.identifier("commit"))])], 
                        t.blockStatement([]),
                    )
                ));

                // TODO: either build a faux interpreter https://stately.ai/blog/you-dont-need-a-library-for-state-machines#using-objects
                // or just use the actual interpreter


                // https://babeljs.io/docs/en/babel-types#objectexpression
                let vuexModule = t.objectExpression(
                    [
                        // t.objectProperty(key, value, computed, shorthand, decorators);
                        t.objectProperty(
                            t.identifier("state"),
                            vuexState
                        ),
                        t.objectProperty(
                            t.identifier("mutations"),
                            t.objectExpression([])
                        ),
                        t.objectProperty(
                            t.identifier("actions"),
                            vuexActions
                        ),
                        t.objectProperty(
                            t.identifier("getters"),
                            t.objectExpression([])
                        ),
                    ]
                );
                
                // replace XState object with Vuex object
                path.node.declarations[0].init = vuexModule;
            }
        }
    };
}