import { curry } from 'lodash';

const ROAD_COLOR = '#D3D3D3';

interface VisibleRoomObject extends RoomObject {
  room: Room;
}

export type RoadStatus = {
  built: boolean;
  constructionIterator: number;
  roadPositionList: PathStep[];
};

const findRoadPath = (origin: VisibleRoomObject, destination: VisibleRoomObject): PathStep[] =>
  origin.room.findPath(origin.pos, destination.pos, { ignoreCreeps: true });

const drawRoadPath = (room: Room, path: PathStep[]): void => {
  path.forEach((position) => room.visual.circle(position.x, position.y, { fill: ROAD_COLOR }));
};

const createRoadConstruction = (room: Room, roadStatus: RoadStatus): void => {
  const constructionPosition = roadStatus.roadPositionList[roadStatus.constructionIterator];
  const constructionComplete =
    room
      .lookForAt(LOOK_STRUCTURES, constructionPosition.x, constructionPosition.y)
      .filter((structure) => structure.structureType === STRUCTURE_ROAD).length > 0;
  if (constructionComplete === true) {
    roadStatus.constructionIterator++;
  } else {
    room.createConstructionSite(constructionPosition.x, constructionPosition.y, STRUCTURE_ROAD);
  }
};

const buildRoad = (room: Room, roadStatus: RoadStatus): void => {
  if (roadStatus.built === true) {
    return;
  }

  createRoadConstruction(room, roadStatus);
  drawRoadPath(room, roadStatus.roadPositionList);
};

export const planRoad = (originId: Id<_HasId & VisibleRoomObject>, targetId: Id<_HasId & VisibleRoomObject>): void => {
  const origin = Game.getObjectById(originId) as VisibleRoomObject;
  const destination = Game.getObjectById(targetId) as VisibleRoomObject;

  origin.room.memory.roadList.push({
    built: false,
    constructionIterator: 0,
    roadPositionList: findRoadPath(origin, destination),
  });
};

export const onTick = (room: Room): void => {
  room.memory.roadList.forEach(curry(buildRoad)(room));
};
