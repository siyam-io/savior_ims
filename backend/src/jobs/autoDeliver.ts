import cron from 'node-cron';
import Order from '../modules/order/model.js';

export const startAutoDeliverJob = () => {
  // Run every day at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('[Job] Running auto-deliver check...');
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    try {
      const result = await Order.updateMany(
        {
          deliveryStatus: 'pending',
          createdAt: { $lte: sevenDaysAgo }
        },
        {
          $set: { 
            deliveryStatus: 'delivered',
            deliveredAt: new Date()
          }
        }
      );
      console.log(`[Job] Auto-delivered ${result.modifiedCount} orders older than 7 days.`);
    } catch (error) {
      console.error('[Job] Auto-deliver error:', error);
    }
  });
};
