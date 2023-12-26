export type CreepRoleConstant = typeof ROLE_BUILDER | typeof ROLE_HARVESTER | typeof ROLE_UPGRADER;

export const ROLE_BUILDER = 'builder';
export const ROLE_HARVESTER = 'harvester';
export const ROLE_UPGRADER = 'upgrader';

export const WORKER_ROLE_LIST = [ROLE_BUILDER, ROLE_HARVESTER, ROLE_UPGRADER];
export const WORKER_BODY = [CARRY, WORK, MOVE];
