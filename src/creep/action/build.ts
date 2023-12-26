import { sayBuild, sayCannotBuild } from '../../util/communicator';
import { findClosestConstruction } from '../../util/structureFinder';
import { move } from './move';

const logBuildResult = (creep: Creep, construction: ConstructionSite, result: ScreepsReturnCode): void => {
  switch (result) {
    case OK:
      sayBuild(creep, construction.structureType);
      break;
    default:
      sayCannotBuild(creep);
      console.log(`Creep ${creep.name} failed action ${creep.memory.action} with ${result} error code!`);
  }
};

export const build = (creep: Creep): void => {
  const target = creep.memory.action.target as Id<ConstructionSite>;
  const construction = Game.getObjectById(target) ?? findClosestConstruction(creep);
  if (construction === null) {
    sayCannotBuild(creep);
    return;
  }

  const result = creep.build(construction);
  if (result === ERR_NOT_IN_RANGE) {
    move(creep, construction);
  } else {
    logBuildResult(creep, construction, result);
  }
};
