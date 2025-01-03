import cron from 'node-cron';
import  Auction  from '../modules/v1/auction/model';
import { Op } from 'sequelize';

const updateAuctionStatus = async (): Promise<void> => {
  const currentTime = new Date();

  try {
    await Auction.update(
      { status: 'active' },
      {
        where: {
          status: 'upcoming',
          start_time: { [Op.lte]: currentTime },
          end_time: { [Op.gte]: currentTime },
        },
      }
    );


    await Auction.update(
      { status: 'closed' },
      {
        where: {
          end_time: { [Op.lt]: currentTime },
          status: { [Op.ne]: 'closed' },
        },
      }
    );

    console.log('Auction statuses updated');
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
