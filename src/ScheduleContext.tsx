import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import { Schedule } from "./types.ts";
import dummyScheduleMap from "./dummyScheduleMap.ts";

type ScheduleContextValueType = Record<string, Schedule[]>;

type ScheduleContextActionType = React.Dispatch<
  React.SetStateAction<Record<string, Schedule[]>>
>;

const ScheduleContextValue = createContext<
  ScheduleContextValueType | undefined
>(undefined);
const ScheduleContextAction = createContext<
  ScheduleContextActionType | undefined
>(undefined);

export const useScheduleContextValue = () => {
  const context = useContext(ScheduleContextValue);
  if (context === undefined) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }
  return context;
};

export const useScheduleContextAction = () => {
  const context = useContext(ScheduleContextAction);
  if (context === undefined) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }
  return context;
};
export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] =
    useState<Record<string, Schedule[]>>(dummyScheduleMap);

  // const contextValue = useMemo(() => {
  //   return { schedulesMap };
  // }, [schedulesMap]);

  // const actionValue = useMemo(() => {
  //   return { setSchedulesMap };
  // }, [setSchedulesMap]);

  return (
    <ScheduleContextValue.Provider value={schedulesMap}>
      <ScheduleContextAction.Provider value={setSchedulesMap}>
        <>{children}</>
      </ScheduleContextAction.Provider>
    </ScheduleContextValue.Provider>
  );
};
