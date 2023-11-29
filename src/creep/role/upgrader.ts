import { MAXIMUM_DOWNGRADE_TIMER_FRACTION, MINIMUM_DOWNGRADE_TIMER_FRACTION, MINIMUM_LEVEL } from '../../config/config';
import { sayWithdraw, sayUpgrade, sayCannotStoreOrWithdraw, sayCannotUpgrade } from '../../util/communicator';
import { findClosestStorageMostUsed } from '../../util/structureFinder';
import { moveToWorkerRallyPoint } from '../mover';

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

const logWithdrawResult = (upgrader: Creep, result: ScreepsReturnCode): void => {
  switch (result) {
    case OK:
      sayWithdraw(upgrader, RESOURCE_ENERGY);
      break;
    default:
      throw new Error(`Upgrader ${upgrader.name} failed withdrawing with ${result} error code!`);
  }
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

const withdraw = (upgrader: Creep): void => {
  const storage = findClosestStorageMostUsed(upgrader);
  if (storage === null) {
    moveToWorkerRallyPoint(upgrader);
    sayCannotStoreOrWithdraw(upgrader);
  } else {
    const result = upgrader.withdraw(storage, RESOURCE_ENERGY);
    if (result === ERR_NOT_IN_RANGE) {
      upgrader.moveTo(storage);
    } else {
      logWithdrawResult(upgrader, result);
    }
  }
};

const upgrade = (upgrader: Creep): void => {
  const controller = upgrader.room.controller;
  if (controller === undefined) {
    moveToWorkerRallyPoint(upgrader);
    sayCannotUpgrade(upgrader);
  } else {
    const result = upgrader.upgradeController(controller);
    if (result === ERR_NOT_IN_RANGE) {
      upgrader.moveTo(controller);
    } else {
      logUpgradeResult(upgrader, result);
    }
  }
};

export const shouldUpgrade = (room: Room): boolean => {
  if (room.controller === undefined || room.controller.level > MINIMUM_LEVEL) {
    return false;
  } else if (room.controller.level < MINIMUM_LEVEL) {
    return true;
  }

  const timerFraction = room.controller.ticksToDowngrade / DOWNGRADE_TIMER_BY_LEVEL[room.controller.level];
  if (timerFraction < MINIMUM_DOWNGRADE_TIMER_FRACTION && room.memory.stopUpgrade === false) {
    room.memory.stopUpgrade = false;
    return true;
  } else if (timerFraction >= MAXIMUM_DOWNGRADE_TIMER_FRACTION) {
    room.memory.stopUpgrade = true;
  }

  return false;
};

export const run = (upgrader: Creep): void => {
  if (shouldUpgrade(upgrader.room) === false) {
    moveToWorkerRallyPoint(upgrader);
    sayCannotUpgrade(upgrader);
  } else if (upgrader.store[RESOURCE_ENERGY] === 0) {
    withdraw(upgrader);
  } else {
    upgrade(upgrader);
  }
};
