import { sayCannotMaintain, sayMaintain } from '../../util/communicator';
import { findClosestMaintenance } from '../../util/structureFinder';
import { move } from './move';

const logMaintainResult = (creep: Creep, maintenance: Structure, result: ScreepsReturnCode): void => {
  switch (result) {
    case OK:
      sayMaintain(creep, maintenance.structureType);
      break;
    default:
      sayCannotMaintain(creep);
      throw new Error(`Builder ${creep.name} failed action ${creep.memory.action} with ${result} error code!`);
  }
};

export const maintain = (creep: Creep): void => {
  const target = creep.memory.action.target as Id<Structure>;
  const maintenance = Game.getObjectById(target) ?? findClosestMaintenance(creep);
  if (maintenance === null) {
    sayCannotMaintain(creep);
    return;
  }

  const result = creep.repair(maintenance);
  if (result === ERR_NOT_IN_RANGE) {
    move(creep, maintenance);
  } else {
    logMaintainResult(creep, maintenance, result);
  }
};
