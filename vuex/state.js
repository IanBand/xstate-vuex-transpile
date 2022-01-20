const lightMachine = {
  state: {
    curState: "green",
    stateTransitionLookup: {
      green: {
        on: {
          TIMER: 'yellow'
        }
      },
      yellow: {
        on: {
          TIMER: 'red'
        }
      },
      red: {
        on: {
          TIMER: 'green'
        }
      }
    }
  },
  mutations: {
    NEXT_STATE(vuexState, action) {
      vuexState.curState = vuexState.stateTransitionLookup[vuexState.curState]?.on[action] ?? vuexState.curState;
    }

  },
  actions: {
    TIMER({commit}) {}

  },
  getters: {}
};