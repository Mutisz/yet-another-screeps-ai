import { sayCannotHarvest, sayHarvest } from '../../util/communicator';
import { findClosestSourceActive } from '../../util/structureFinder';
import { move } from './move';

const logHarvestResult = (creep: Creep, result: ScreepsReturnCode): void => {
  switch (result) {
    case OK:
      sayHarvest(creep, RESOURCE_ENERGY);
      break;
    default:
      sayCannotHarvest(creep);
      console.log(`Creep ${creep.name} failed harvesting with ${result} error code!`);
  }
};
export const harvest = (creep: Creep): void => {
  const target = creep.memory.action.target as Id<Source>;
  const source = Game.getObjectById(target) ?? findClosestSourceActive(creep);
  if (source === null) {
    sayCannotHarvest(creep);
    return;
  }

  const result = creep.harvest(source);
  if (result === ERR_NOT_IN_RANGE) {
    move(creep, source);
  } else {
    logHarvestResult(creep, result);
  }
};
