import { WORKER_RALLY_POINT_NAME } from '../config/config';
import { findClosestRallyPoint } from '../util/structureFinder';

export const moveToWorkerRallyPoint = (worker: Creep): void => {
  const rallyPoint = findClosestRallyPoint(worker, WORKER_RALLY_POINT_NAME);

  worker.moveTo(rallyPoint);
};
