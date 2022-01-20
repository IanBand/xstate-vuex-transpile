module.exports = function transformXstateToVuex({types: t}) {
    return {
        visitor: {
            // https://babeljs.io/docs/en/babel-types - why is this so hard to find on google 
            // https://astexplorer.net/ - SO USEFUL 
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
                    t.objectProperty(
                        t.identifier("stateTransitionLookup"),
                        // copy transition lookup table, TODO: xstate actions may need to be processed
                        xProps.find(n => n.key.name == 'states').value 
                    )
                ]);


                /*
                put additional state variables (counters, ect) into the vuex state
                do it with a map
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
                        [
                            t.objectPattern(
                                [
                                    t.objectProperty(
                                        t.identifier("commit"), 
                                        t.identifier("commit"),
                                        false,
                                        true
                                    )
                                ]
                            )
                        ], 
                        t.blockStatement([]),
                    )
                ));

                // a faux xstate engine based on https://stately.ai/blog/you-dont-need-a-library-for-state-machines#using-objects
                // TODO: just use the actual interpreter?
                /*
                * NEXT_XSTATE(vuexState, action){
                *   vuexState.curState = vuexState.stateTransitionLookup[vuexState.curState]?.on[action] ?? vuexState.curState;
                *   TODO: apply effect based on state transition (XState calls these actions)
                *   TODO: put this mess in a helper function to make code more readable?
                * }
                */
                let vuexMutations = t.objectExpression([
                    t.objectMethod(
                        "method",
                        t.identifier("NEXT_STATE"),
                        [t.identifier("vuexState"), t.identifier("action")],
                        t.blockStatement([
                            t.expressionStatement(
                                t.assignmentExpression(
                                    "=",
                                    t.memberExpression(
                                        t.identifier("vuexState"), 
                                        t.identifier("curState")
                                    ),
                                    t.logicalExpression(
                                        "??", 
                                        t.optionalMemberExpression(
                                            t.optionalMemberExpression(
                                                t.memberExpression(
                                                    t.memberExpression(
                                                        t.identifier("vuexState"),
                                                        t.identifier("stateTransitionLookup")
                                                    ),
                                                    t.memberExpression(
                                                        t.identifier("vuexState"),
                                                        t.identifier("curState")
                                                    ), 
                                                    true
                                                ),
                                                t.identifier("on"),
                                                false,
                                                true
                                            ),
                                            t.identifier("action"),
                                            true,
                                            false
                                        ),
                                        t.memberExpression( // same as line 78
                                            t.identifier("vuexState"), 
                                            t.identifier("curState")
                                        ) 
                                    )
                                )
                            )
                        ])
                    )
                ])

                let vuexModule = t.objectExpression(
                    [
                        t.objectProperty(
                            t.identifier("state"),
                            vuexState
                        ),
                        t.objectProperty(
                            t.identifier("mutations"),
                            vuexMutations
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