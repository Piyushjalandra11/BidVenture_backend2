import { Router } from 'express';
import {
  createAuctionHandler,
  getAuctionHandler,
  getAuctionsHandler,
  getLiveAuctionsHandler,
  getUpcomingAuctionsHandler,
  getPreviousAuctionsHandler,
  joinAuctionHandler,
  getAuctionsDetailsHandler
  
} from './controller';

const auctionRouter = Router();

auctionRouter.get('/', getAuctionsHandler); 
auctionRouter.post('/', createAuctionHandler); 
auctionRouter.get('/live', getLiveAuctionsHandler);
auctionRouter.get('/join/:id', joinAuctionHandler);
 
auctionRouter.get('/upcoming', getUpcomingAuctionsHandler); 
auctionRouter.get('/previous', getPreviousAuctionsHandler); 
auctionRouter.get('/:id', getAuctionHandler); 

auctionRouter.get('/details/:id', getAuctionsDetailsHandler)




export default auctionRouter;
