// import { Server, Socket } from 'socket.io';
// import { createSocketBid } from '../modules/v1/bid/service';

// const usersInRooms: Record<string, string[]> = {}; // Users in each room
// const auctionProducts: Record<string, string[]> = {


// }; // Products in each auction

// export const handleSocket = (io: Server) => {
//   io.on('connection', (socket: Socket) => {
//     console.log('User connected:', socket.id);

//     // Event: joinRoom
//     socket.on('joinRoom', (data: { auctionId: string; userId: string }) => {
//       const { auctionId, userId } = data;
//       console.log(data) 
//       const roomName = `auction_${auctionId}`;
       
//       socket.join(roomName);

//       if (!usersInRooms[roomName]) {
//         usersInRooms[roomName] = [];

//       }
//       if (!usersInRooms[roomName].includes(userId)) {
//         usersInRooms[roomName].push(userId);
//       }


//       console.log(`User ${userId} joined room: ${roomName}`);
//       console.log('Users in room:', usersInRooms[roomName]);

//       // Emit users in the room
//       // io.to(roomName).emit('usersInRoom', usersInRooms[roomName]);

//       console.log("hello thisis auciton",auctionProducts[auctionId]);
//       // Emit the live product for the auction
//       if (auctionProducts[auctionId]?.length) {
//         console.log("hello thisis auciton",auctionProducts[auctionId]);
//         const liveProduct = auctionProducts[auctionId][0];
//         io.to(roomName).emit('liveProduct', liveProduct);
//         console.log(`Live product for auction ${auctionId}: ${liveProduct}`);
//       }
//     });

//     socket.on('updateProducts', (data: { auctionId?: string; products?: string[] }) => {
//       if (
//         typeof data === 'object' &&
//         typeof data.auctionId === 'string' &&
//         Array.isArray(data.products)
//       ) {
//         const { auctionId, products } = data;
    
//         auctionProducts[auctionId] = products;
//         console.log(`Updated products for auction ${auctionId}:`, products);
    
//         // Emit the first product as live
//         const roomName = `auction_${auctionId}`;
//         if (products.length > 0) {
//           const liveProduct = products[0];
//           io.to(roomName).emit('liveProduct', liveProduct);
//           console.log(`Live product for auction ${auctionId}: ${liveProduct}`);
//         } else {
//           console.log(`No products available for auction ${auctionId}`);
//         }
//       } else {
//         console.error('Invalid updateProducts data received:', data);
//       }
//     });
    

//     // Event: nextProduct
//     socket.on('nextProduct', (auctionId: string) => {
//       if (auctionProducts[auctionId]?.length) {
//         // Remove the first product and set the next one as live
//         auctionProducts[auctionId].shift();
//         const roomName = `auction_${auctionId}`;

//         if (auctionProducts[auctionId].length) {
//           const liveProduct = auctionProducts[auctionId][0];
//           io.to(roomName).emit('liveProduct', liveProduct);
//           console.log(`Next live product for auction ${auctionId}: ${liveProduct}`);
//         } else {
//           io.to(roomName).emit('liveProduct', null);
//           console.log(`No more products in auction ${auctionId}`);
//         }
//       }
//     });

//     // Event: create_bid
//     socket.on('create_bid', async (data: string) => {
//       try {
//         const bid = await createSocketBid(JSON.parse(data));
//         console.log('Bid created:', bid);

//         const roomName = `room_${socket.id}`;
//         io.to(roomName).emit('message', bid);
//       } catch (error) {
//         console.error('Error creating bid:', error);
//       }
//     });
 
     
//     socket.on('newBid',(data)=>{
//       console.log(data);
//         const {name , currentBid , auctionId} = data;
//         const roomName = `auction_${auctionId}`;
       
//         console.log("---------",data.name,data.currentBid,data.auctionId,roomName)
//         socket.to(roomName).emit('UpdateBid',{name: name , currentBid : currentBid})
//     })


//     // Event: disconnect
//     socket.on('disconnect', () => {
//       console.log(`User disconnected: ${socket.id}`);
//     });
//   });
// };


// import { Server, Socket } from 'socket.io';
// import { createSocketBid } from '../modules/v1/bid/service';

// export const handleSocket = (io: Server) => {
//   io.on('connection', (socket: Socket) => {
//     console.log('User connected:', socket.id);

//     socket.on('create_bid', async (data: string) => {
//       console.log('Message received from client:', data);
//       const bid = await createSocketBid(JSON.parse(data));

//       io.emit('message', bid);
//     });
//     socket.on('disconnect', () => {
//       console.log('User disconnected:', socket.id);
//     });
//   });
// };

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
      console.log("this is my data",data)
    

      // Join the auction room
      socket.join(roomName);

      // Add user to the room
      if (!usersInRooms[roomName]) {
        usersInRooms[roomName] = [];
      }
      if (!usersInRooms[roomName].includes(userId)) {
        usersInRooms[roomName].push(userId);
      }

      console.log(`User ${userId} joined room: ${roomName}`);
      console.log('Users in room:', usersInRooms[roomName]);
      console.log('Message:', message);


      // Emit the live product for the auction
      const liveProduct = auctionProduct[auctionId] || null;
      io.to(roomName).emit('liveProduct', liveProduct);
      console.log(`Live product for auction ${auctionId}: ${liveProduct}`);
      // new user joned brodcast mesaage to all
      io.emit("new_user", data.userId)
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
    socket.on('create_bid', async (data: string) => {
      try {
        const bid = await createSocketBid(JSON.parse(data));
        console.log('Bid created:', bid);

        // Emit the bid to the user who placed it
        const roomName = `room_${socket.id}`;
        io.to(roomName).emit('message', bid);
      } catch (error) {
        console.error('Error creating bid:', error);
      }
    });

    // Event: newBid
    socket.on('newBid', (data: { name: string; currentBid: number; auctionId: string }) => {
      const { name, currentBid, auctionId } = data;
      const roomName = `auction_${auctionId}`; 

      console.log(`New bid received for auction ${auctionId}:`, data);

      // Notify all users in the room about the new bid
      socket.to(roomName).emit('UpdateBid', { name, currentBid });
    });

    // Event: disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
