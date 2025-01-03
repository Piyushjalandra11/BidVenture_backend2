import { Router } from 'express';
import {
  createAuctionHandler,
  getAuctionHandler,
  getAuctionsHandler,
  getLiveAuctionsHandler,
  getUpcomingAuctionsHandler,
  getPreviousAuctionsHandler,
  // createAuctionWithProduct
  
} from './controller';
import { upload } from '../../../middlewares/multer';

const auctionRouter = Router();

auctionRouter.get('/', getAuctionsHandler); 
auctionRouter.post('/', createAuctionHandler); 
auctionRouter.get('/live', getLiveAuctionsHandler);

 
auctionRouter.get('/upcoming', getUpcomingAuctionsHandler); 
auctionRouter.get('/previous', getPreviousAuctionsHandler); 
auctionRouter.get('/:id', getAuctionHandler); 


// auctionRouter.post('/create-product',upload.array('files', 10), createAuctionWithProduct)

export default auctionRouter;
