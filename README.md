an Xstate interperater that creates an equivelent vuex state

makes the Xstate visualizer(s) into a useful prototyping tool for vue devs 

useful:

- https://babeljs.io/docs/en/babel-types - why is this so hard to find on google 
- https://astexplorer.net/ - (hide location data and type keys, use @babel/parser) When translating, keep in mind which params & flags are required at each node, dont only look at a node's required child nodes

run it: 

```./node_modules/.bin/babel xstate --out-dir vuex```