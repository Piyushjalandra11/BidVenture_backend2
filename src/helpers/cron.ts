import cron from 'node-cron';
import Auction from '../modules/v1/auction/model';
import { Op } from 'sequelize';
import AuctionRoom from '../modules/v1/auction/auctionroommodel';


export async function updateAuctionStatus() {
  try {
    const currentTime = new Date();

    // Find all auctions where the start time is in the future and status is not 'active'
  

    // Find all auctions that should be 'active'
    const activeAuctions = await Auction.update(
      { status: 'active' },
      {
        where: {
          startTime: {
            [Op.lte]: currentTime,
          },
          endTime: {
            [Op.gte]: currentTime,
          },
          status: 'upcoming',
        },
      }
    );

    const closedAuctions = await Auction.update(
      { status: 'closed' },
      {
        where: {
          endTime: {
            [Op.lte]: currentTime,
          },
          status: 'active',
        },
      }
    );
 
    console.log(`Updated ${activeAuctions[0]} auctions to active.`);
    console.log(`Updated ${closedAuctions[0]} auctions to closed.`);
   
  } catch (error) {
    console.error("Error updating auction status:", error);
  }
}

export const startAuctionCronJob = () => {
  cron.schedule('* * * * *', () => {
    console.log('Running Cron Job');
    updateAuctionStatus();
  });
};

