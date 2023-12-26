import { CreepRoleConstant, ROLE_BUILDER, ROLE_HARVESTER, ROLE_UPGRADER } from './role/_const';
import { sayChangeRole } from '../util/communicator';
import { shouldBuildOrMaintain } from './role/builder';
import { shouldUpgrade } from './role/upgrader';

const findWorkerByRole = (room: Room, role: CreepRoleConstant): Creep[] =>
  room.find(FIND_MY_CREEPS, { filter: { memory: { role } } });

const setBuilderRole = (worker: Creep): void => {
  sayChangeRole(worker, ROLE_BUILDER);
  worker.memory.role = ROLE_BUILDER;
};

const setHarvesterRole = (worker: Creep): void => {
  sayChangeRole(worker, ROLE_HARVESTER);
  worker.memory.role = ROLE_HARVESTER;
};

const setUpgraderRole = (worker: Creep): void => {
  sayChangeRole(worker, ROLE_UPGRADER);
  worker.memory.role = ROLE_UPGRADER;
};

export const assignBuilders = (room: Room): void => {
  const shouldAssign = shouldBuildOrMaintain(room);
  const builderList = findWorkerByRole(room, ROLE_BUILDER);
  if (shouldAssign === true && builderList.length < room.memory.config.workerCountBuilder) {
    findWorkerByRole(room, ROLE_HARVESTER)
      .slice(0, room.memory.config.workerCountBuilder - builderList.length)
      .forEach(setBuilderRole);
  } else if (shouldAssign === false) {
    builderList.forEach(setHarvesterRole);
  }
};

export const assignUpgraders = (room: Room): void => {
  const shouldAssign = shouldUpgrade(room);
  const upgraderList = findWorkerByRole(room, ROLE_UPGRADER);
  if (shouldAssign === true && upgraderList.length < room.memory.config.workerCountUpgrader) {
    findWorkerByRole(room, ROLE_HARVESTER)
      .slice(0, room.memory.config.workerCountUpgrader - upgraderList.length)
      .forEach(setUpgraderRole);
  } else if (shouldAssign === false) {
    upgraderList.forEach(setHarvesterRole);
  }
};
