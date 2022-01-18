const xStateMachine = {
  id: "toggle",
  initial: "active",
  states: {
    inactive: {
      on: { TOGGLE: "active" },
    },
    active: {
      on: { TOGGLE: "inactive" },
    },
  },
}