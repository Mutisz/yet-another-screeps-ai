import { curry, pull } from 'lodash';

const COLOR = '#D3D3D3';
const MAINTENANCE_FREQUENCY = 1000;
const HITS_FRACTION_MIN = 0.2;
const HITS_FRACTION_MAX = 0.4;

export interface RoadStatus {
  lastMaintenance: number;
  positionIterator: number;
  positionList: PathStep[];
}

export interface RoadEndpoint {
  x: number;
  y: number;
}

const findRoadPath = (origin: RoomPosition, destination: RoomPosition, range: number): PathStep[] =>
  Game.rooms[origin.roomName].findPath(origin, destination, { ignoreCreeps: true, swampCost: 1, range });

const drawRoadPath = (room: Room, path: PathStep[]): void =>
  path.forEach((position) => room.visual.circle(position.x, position.y, { fill: COLOR }));

const completeRoad = (roadStatus: RoadStatus): void => {
  roadStatus.lastMaintenance = Game.time;
};

const buildRoad = (room: Room, roadPosition: PathStep): void => {
  room.createConstructionSite(roadPosition.x, roadPosition.y, STRUCTURE_ROAD);
};

const maintainRoad = (road: Structure, roadStatus: RoadStatus): void => {
  const hitsFraction = road.hits / road.hitsMax;
  if (hitsFraction < HITS_FRACTION_MIN) {
    road.room.memory.maintenanceList.push(road.id);
  } else if (hitsFraction > HITS_FRACTION_MAX) {
    pull(road.room.memory.maintenanceList, road.id);
    roadStatus.positionIterator++;
  }

  if (roadStatus.positionIterator >= roadStatus.positionList.length) {
    completeRoad(roadStatus);
  }
};

const resetPositionIteratorIfMaintenanceRequired = (roadStatus: RoadStatus): void => {
  const completed = roadStatus.positionIterator > roadStatus.positionList.length;
  if (completed === true && Game.time - roadStatus.lastMaintenance > MAINTENANCE_FREQUENCY) {
    roadStatus.positionIterator = 0;
  }
};

const buildAndMaintainRoad = (room: Room, roadStatus: RoadStatus): void => {
  resetPositionIteratorIfMaintenanceRequired(roadStatus);
  if (roadStatus.positionIterator >= roadStatus.positionList.length) {
    return;
  } else {
    drawRoadPath(room, roadStatus.positionList);
  }

  const roadPosition = roadStatus.positionList[roadStatus.positionIterator];
  const road =
    room
      .lookForAt(LOOK_STRUCTURES, roadPosition.x, roadPosition.y)
      .find((structure) => structure.structureType === STRUCTURE_ROAD) ?? null;
  const construction = road
    ? room
        .lookForAt(LOOK_CONSTRUCTION_SITES, roadPosition.x, roadPosition.y)
        .find((construction) => construction.structureType === STRUCTURE_ROAD)
    : null;

  if (road === null && construction === null) {
    buildRoad(room, roadPosition);
  } else if (road !== null) {
    maintainRoad(road, roadStatus);
  }
};

export const planRoad = (origin: RoomPosition, destination: RoomPosition, range: number = 1): void => {
  const room = Game.rooms[origin.roomName];
  room.memory.roadList.push({
    lastMaintenance: 0,
    positionIterator: 0,
    positionList: findRoadPath(origin, destination, range),
  });
};

export const onTick = (room: Room): void => {
  room.memory.roadList.forEach(curry(buildAndMaintainRoad)(room));
};
