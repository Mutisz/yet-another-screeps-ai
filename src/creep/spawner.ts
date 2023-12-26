import { fill, first, floor, reduce } from 'lodash';
import { generateCreepName } from '../util/nameGenerator';
import { ROLE_HARVESTER, WORKER_BODY } from './role/_const';
import { ACTION_RALLY } from './action/_const';

const logSpawnResult = (result: ScreepsReturnCode): void => {
  switch (result) {
    case OK:
    case ERR_NOT_ENOUGH_ENERGY:
      break;
    default:
      throw new Error(`Spawning worker failed with ${result} error code!`);
  }
};

const generateWorkerBody = (room: Room): BodyPartConstant[] => {
  const baseWorkerCost = reduce(WORKER_BODY, (acc, bodyPart) => acc + BODYPART_COST[bodyPart], 0);
  const workerLevel = floor(room.energyCapacityAvailable / baseWorkerCost);

  return WORKER_BODY.concat(...fill(Array(workerLevel - 1), WORKER_BODY));
};

export const spawnWorker = (room: Room): void => {
  const spawn = first(room.find(FIND_MY_SPAWNS, { filter: { spawning: false } })) ?? null;
  if (spawn !== null) {
    const result = spawn.spawnCreep(generateWorkerBody(room), generateCreepName('worker'), {
      memory: { role: ROLE_HARVESTER, action: { type: ACTION_RALLY, target: spawn.id } },
    });

    logSpawnResult(result);
  }
};
