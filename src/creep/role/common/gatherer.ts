import {
  StructureWithStorage,
  findClosestSourceActive,
  findClosestStorageMostUsed,
} from '../../../util/structureFinder';
import { ACTION_HARVEST, ACTION_WITHDRAW } from '../../action/_const';

const STORAGE_CAPACITY_MINIMUM = 50;

const canWithdrawFromStorage = (storage: StructureWithStorage): boolean =>
  storage.store.getUsedCapacity(RESOURCE_ENERGY) >= STORAGE_CAPACITY_MINIMUM;

export const setActionGatherer = (creep: Creep): void => {
  const storage = findClosestStorageMostUsed(creep);
  const source = storage === null ? findClosestSourceActive(creep) : null;
  if (storage !== null && canWithdrawFromStorage(storage) === true) {
    creep.setAction(ACTION_WITHDRAW, storage.id);
  } else if (source !== null) {
    creep.setAction(ACTION_HARVEST, source.id);
  } else {
    creep.setActionRally();
  }
};
