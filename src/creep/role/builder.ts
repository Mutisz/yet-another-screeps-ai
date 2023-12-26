import { findClosestConstruction, findClosestMaintenance } from '../../util/structureFinder';
import { ACTION_BUILD, ACTION_HARVEST, ACTION_MAINTAIN, ACTION_RALLY, ACTION_WITHDRAW } from '../action/_const';
import { setActionGatherer } from './common/gatherer';

const canTransitionToGather = (builder: Creep): boolean =>
  builder.memory.action.type === ACTION_RALLY ||
  ([ACTION_BUILD, ACTION_MAINTAIN].includes(builder.memory.action.type) === true && builder.isEmpty() === true);

const canTransitionToWork = (builder: Creep): boolean =>
  builder.memory.action.type === ACTION_RALLY ||
  ([ACTION_HARVEST, ACTION_WITHDRAW].includes(builder.memory.action.type) === true && builder.isFull() === true);

const setActionBuildOrMaintain = (builder: Creep): void => {
  const construction = findClosestConstruction(builder);
  const maintenance = construction === null ? findClosestMaintenance(builder) : null;
  if (construction !== null) {
    builder.setAction(ACTION_BUILD, construction.id);
  } else if (maintenance !== null) {
    builder.setAction(ACTION_MAINTAIN, maintenance.id);
  } else {
    builder.setActionRally();
  }
};

export const shouldBuildOrMaintain = (room: Room): boolean => {
  let shouldBuildOrMaintain = room.find(FIND_MY_CONSTRUCTION_SITES).length > 0;
  if (shouldBuildOrMaintain === false) {
    shouldBuildOrMaintain = room.memory.maintenanceList.length > 0;
  }

  return shouldBuildOrMaintain;
};

export const setActionBuilder = (builder: Creep): void => {
  if (shouldBuildOrMaintain(builder.room) === false) {
    builder.setActionRally();
  } else if (canTransitionToGather(builder) === true) {
    setActionGatherer(builder);
  } else if (canTransitionToWork(builder) === true) {
    setActionBuildOrMaintain(builder);
  }
};
