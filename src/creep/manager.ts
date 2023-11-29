import {
  WORKER_BODY,
  MINIMUM_WORKERS,
  MINIMUM_BUILDERS,
  MINIMUM_UPGRADERS,
  ROLE_BUILDER,
  ROLE_HARVESTER,
  ROLE_UPGRADER,
  WORKER_ROLE_LIST,
  CreepRoleConstant,
} from '../config/config';
import { sayChangeRole } from '../util/communicator';
import { generateCreepName } from '../util/nameGenerator';
import { run as runBuilder } from './role/builder';
import { run as runHarvester } from './role/harvester';
import { shouldUpgrade, run as runUpgrader } from './role/upgrader';

const isWorker = (creep: Creep): boolean => WORKER_ROLE_LIST.includes(creep.memory.role);

const findWorkerList = (room: Room): Creep[] => room.find(FIND_MY_CREEPS, { filter: isWorker });

const findWorkerByRole = (room: Room, role: CreepRoleConstant): Creep[] =>
  room.find(FIND_MY_CREEPS, { filter: { memory: { role } } });

const logSpawnResult = (result: ScreepsReturnCode): void => {
  switch (result) {
    case OK:
      console.log('Spawning new worker...');
      break;
    case ERR_NOT_ENOUGH_ENERGY:
      break;
    default:
      throw new Error(`Spawning worker failed with ${result} error code!`);
  }
};

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

const spawnWorker = (spawn: StructureSpawn): void => {
  if (spawn.spawning === null && findWorkerList(spawn.room).length < MINIMUM_WORKERS) {
    const result = spawn.spawnCreep(WORKER_BODY, generateCreepName('worker'), {
      memory: { role: ROLE_HARVESTER },
    });

    logSpawnResult(result);
  }
};

const assignBuilders = (room: Room): void => {
  const shouldAssign = room.find(FIND_MY_CONSTRUCTION_SITES).length > 0;
  const harvesterList = findWorkerByRole(room, ROLE_HARVESTER);
  const builderList = findWorkerByRole(room, ROLE_BUILDER);
  if (shouldAssign && builderList.length < MINIMUM_BUILDERS) {
    harvesterList.slice(0, MINIMUM_BUILDERS - builderList.length).forEach(setBuilderRole);
  } else if (shouldAssign === false) {
    builderList.forEach(setHarvesterRole);
  }
};

const assignUpgraders = (room: Room): void => {
  const shouldAssign = shouldUpgrade(room);
  const harvesterList = findWorkerByRole(room, ROLE_HARVESTER);
  const upgraderList = findWorkerByRole(room, ROLE_UPGRADER);
  if (shouldAssign && upgraderList.length < MINIMUM_UPGRADERS) {
    harvesterList.slice(0, MINIMUM_UPGRADERS - upgraderList.length).forEach(setUpgraderRole);
  } else if (shouldAssign === false) {
    upgraderList.forEach(setHarvesterRole);
  }
};

const runBuilders = (room: Room): void =>
  findWorkerByRole(room, ROLE_BUILDER).forEach((builder) => runBuilder(builder));

const runHarvesters = (room: Room): void =>
  findWorkerByRole(room, ROLE_HARVESTER).forEach((harvester) => runHarvester(harvester));

const runUpgraders = (room: Room): void => {
  findWorkerByRole(room, ROLE_UPGRADER).forEach((upgrader) => runUpgrader(upgrader));
};

export const manage = function (spawn: StructureSpawn): void {
  spawnWorker(spawn);

  if (findWorkerList(spawn.room).length >= MINIMUM_WORKERS) {
    assignBuilders(spawn.room);
    assignUpgraders(spawn.room);
  }

  runBuilders(spawn.room);
  runHarvesters(spawn.room);
  runUpgraders(spawn.room);
};
