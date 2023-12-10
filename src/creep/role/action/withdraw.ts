import { sayWithdraw } from '../../../util/communicator';
import { StructureWithStorage, findClosestStorageMostUsed } from '../../../util/structureFinder';
import { harvest } from './harvest';
import { move } from './move';

const STORAGE_CAPACITY_MINIMUM = 50;

const logWithdrawResult = (creep: Creep, result: ScreepsReturnCode): void => {
  switch (result) {
    case OK:
      sayWithdraw(creep, RESOURCE_ENERGY);
      break;
    default:
      throw new Error(`Builder ${creep.name} failed withdrawing with ${result} error code!`);
  }
};

const withdrawFromStorage = (creep: Creep, storage: StructureWithStorage): void => {
  const result = creep.withdraw(storage, RESOURCE_ENERGY);
  if (result === ERR_NOT_IN_RANGE) {
    move(creep, storage);
  } else {
    logWithdrawResult(creep, result);
  }
};

export const withdraw = (creep: Creep): void => {
  const storage = findClosestStorageMostUsed(creep);
  if (storage !== null && storage.store.getUsedCapacity(RESOURCE_ENERGY) >= STORAGE_CAPACITY_MINIMUM) {
    withdrawFromStorage(creep, storage);
  } else {
    harvest(creep);
  }
};
