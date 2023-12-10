import { sayCannotStoreOrWithdraw, sayStore } from '../../util/communicator';
import { findClosestStorageLeastUsed } from '../../util/structureFinder';
import { harvest } from './action/harvest';
import { move, moveToWorkerRallyPoint } from './action/move';

const logStoreResult = (harvester: Creep, result: ScreepsReturnCode): void => {
  switch (result) {
    case OK:
      sayStore(harvester, RESOURCE_ENERGY);
      break;
    default:
      throw new Error(`Harvester ${harvester.name} failed storing with ${result} error code!`);
  }
};

const store = (harvester: Creep): void => {
  const storage = findClosestStorageLeastUsed(harvester);
  if (storage !== null) {
    const result = harvester.transfer(storage, RESOURCE_ENERGY);
    if (result === ERR_NOT_IN_RANGE) {
      move(harvester, storage);
    } else {
      logStoreResult(harvester, result);
    }
  } else {
    moveToWorkerRallyPoint(harvester);
    sayCannotStoreOrWithdraw(harvester);
  }
};

export const onTick = (harvester: Creep): void => {
  if (harvester.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
    harvest(harvester);
  } else {
    store(harvester);
  }
};
