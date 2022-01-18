const xStateMachine = {
  state: {
    curState: "active",
    stateTransitionLookup: {
      inactive: {
        on: {
          TOGGLE: "active"
        }
      },
      active: {
        on: {
          TOGGLE: "inactive"
        }
      }
    }
  },
  mutations: {
    NEXT_STATE(vuexState, action) {
      vuexState.curState = null;
    }

  },
  actions: {
    TOGGLE({
      commit: commit
    }) {}

  },
  getters: {}
};