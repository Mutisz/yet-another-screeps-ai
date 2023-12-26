import { isEmpty } from 'lodash';
import { RoomLevel } from './const';
import { onTick as constructionManagerOnTick, StructurePosition, StructureStatus } from './construction/manager';
import { loop as loopRoom } from './room/manager';

import { plan as planRoad } from './construction/structure/road';
import { plan as planWall } from './construction/structure/wall';
import { onTick as creepManagerOnTick } from './creep/manager';
import { pruneCreepMemory } from './util/garbageCollector';
import { CreepRoleConstant } from './creep/role/_const';
import { ACTION_RALLY, CreepActionConstant } from './creep/action/_const';
import { findClosestRallyPoint } from './util/structureFinder';
import { WORKER_RALLY_POINT_NAME } from './creep/action/rally';

type RoomObjectId = Id<_HasId & RoomObject>;

interface RoomConfig {
  controllerLevel: RoomLevel;
  workerCountAll: number;
  workerCountBuilder: number;
  workerCountUpgrader: number;
}

interface CreepAction {
  type: CreepActionConstant;
  target: Id<_HasId> | string;
}

declare global {
  interface RoomMemory {
    config: RoomConfig;
    upgrading: boolean;
    structureList: StructureStatus[];
    maintenanceList: Id<Structure>[];
  }

  interface Creep {
    isEmpty(resource?: ResourceConstant): boolean;
    isFull(resource?: ResourceConstant): boolean;
    setAction(type: CreepActionConstant, target: Id<_HasId>): void;
    setActionRally(): void;
  }

  interface CreepMemory {
    role: CreepRoleConstant;
    action: CreepAction;
  }

  function setControllerLevel(roomName: string, controllerLevel: RoomLevel): void;
  function setWorkerCountAll(roomName: string, count: number): void;
  function setWorkerCountBuilder(roomName: string, count: number): void;
  function setWorkerCountUpgrader(roomName: string, count: number): void;
  function planRoad(originId: RoomObjectId, targetId: RoomObjectId): void;
  function planWall(roomName: string, positionList: StructurePosition[]): void;
}

Creep.prototype.isEmpty = function (this: Creep, resource: ResourceConstant = RESOURCE_ENERGY): boolean {
  return this.store.getUsedCapacity(resource) === 0;
};

Creep.prototype.isFull = function (this: Creep, resource: ResourceConstant = RESOURCE_ENERGY): boolean {
  return this.store.getFreeCapacity(resource) === 0;
};

Creep.prototype.setAction = function (this: Creep, type: CreepActionConstant, target: Id<_HasId> | string): void {
  this.memory.action = { type, target };
};

Creep.prototype.setActionRally = function (this: Creep): void {
  const target = findClosestRallyPoint(this, WORKER_RALLY_POINT_NAME);
  this.memory.action = { type: ACTION_RALLY, target };
};

global.setControllerLevel = (roomName: string, controllerLevel: RoomLevel): void => {
  if (controllerLevel < 1 || controllerLevel > 8) {
    throw new Error('Invalid controller level!');
  }

  Game.rooms[roomName].memory.config.controllerLevel = controllerLevel;
};

global.setWorkerCountAll = (roomName: string, count: number): void => {
  const roomConfig = Game.rooms[roomName].memory.config;
  if (count <= roomConfig.workerCountBuilder + roomConfig.workerCountUpgrader) {
    throw new Error('All worker count cannot be lower or equal to builder and upgrader count!');
  }

  roomConfig.workerCountAll = count;
};

global.setWorkerCountBuilder = (roomName: string, count: number): void => {
  const roomConfig = Game.rooms[roomName].memory.config;
  if (count < 0 || count >= roomConfig.workerCountAll - roomConfig.workerCountUpgrader) {
    throw new Error('Builder count cannot be negative and at least one worker must be a harvester!');
  }

  roomConfig.workerCountBuilder = count;
};

global.setWorkerCountUpgrader = (roomName: string, count: number): void => {
  const roomConfig = Game.rooms[roomName].memory.config;
  if (count < 0 || count >= roomConfig.workerCountAll - roomConfig.workerCountBuilder) {
    throw new Error('Upgrader count cannot be negative and at least one worker must be a harvester!');
  }

  Game.rooms[roomName].memory.config.workerCountUpgrader = count;
};

global.planRoad = (originId: RoomObjectId, targetId: RoomObjectId): void => {
  const origin = Game.getObjectById(originId);
  const destination = Game.getObjectById(targetId);
  if (origin === null || destination === null) {
    throw new Error('Invalid room object ID!');
  }

  planRoad(origin.pos, destination.pos);
};

global.planWall = (roomName: string, positionList: StructurePosition[]): void => {
  if (!(roomName in Game.rooms)) {
    throw new Error('Invalid room name!');
  }
  if (positionList.length <= 0) {
    throw new Error('Invalid wall position list!');
  }

  planWall(positionList.map((position) => new RoomPosition(position.x, position.y, roomName)));
};

const createDefaultRoomMemory = (): RoomMemory => ({
  config: {
    controllerLevel: 3,
    workerCountAll: 6,
    workerCountBuilder: 2,
    workerCountUpgrader: 2,
  },
  upgrading: true,
  structureList: [],
  maintenanceList: [],
});

const initializeMemory = (room: Room): void => {
  if (isEmpty(room.memory)) {
    room.memory = createDefaultRoomMemory();
  }
};

export const loop = () => {
  for (const roomName in Game.rooms) {
    const room = Game.rooms[roomName];
    initializeMemory(room);
    loopRoom(room);
    constructionManagerOnTick(room);
    creepManagerOnTick(room);
  }

  pruneCreepMemory();
};
