const MINIMUM_DOWNGRADE_TIMER_FRACTION = 0.2;
const MAXIMUM_DOWNGRADE_TIMER_FRACTION = 0.4;
const DOWNGRADE_TIMER_BY_LEVEL: { [k: number]: number } = {
  1: 20000,
  2: 10000,
  3: 20000,
  4: 40000,
  5: 80000,
  6: 120000,
  7: 150000,
  8: 200000,
};

type RoomWithController = Room & { controller: StructureController };

const maintainLevel = (room: RoomWithController): void => {
  const timerFraction = room.controller.ticksToDowngrade / DOWNGRADE_TIMER_BY_LEVEL[room.controller.level];
  if (timerFraction < MINIMUM_DOWNGRADE_TIMER_FRACTION) {
    room.memory.upgrading = true;
  } else if (timerFraction >= MAXIMUM_DOWNGRADE_TIMER_FRACTION) {
    room.memory.upgrading = false;
  }
};

export const loop = (room: Room): void => {
  if (room.controller === undefined) {
    room.memory.upgrading = false;
    return;
  }

  if (room.controller.level < room.memory.config.controllerLevel) {
    room.memory.upgrading = true;
  } else {
    maintainLevel(room as RoomWithController);
  }
};
