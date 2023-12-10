import { sayBuildOrMaintain, sayCannotBuildOrMaintain } from '../../util/communicator';
import { findClosestConstruction, findMaintenance } from '../../util/structureFinder';
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
  const maintenance = construction === null ? findMaintenance(builder) : null;
  if (construction !== null) {
    build(builder, construction);
  } else if (maintenance !== null) {
    maintain(builder, maintenance);
  } else {
    moveToWorkerRallyPoint(builder);
    sayCannotBuildOrMaintain(builder);
  }
};

export const onTick = (builder: Creep): void => {
  if (builder.store[RESOURCE_ENERGY] === 0) {
    withdraw(builder);
  } else {
    buildOrMaintain(builder);
  }
};
