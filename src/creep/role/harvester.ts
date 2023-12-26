import { findClosestSourceActive, findClosestStorageLeastUsed } from '../../util/structureFinder';
import { ACTION_DEPOSIT, ACTION_HARVEST, ACTION_RALLY } from '../action/_const';

const canTransitionToHarvest = (harvester: Creep): boolean =>
  harvester.memory.action.type === ACTION_RALLY ||
  (harvester.memory.action.type === ACTION_DEPOSIT && harvester.isEmpty() === true);

const canTransitionToDeposit = (harvester: Creep): boolean =>
  harvester.memory.action.type === ACTION_RALLY ||
  (harvester.memory.action.type === ACTION_HARVEST && harvester.isFull() === true);

const setActionHarvest = (harvester: Creep): void => {
  const source = findClosestSourceActive(harvester);
  if (source !== null) {
    harvester.setAction(ACTION_HARVEST, source.id);
  } else {
    harvester.setActionRally();
  }
};

const setActionDeposit = (harvester: Creep): void => {
  const storage = findClosestStorageLeastUsed(harvester);
  if (storage !== null) {
    harvester.setAction(ACTION_DEPOSIT, storage.id);
  } else {
    harvester.setActionRally();
  }
};

export const setActionHarvester = (harvester: Creep): void => {
  if (canTransitionToHarvest(harvester) === true) {
    setActionHarvest(harvester);
  } else if (canTransitionToDeposit(harvester) === true) {
    setActionDeposit(harvester);
  }
};
