import cron from 'node-cron';
import Auction from '../modules/v1/auction/model';
import { Op } from 'sequelize';
import { declareAuctionWinners } from '../modules/v1/auction/service';
// import { declareAuctionWinners } from './winnermail';

export async function updateAuctionStatus() {
  try {
    const currentTime = new Date();
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
  cron.schedule('* * * * *', async () => {
    console.log('Running Cron Job');
    await updateAuctionStatus();
    // declareAuctionWinners();
    await declareAuctionWinners();
  });
};

