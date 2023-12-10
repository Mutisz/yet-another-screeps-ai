import { isEmpty } from 'lodash';
import { CreepActionConstant, CreepRoleConstant, MAIN_SPAWN_NAME, RoomLevel } from './config/config';
import { onTick as constructionManagerOnTick, planRoad, RoadStatus } from './construction/manager';
import { onTick as creepManagerOnTick } from './creep/manager';

type RoomObjectId = Id<_HasId & RoomObject>;

interface RoomConfig {
  controllerLevel: RoomLevel;
  workerCountAll: number;
  workerCountBuilder: number;
  workerCountUpgrader: number;
}

declare global {
  interface RoomMemory {
    config: RoomConfig;
    upgrading: boolean;
    roadList: RoadStatus[];
    maintenanceList: Id<Structure>[];
  }

  interface CreepMemory {
    role: CreepRoleConstant;
    action: CreepActionConstant | null;
    target: Id<Source> | null;
  }

  function setControllerLevel(roomName: string, controllerLevel: RoomLevel): void;
  function setWorkerCountAll(roomName: string, count: number): void;
  function setWorkerCountBuilder(roomName: string, count: number): void;
  function setWorkerCountUpgrader(roomName: string, count: number): void;
  function planRoad(originId: RoomObjectId, targetId: RoomObjectId): void;
}

global.setControllerLevel = (roomName: string, controllerLevel: RoomLevel): void => {
  if (controllerLevel < 1 || controllerLevel > 8) {
    throw new Error('Invalid controller level!');
  }

  Game.rooms[roomName].memory.config.controllerLevel = controllerLevel;
};

global.setWorkerCountAll = (roomName: string, count: number): void => {
  Game.rooms[roomName].memory.config.workerCountAll = count;
};

global.setWorkerCountBuilder = (roomName: string, count: number): void => {
  Game.rooms[roomName].memory.config.workerCountBuilder = count;
};

global.setWorkerCountUpgrader = (roomName: string, count: number): void => {
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

const createDefaultRoomMemory = (): RoomMemory => ({
  config: {
    controllerLevel: 2,
    workerCountAll: 6,
    workerCountBuilder: 2,
    workerCountUpgrader: 2,
  },
  upgrading: true,
  roadList: [],
  maintenanceList: [],
});

const initializeMemory = (room: Room): void => {
  if (isEmpty(room.memory)) {
    room.memory = createDefaultRoomMemory();
  }
};

export const loop = () => {
  const spawn = Game.spawns[MAIN_SPAWN_NAME];
  initializeMemory(spawn.room);
  constructionManagerOnTick(spawn.room);
  creepManagerOnTick(spawn);
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
};
