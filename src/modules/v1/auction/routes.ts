import { Router } from 'express';
import {
  createAuctionHandler,
  getAuctionHandler,
  getAuctionsHandler,
  getLiveAuctionsHandler,
  getUpcomingAuctionsHandler,
  getPreviousAuctionsHandler,
  
} from './controller';

const auctionRouter = Router();

auctionRouter.get('/', getAuctionsHandler); 
auctionRouter.post('/', createAuctionHandler); 
auctionRouter.get('/live', getLiveAuctionsHandler);

 
auctionRouter.get('/upcoming', getUpcomingAuctionsHandler); 
auctionRouter.get('/previous', getPreviousAuctionsHandler); 
auctionRouter.get('/:id', getAuctionHandler); 

export default auctionRouter;
