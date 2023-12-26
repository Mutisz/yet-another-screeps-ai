import { assignBuilders, assignUpgraders } from './director';
import { spawnWorker } from './spawner';
import { withdraw } from './action/withdraw';
import { upgrade } from './action/upgrade';
import { ROLE_BUILDER, ROLE_HARVESTER, ROLE_UPGRADER, WORKER_ROLE_LIST } from './role/_const';
import { setActionBuilder } from './role/builder';
import { setActionHarvester } from './role/harvester';
import { setActionUpgrader } from './role/upgrader';
import {
  ACTION_BUILD,
  ACTION_DEPOSIT,
  ACTION_HARVEST,
  ACTION_RALLY,
  ACTION_UPGRADE,
  ACTION_WITHDRAW,
} from './action/_const';
import { deposit } from './action/deposit';
import { build } from './action/build';
import { harvest } from './action/harvest';
import { rally } from './action/rally';

const isWorker = (creep: Creep): boolean => WORKER_ROLE_LIST.includes(creep.memory.role);

const findWorkerList = (room: Room): Creep[] => room.find(FIND_MY_CREEPS, { filter: isWorker });

const hasEnoughWorkers = (room: Room): boolean => findWorkerList(room).length >= room.memory.config.workerCountAll;

const runSpawnerAndDirector = (room: Room): void => {
  if (hasEnoughWorkers(room) === false) {
    spawnWorker(room);
  } else {
    assignBuilders(room);
    assignUpgraders(room);
  }
};

const setAction = (creep: Creep): void => {
  switch (creep.memory.role) {
    case ROLE_BUILDER:
      setActionBuilder(creep);
      break;
    case ROLE_HARVESTER:
      setActionHarvester(creep);
      break;
    case ROLE_UPGRADER:
      setActionUpgrader(creep);
      break;
    default:
      throw new Error(`Role ${creep.memory.role} is unhandled!`);
  }
};

const runAction = (creep: Creep): void => {
  switch (creep.memory.action.type) {
    case ACTION_BUILD:
      build(creep);
      break;
    case ACTION_DEPOSIT:
      deposit(creep);
      break;
    case ACTION_HARVEST:
      harvest(creep);
      break;
    case ACTION_RALLY:
      rally(creep);
      break;
    case ACTION_UPGRADE:
      upgrade(creep);
      break;
    case ACTION_WITHDRAW:
      withdraw(creep);
      break;
    default:
      throw new Error(`Action ${creep.memory.action.type} is unhandled!`);
  }
};

export const onTick = (room: Room): void => {
  runSpawnerAndDirector(room);
  findWorkerList(room).forEach((creep) => {
    setAction(creep);
    runAction(creep);
  });
};
