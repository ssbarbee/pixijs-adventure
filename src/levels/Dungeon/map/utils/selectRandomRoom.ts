import { ConnectableRoom } from '../types';
import { getAllRooms } from './getAllRooms';

export function selectRandomRoom(root: ConnectableRoom): ConnectableRoom {
  const allRooms = getAllRooms(root);
  return allRooms[Math.floor(Math.random() * allRooms.length)];
}
