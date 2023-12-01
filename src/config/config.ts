export type CreepRoleConstant = typeof ROLE_BUILDER | typeof ROLE_HARVESTER | typeof ROLE_UPGRADER;

export const ROLE_BUILDER = 'builder';
export const ROLE_HARVESTER = 'harvester';
export const ROLE_UPGRADER = 'upgrader';

export const WORKER_ROLE_LIST = [ROLE_BUILDER, ROLE_HARVESTER, ROLE_UPGRADER];

export const MAIN_SPAWN_NAME = 'MainSpawn';
export const WORKER_RALLY_POINT_NAME = 'WorkerRallyPoint';

export const MINIMUM_LEVEL = 2;
export const MINIMUM_DOWNGRADE_TIMER_FRACTION = 0.2;
export const MAXIMUM_DOWNGRADE_TIMER_FRACTION = 0.4;

export const WORKER_BODY = [CARRY, WORK, MOVE];
export const MINIMUM_WORKERS = 10;
export const MINIMUM_BUILDERS = 4;
export const MINIMUM_UPGRADERS = 4;
