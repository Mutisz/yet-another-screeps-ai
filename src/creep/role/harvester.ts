import { sayCannotMine, sayCannotStoreOrWithdraw, sayMine, sayStore } from '../../util/communicator';
import { findClosestSourceActive, findClosestStorageLeastUsed } from '../../util/structureFinder';
import { moveToWorkerRallyPoint } from '../mover';

const logHarvestResult = (harvester: Creep, result: ScreepsReturnCode): void => {
  switch (result) {
    case OK:
      sayMine(harvester, RESOURCE_ENERGY);
      break;
    default:
      throw new Error(`Harvester ${harvester.name} failed harvesting with ${result} error code!`);
  }
};

const logStoreResult = (harvester: Creep, result: ScreepsReturnCode): void => {
  switch (result) {
    case OK:
      sayStore(harvester, RESOURCE_ENERGY);
      break;
    default:
      throw new Error(`Harvester ${harvester.name} failed storing with ${result} error code!`);
  }
};

const harvest = (harvester: Creep): void => {
  const source = findClosestSourceActive(harvester);
  if (source === null) {
    moveToWorkerRallyPoint(harvester);
    sayCannotMine(harvester);
  } else {
    const result = harvester.harvest(source);
    if (result === ERR_NOT_IN_RANGE) {
      harvester.moveTo(source);
    } else {
      logHarvestResult(harvester, result);
    }
  }
};

const store = (harvester: Creep): void => {
  const storage = findClosestStorageLeastUsed(harvester);
  if (storage === null) {
    moveToWorkerRallyPoint(harvester);
    sayCannotStoreOrWithdraw(harvester);
  } else {
    const result = harvester.transfer(storage, RESOURCE_ENERGY);
    if (result === ERR_NOT_IN_RANGE) {
      harvester.moveTo(storage);
    } else {
      logStoreResult(harvester, result);
    }
  }
};

export const run = (harvester: Creep): void => {
  if (harvester.store.getFreeCapacity() > 0) {
    harvest(harvester);
  } else {
    store(harvester);
  }
};
