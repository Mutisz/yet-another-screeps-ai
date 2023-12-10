export type RoomLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type CreepRoleConstant = typeof ROLE_BUILDER | typeof ROLE_HARVESTER | typeof ROLE_UPGRADER;
export type CreepActionConstant = typeof ACTION_UPGRADE | typeof ACTION_WITHDRAW;

export const ROLE_BUILDER = 'builder';
export const ROLE_HARVESTER = 'harvester';
export const ROLE_UPGRADER = 'upgrader';

export const ACTION_UPGRADE = 'upgrade';
export const ACTION_WITHDRAW = 'withdraw';

export const WORKER_ROLE_LIST = [ROLE_BUILDER, ROLE_HARVESTER, ROLE_UPGRADER];

export const MAIN_SPAWN_NAME = 'MainSpawn';
export const WORKER_RALLY_POINT_NAME = 'WorkerRallyPoint';

export const WORKER_BODY = [CARRY, WORK, MOVE];
