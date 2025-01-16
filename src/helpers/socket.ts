import { Server, Socket } from 'socket.io';
import { createSocketBid } from '../modules/v1/bid/service';

const usersInRooms: Record<string, string[]> = {}; 
const auctionProduct: Record<string, string | null> = {}; 


export const handleSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    // Event: joinRoom
    socket.on('joinRoom', (data: { auctionId: string; userId: string, message: string }) => {
      const { auctionId, userId, message } = data;
      const roomName = `auction_${auctionId}`;

      // Join the auction room
      socket.join(roomName);

      // Add user to the room
      if (!usersInRooms[roomName]) {
        usersInRooms[roomName] = [];
      }
      if (!usersInRooms[roomName].includes(userId)) {
        usersInRooms[roomName].push(userId);
      }

      // Emit the live product for the auction
      const liveProduct = auctionProduct[auctionId] || null;
      socket.emit('liveProduct', liveProduct);
      console.log(`Live product for auction ${auctionId}: ${liveProduct}`); 
      
    });
    
    socket.on("new_user1", (data) => {
      console.log(`${data.userId.name}, ${data.auctionId} has joined the auction`);
      io.emit("new_userjoined",data)

    });

    // Event: updateProduct
    socket.on('updateProduct', (data: { auctionId: string; product: string }) => {
      const { auctionId, product } = data;

      // Update the product for the auction
      auctionProduct[auctionId] = product;
      console.log(`Updated product for auction ${auctionId}: ${product}`);

      // Emit the product to all users in the auction room
      const roomName = `auction_${auctionId}`;
      io.to(roomName).emit('liveProduct', product);
    });

    // Event: removeProduct
    socket.on('removeProduct', (auctionId: string) => {
      // Remove the product from the auction
      auctionProduct[auctionId] = null;
      console.log(`Product removed for auction ${auctionId}`);

      // Notify all users in the auction room
      const roomName = `auction_${auctionId}`;
      io.to(roomName).emit('liveProduct', null);
    });

    // Event: create_bid
    socket.on('newBid', async (data: string) => {
      console.log("thids is new data",data);
      
      try {
        const bid:any = await createSocketBid(data);
        console.log('Bid created:', bid);

        // Emit the bid to the user who placed it
        const roomName = `auction_${bid.productId}`;
        console.log("room name", roomName)
        io.to(roomName).emit('message', {
          amount: bid.amount,
          userId: bid.userId,
          name: bid.user?.name || 'Anonymous',
          productId: bid.productId,
          auctionId: bid.auctionId,
        });
      } catch (error) {
        console.error('Error creating bid:', error);
      }
    });

    // Event: disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
