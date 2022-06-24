import { COMMON_ACTIONS } from "./CommonActions";

export default function reducer(
  state = {
    success: false,
    error: false,
    loading: false,
    currentUser: null,
  },
  action
) {
  switch (action.type) {
    case COMMON_ACTIONS.API_CALL_START:
      return {
        ...state,
        loading: true,
      };

    case COMMON_ACTIONS.API_CALL_FINISH:
      return {
        ...state,
        loading: false,
      };

    case COMMON_ACTIONS.SHOW_MESSAGE:
      return {
        ...state,
        message: action.payload.message,
        open: action.payload.open,
        variant: action.payload.variant,
      };

    case COMMON_ACTIONS.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        open: false,
      };

    case COMMON_ACTIONS.RERENDER:
      return {
        ...state,
        triggerRerender: !state.triggerRerender,
      };

    default:
      return state;
  }
}
