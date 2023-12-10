import { sayCannotMine, sayMine } from '../../../util/communicator';
import { findClosestSourceActive } from '../../../util/structureFinder';
import { move, moveToWorkerRallyPoint } from './move';

const logHarvestResult = (creep: Creep, result: ScreepsReturnCode): void => {
  switch (result) {
    case OK:
      sayMine(creep, RESOURCE_ENERGY);
      break;
    default:
      throw new Error(`Harvester ${creep.name} failed harvesting with ${result} error code!`);
  }
};

const findSource = (creep: Creep): Source | null => {
  const sourceFromMemory = creep.memory.target !== null ? Game.getObjectById(creep.memory.target) : null;
  if (sourceFromMemory !== null) {
    return sourceFromMemory;
  }

  const sourceNew = findClosestSourceActive(creep);
  if (sourceNew !== null) {
    creep.memory.target = sourceNew.id;
  }

  return sourceNew;
};

const harvestFromSource = (creep: Creep, source: Source): void => {
  const result = creep.harvest(source);
  if (result === ERR_NOT_IN_RANGE) {
    move(creep, source);
  } else {
    logHarvestResult(creep, result);
  }
};

export const harvest = (creep: Creep): void => {
  const source = findSource(creep);
  if (source !== null) {
    harvestFromSource(creep, source);
  } else {
    moveToWorkerRallyPoint(creep);
    sayCannotMine(creep);
  }
};
