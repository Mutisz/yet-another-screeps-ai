import { fill, floor, reduce } from 'lodash';
import {
  WORKER_BODY,
  ROLE_BUILDER,
  ROLE_HARVESTER,
  ROLE_UPGRADER,
  WORKER_ROLE_LIST,
  CreepRoleConstant,
  ACTION_WITHDRAW,
} from '../const';
import { sayChangeRole } from '../util/communicator';
import { generateCreepName } from '../util/nameGenerator';
import { onTick as runBuilder, shouldBuildOrMaintain } from './role/builder';
import { onTick as runHarvester } from './role/harvester';
import { shouldUpgrade, onTick as runUpgrader } from './role/upgrader';

const isWorker = (creep: Creep): boolean => WORKER_ROLE_LIST.includes(creep.memory.role);

const findWorkerList = (room: Room): Creep[] => room.find(FIND_MY_CREEPS, { filter: isWorker });

const findWorkerByRole = (room: Room, role: CreepRoleConstant): Creep[] =>
  room.find(FIND_MY_CREEPS, { filter: { memory: { role } } });

const logSpawnResult = (result: ScreepsReturnCode): void => {
  switch (result) {
    case OK:
    case ERR_NOT_ENOUGH_ENERGY:
      break;
    default:
      throw new Error(`Spawning worker failed with ${result} error code!`);
  }
};

const setBuilderRole = (worker: Creep): void => {
  sayChangeRole(worker, ROLE_BUILDER);
  worker.memory.role = ROLE_BUILDER;
  worker.memory.action = ACTION_WITHDRAW;
};

const setHarvesterRole = (worker: Creep): void => {
  sayChangeRole(worker, ROLE_HARVESTER);
  worker.memory.role = ROLE_HARVESTER;
  worker.memory.action = null;
};

const setUpgraderRole = (worker: Creep): void => {
  sayChangeRole(worker, ROLE_UPGRADER);
  worker.memory.role = ROLE_UPGRADER;
  worker.memory.action = ACTION_WITHDRAW;
};

const spawnWorker = (spawn: StructureSpawn): void => {
  if (spawn.spawning === null && findWorkerList(spawn.room).length < spawn.room.memory.config.workerCountAll) {
    const baseWorkerCost = reduce(WORKER_BODY, (acc, bodyPart) => acc + BODYPART_COST[bodyPart], 0);
    const workerLevel = floor(spawn.room.energyCapacityAvailable / baseWorkerCost);
    const workerBody = WORKER_BODY.concat(...fill(Array(workerLevel - 1), WORKER_BODY));
    const result = spawn.spawnCreep(workerBody, generateCreepName('worker'), {
      memory: { role: ROLE_HARVESTER, action: null, target: null },
    });

    logSpawnResult(result);
  }
};

const assignBuilders = (room: Room): void => {
  const shouldAssign = shouldBuildOrMaintain(room);
  const harvesterList = findWorkerByRole(room, ROLE_HARVESTER);
  const builderList = findWorkerByRole(room, ROLE_BUILDER);
  if (shouldAssign && builderList.length < room.memory.config.workerCountBuilder) {
    harvesterList.slice(0, room.memory.config.workerCountBuilder - builderList.length).forEach(setBuilderRole);
  } else if (shouldAssign === false) {
    builderList.forEach(setHarvesterRole);
  }
};

const assignUpgraders = (room: Room): void => {
  const shouldAssign = shouldUpgrade(room);
  const harvesterList = findWorkerByRole(room, ROLE_HARVESTER);
  const upgraderList = findWorkerByRole(room, ROLE_UPGRADER);
  if (shouldAssign && upgraderList.length < room.memory.config.workerCountUpgrader) {
    harvesterList.slice(0, room.memory.config.workerCountUpgrader - upgraderList.length).forEach(setUpgraderRole);
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

export const onTick = function (spawn: StructureSpawn): void {
  spawnWorker(spawn);

  if (findWorkerList(spawn.room).length >= spawn.room.memory.config.workerCountAll) {
    assignBuilders(spawn.room);
    assignUpgraders(spawn.room);
  }

  runBuilders(spawn.room);
  runHarvesters(spawn.room);
  runUpgraders(spawn.room);
};
