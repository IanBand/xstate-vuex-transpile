## What's this?
This is an XState transpiler that takes an XState definition creates an equivelent Vuex state module.

## Why?
The project aims to make the [XState visualizer](https://stately.ai/viz)(s) into a useful prototyping tool for Vue devs.

## Keep in mind:
This is experimental/a proof of concept, the transpiler only supports basic XStates (for now...?).

Here are some invaluable resources when writing a babel plugin:

- https://babeljs.io/docs/en/babel-types, why is this so hard to find on google? 
- https://astexplorer.net/, I recommend hiding the location data and type keys, and use @babel/parser. When looking at Javascript ASTs, keep in mind which params & flags are required at each node, dont only look at a node's required child nodes.

Run the transpiler with this command:

```./node_modules/.bin/babel xstate --out-dir vuex```