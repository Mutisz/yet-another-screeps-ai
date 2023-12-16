import { ACTION_BUILD, ACTION_WITHDRAW } from '../../const';
import { sayBuildOrMaintain, sayCannotBuildOrMaintain, sayCannotUpgrade } from '../../util/communicator';
import { findClosestConstruction, findClosestMaintenance } from '../../util/structureFinder';
import { move, moveToWorkerRallyPoint } from './action/move';
import { withdraw } from './action/withdraw';

const logBuildOrMaintainResult = (
  builder: Creep,
  structure: ConstructionSite | Structure,
  result: ScreepsReturnCode,
): void => {
  switch (result) {
    case OK:
      sayBuildOrMaintain(builder, structure.structureType);
      break;
    default:
      throw new Error(`Builder ${builder.name} failed action with ${result} error code!`);
  }
};

const build = (builder: Creep, construction: ConstructionSite): void => {
  const result = builder.build(construction);
  if (result === ERR_NOT_IN_RANGE) {
    move(builder, construction);
  } else {
    logBuildOrMaintainResult(builder, construction, result);
  }
};

const maintain = (builder: Creep, maintenance: Structure): void => {
  const result = builder.repair(maintenance);
  if (result === ERR_NOT_IN_RANGE) {
    move(builder, maintenance);
  } else {
    logBuildOrMaintainResult(builder, maintenance, result);
  }
};

const buildOrMaintain = (builder: Creep): void => {
  const construction = findClosestConstruction(builder);
  const maintenance = construction === null ? findClosestMaintenance(builder) : null;
  if (construction !== null) {
    build(builder, construction);
  } else if (maintenance !== null) {
    maintain(builder, maintenance);
  } else {
    moveToWorkerRallyPoint(builder);
    sayCannotBuildOrMaintain(builder);
  }
};

const setAction = (upgrader: Creep): void => {
  if (upgrader.memory.action === ACTION_BUILD && upgrader.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
    upgrader.memory.action = ACTION_WITHDRAW;
  } else if (upgrader.memory.action === ACTION_WITHDRAW && upgrader.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
    upgrader.memory.action = ACTION_BUILD;
  }
};

const executeAction = (builder: Creep): void => {
  if (builder.memory.action === ACTION_WITHDRAW) {
    withdraw(builder);
  } else if (builder.memory.action === ACTION_BUILD) {
    buildOrMaintain(builder);
  } else {
    throw new Error(`Action ${builder.memory.action} is unhandled for builders!`);
  }
};

export const shouldBuildOrMaintain = (room: Room): boolean => {
  let shouldBuild = room.find(FIND_MY_CONSTRUCTION_SITES).length > 0;
  if (shouldBuild === false) {
    shouldBuild = room.memory.maintenanceList.length > 0;
  }

  return shouldBuild;
};

export const onTick = (builder: Creep): void => {
  if (shouldBuildOrMaintain(builder.room) === true) {
    setAction(builder);
    executeAction(builder);
  } else {
    moveToWorkerRallyPoint(builder);
    sayCannotUpgrade(builder);
  }
};
