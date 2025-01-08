import cron from 'node-cron';
import Auction from '../modules/v1/auction/model';
import { Op } from 'sequelize';
import AuctionRoom from '../modules/v1/auction/auctionroommodel';

const updateAuctionStatus = async (): Promise<void> => {
  const currentTime = new Date();

  try {
    // Step 1: Fetch all auctions that need to be activated
    const auctionsToActivate = await Auction.findAll({
      where: {
        status: 'upcoming',
        startTime: { [Op.lte]: currentTime },
      },
      attributes: ['id', 'name'], // Fetch relevant fields
    });

    if (auctionsToActivate.length > 0) {
      // Step 2: Extract auction IDs
      const auctionIds = auctionsToActivate.map((auction) => auction.id);
      console.log('Auctions to be activated:', auctionIds);

      // Step 3: Update the status of these auctions to 'active'
      await Auction.update(
        { status: 'active' },
        {
          where: {
            id: auctionIds,
          },
        }
      );

      console.log('Auction statuses updated successfully.');

      // Step 4: Create rooms for these auctions
      for (const auction of auctionsToActivate) {
        const roomName = `LiveAuction${auction.id}`;

        // Add initial data to the AuctionRoomCreate table
        await AuctionRoom.create({
         
          auctionId: auction.id, // Associated auction ID
          timeRemaining: 2 * 60000, // Set initial item to null or a placeholder
          currentBid: 0, // Initial bid
          leaderboard: [], // Empty leaderboard
        });

        console.log(`Room created: ${roomName} for Auction ID: ${auction.id}`);
      }
    } else {
      console.log('No auctions to activate at this time.');
    }
  } catch (error) {
    console.error('Error in updating auction statuses:', error);
  }
};

export const startAuctionCronJob = () => {
  cron.schedule('* * * * *', () => {
    console.log('Running Cron Job');
    updateAuctionStatus();
  });
};



// import cron from 'node-cron';
// import Auction from '../modules/v1/auction/model';
// import { Op } from 'sequelize';

// const updateAuctionStatus = async (): Promise<void> => {
//   const currentTime = new Date();

//   try {

  
//     await Auction.update(
//       { status: 'active' },
//       {
//         where: {
//           status: 'upcoming',
//           startTime: { [Op.lte]: currentTime },
//         },
//       }
//     ).then((res)=>{
//       console.log('Sunnn rha hu bhai 10 min baad auction live kr dunga automatic *******')
//       console.log('Auction statuses updated',res);

//       // IF ARRAY KE ANDER 1 AAYA TOHH ROOM CREATE KRDO OR TABLE MAI INTIAL DATA STORE KRDO 
 
//       //room create krna h or uska data store krna hE current item id ,time remaining , current bid, leaderboard
      
//       // or inko db me bhi store krwana he

//       if(res[0]===1)
//       {
//         console.log("yess i craeting room !!!!1-------",)
//       }
//     });

//   } catch (error) {
//     console.error('Error in updating auction statuses:', error);
//   }
// };


// export const startAuctionCronJob = () => {
//   cron.schedule('* * * * *', () => {
//     console.log('Running Cron Job');
//     updateAuctionStatus();
//   });
// };
