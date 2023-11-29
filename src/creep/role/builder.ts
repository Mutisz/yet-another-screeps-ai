import { sayBuild, sayCannotBuild, sayCannotStoreOrWithdraw, sayWithdraw } from '../../util/communicator';
import { findClosestConstruction, findClosestStorageMostUsed } from '../../util/structureFinder';
import { moveToWorkerRallyPoint } from '../mover';

const logWithdrawResult = (builder: Creep, result: ScreepsReturnCode): void => {
  switch (result) {
    case OK:
      sayWithdraw(builder, RESOURCE_ENERGY);
      break;
    default:
      throw new Error(`Builder ${builder.name} failed withdrawing with ${result} error code!`);
  }
};

const logBuildResult = (builder: Creep, construction: ConstructionSite, result: ScreepsReturnCode): void => {
  switch (result) {
    case OK:
      sayBuild(builder, construction.structureType);
      break;
    default:
      throw new Error(`Builder ${builder.name} failed building with ${result} error code!`);
  }
};

const withdraw = (builder: Creep): void => {
  const storage = findClosestStorageMostUsed(builder);
  if (storage === null) {
    moveToWorkerRallyPoint(builder);
    sayCannotStoreOrWithdraw(builder);
  } else {
    const result = builder.withdraw(storage, RESOURCE_ENERGY);
    if (result === ERR_NOT_IN_RANGE) {
      builder.moveTo(storage);
    } else {
      logWithdrawResult(builder, result);
    }
  }
};

const build = (builder: Creep): void => {
  const construction = findClosestConstruction(builder);
  if (construction === null) {
    moveToWorkerRallyPoint(builder);
    sayCannotBuild(builder);
  } else {
    const result = builder.build(construction);
    if (result === ERR_NOT_IN_RANGE) {
      builder.moveTo(construction);
    } else {
      logBuildResult(builder, construction, result);
    }
  }
};

export const run = (builder: Creep): void => {
  if (builder.store[RESOURCE_ENERGY] === 0) {
    withdraw(builder);
  } else {
    build(builder);
  }
};
