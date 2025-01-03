import { Server, Socket } from 'socket.io';
import { createSocketBid } from '../modules/v1/bid/service';

export const handleSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    socket.on('create_bid', async (data: string) => {
      console.log('Message received from client:', data);
      const bid = await createSocketBid(JSON.parse(data));

      io.emit('message', bid);
    });
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

