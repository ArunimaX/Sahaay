
import { Router } from 'express';
import { BlockchainService } from '../services/blockchain-service';

const router = Router();

// Initialize table on startup (lazy init)
BlockchainService.initializeTable().catch(console.error);

router.get('/chain', async (req, res) => {
    try {
        const chain = await BlockchainService.getChain();
        const isValid = await BlockchainService.isChainValid();
        res.json({ success: true, chain, isValid });
    } catch (error) {
        console.error('Error fetching chain:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch blockchain' });
    }
});

router.post('/upload-proof', async (req, res) => {
    try {
        const { ngoId, deliveryId, photoUrl, temperature, notes } = req.body;

        if (!ngoId || !deliveryId || !photoUrl) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        const newBlock = await BlockchainService.addBlock({
            ngoId,
            deliveryId,
            photoUrl,
            temperature,
            notes,
            timestamp: Date.now()
        });

        res.status(201).json({ success: true, block: newBlock, message: 'Proof added to blockchain' });
    } catch (error) {
        console.error('Error adding block:', error);
        res.status(500).json({ success: false, error: 'Failed to add proof to blockchain' });
    }
});

export default router;
