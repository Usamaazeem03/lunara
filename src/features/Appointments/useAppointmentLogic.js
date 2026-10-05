import { useCallback, useReducer } from "react";

import {
  appointmentReducer,
  createAppointmentInitialState,
} from "./appointmentReducer.js";

export function useAppointmentLogic(
  today,
  initialWorkingHours,
  initialAppointments,
) {
  const [state, dispatch] = useReducer(
    appointmentReducer,
    { today, initialWorkingHours, initialAppointments },
    ({
      today: initialToday,
      initialWorkingHours: hours,
      initialAppointments: appointments,
    }) => createAppointmentInitialState(initialToday, hours, appointments),
  );

  const set = useCallback(
    (field, value) => dispatch({ type: "set", field, value }),
    [],
  );
  const update = useCallback(
    (field, value) => dispatch({ type: "update", field, value }),
    [],
  );
  const updateForm = useCallback(
    (value) => dispatch({ type: "updateForm", value }),
    [],
  );

  return {
    state,
    dispatch,
    set,
    update,
    updateForm,
  };
}
