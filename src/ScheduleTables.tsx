import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import {
  useScheduleContextAction,
  useScheduleContextValue,
} from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import { useState, memo } from "react";
import { useAutoCallback } from "./hooks/useAutoCallback.ts";
import ScheduleDndProvider from "./ScheduleDndProvider.tsx";

export const ScheduleTables = memo(() => {
  const schedulesMap = useScheduleContextValue();
  const setSchedulesMap = useScheduleContextAction();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

  const duplicate = (targetId: string) => {
    setSchedulesMap((prev) => ({
      ...prev,
      [`schedule-${Date.now()}`]: [...prev[targetId]],
    }));
  };

  const remove = (targetId: string) => {
    setSchedulesMap((prev) => {
      delete prev[targetId];
      return { ...prev };
    });
  };

  const ScheduleHeader = memo(
    ({ index, tableId }: { index: number; tableId: string }) => {
      return (
        <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h3" fontSize="lg">
            시간표 {index + 1}
          </Heading>
          <ButtonGroup size="sm" isAttached>
            <Button
              colorScheme="green"
              onClick={() => setSearchInfo({ tableId })}
            >
              시간표 추가
            </Button>
            <Button
              colorScheme="green"
              mx="1px"
              onClick={() => duplicate(tableId)}
            >
              복제
            </Button>
            <Button
              colorScheme="green"
              isDisabled={disabledRemoveButton}
              onClick={() => remove(tableId)}
            >
              삭제
            </Button>
          </ButtonGroup>
        </Flex>
      );
    }
  );
  const handleSearchInfo = useAutoCallback((tableId: string) => {
    setSearchInfo({ tableId });
  });

  const handleRemoveSchedule = useAutoCallback(
    (tableId: string, day: string, time: number) => {
      setSchedulesMap((prev) => ({
        ...prev,
        [tableId]: prev[tableId].filter(
          (schedule) => schedule.day !== day || !schedule.range.includes(time)
        ),
      }));
    }
  );

  const handleDeleteButtonClick = useAutoCallback(
    (tableId: string) =>
      ({ day, time }: { day: string; time: number }) => {
        handleRemoveSchedule(tableId, day, time);
      }
  );

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], index) => (
          <ScheduleDndProvider key={tableId}>
            <Stack key={tableId} width="600px">
              <ScheduleHeader index={index} tableId={tableId} />
              <ScheduleTable
                key={`schedule-table-${index}`}
                schedules={schedules}
                tableId={tableId}
                onScheduleTimeClick={handleSearchInfo}
                onDeleteButtonClick={handleDeleteButtonClick(tableId)}
              />
            </Stack>
          </ScheduleDndProvider>
        ))}
      </Flex>
      <SearchDialog
        searchInfo={searchInfo}
        onClose={() => setSearchInfo(null)}
      />
    </>
  );
});
