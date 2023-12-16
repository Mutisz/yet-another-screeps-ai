import { ACTION_UPGRADE, ACTION_WITHDRAW } from '../../const';
import { sayUpgrade, sayCannotUpgrade } from '../../util/communicator';
import { move, moveToWorkerRallyPoint } from './action/move';
import { withdraw } from './action/withdraw';

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

const logUpgradeResult = (upgrader: Creep, result: ScreepsReturnCode): void => {
  switch (result) {
    case OK:
      sayUpgrade(upgrader);
      break;
    default:
      throw new Error(`Upgrader ${upgrader.name} failed upgrading controller with ${result} error code!`);
  }
};

const upgrade = (upgrader: Creep): void => {
  const controller = upgrader.room.controller;
  if (controller !== undefined) {
    const result = upgrader.upgradeController(controller);
    if (result === ERR_NOT_IN_RANGE) {
      move(upgrader, controller);
    } else {
      logUpgradeResult(upgrader, result);
    }
  } else {
    moveToWorkerRallyPoint(upgrader);
    sayCannotUpgrade(upgrader);
  }
};

const setAction = (upgrader: Creep): void => {
  if ((upgrader.memory.action === ACTION_UPGRADE && upgrader.store.getUsedCapacity(RESOURCE_ENERGY)) === 0) {
    upgrader.memory.action = ACTION_WITHDRAW;
  } else if (upgrader.memory.action === ACTION_WITHDRAW && upgrader.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
    upgrader.memory.action = ACTION_UPGRADE;
  }
};

const executeAction = (upgrader: Creep): void => {
  if (upgrader.memory.action === ACTION_WITHDRAW) {
    withdraw(upgrader);
  } else if (upgrader.memory.action === ACTION_UPGRADE) {
    upgrade(upgrader);
  } else {
    throw new Error(`Action ${upgrader.memory.action} is unhandled for upgraders!`);
  }
};

export const shouldUpgrade = (room: Room): boolean => {
  if (room.controller === undefined || room.controller.level > room.memory.config.controllerLevel) {
    return false;
  } else if (room.controller.level < room.memory.config.controllerLevel) {
    return true;
  }

  const timerFraction = room.controller.ticksToDowngrade / DOWNGRADE_TIMER_BY_LEVEL[room.controller.level];
  if (timerFraction < MINIMUM_DOWNGRADE_TIMER_FRACTION && room.memory.upgrading === true) {
    room.memory.upgrading = true;
    return true;
  } else if (timerFraction >= MAXIMUM_DOWNGRADE_TIMER_FRACTION) {
    room.memory.upgrading = false;
  }

  return false;
};

export const onTick = (upgrader: Creep): void => {
  if (shouldUpgrade(upgrader.room) === true) {
    setAction(upgrader);
    executeAction(upgrader);
  } else {
    moveToWorkerRallyPoint(upgrader);
    sayCannotUpgrade(upgrader);
  }
};
