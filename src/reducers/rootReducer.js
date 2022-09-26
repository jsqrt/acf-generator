const rootReducer = (state, action) => {

  switch (action.type) {

    case 'SET_FIELD_KEY_COUNTER':
      return {
        ...state,
        fieldKeyCounter: action.value || state.fieldKeyCounter + 1,
      };

    default: return state;
  }
};

export default rootReducer;