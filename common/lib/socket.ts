import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '../types/global';

export const socket: Socket<ClientToServerEvents, ServerToClientEvents> = io();