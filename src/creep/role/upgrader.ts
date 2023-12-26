import { ACTION_HARVEST, ACTION_RALLY, ACTION_UPGRADE, ACTION_WITHDRAW } from '../action/_const';
import { setActionGatherer } from './common/gatherer';

const canTransitionToGather = (upgrader: Creep): boolean =>
  upgrader.memory.action.type === ACTION_RALLY ||
  (upgrader.memory.action.type === ACTION_UPGRADE && upgrader.isEmpty() === true);

const canTransitionToWork = (upgrader: Creep): boolean =>
  upgrader.memory.action.type === ACTION_RALLY ||
  ([ACTION_HARVEST, ACTION_WITHDRAW].includes(upgrader.memory.action.type) === true && upgrader.isFull() === true);

const setActionUpgrade = (upgrader: Creep): void => {
  const controller = upgrader.room.controller ?? null;
  if (controller !== null) {
    upgrader.setAction(ACTION_UPGRADE, controller.id);
  } else {
    upgrader.setActionRally();
  }
};

export const shouldUpgrade = (room: Room): boolean => room.memory.upgrading;

export const setActionUpgrader = (upgrader: Creep): void => {
  if (shouldUpgrade(upgrader.room) === false) {
    upgrader.setActionRally();
  } else if (canTransitionToGather(upgrader) === true) {
    setActionGatherer(upgrader);
  } else if (canTransitionToWork(upgrader) === true) {
    setActionUpgrade(upgrader);
  }
};
