
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5001/api/blockchain';

async function testBlockchainFlow() {
    console.log('Starting Blockchain Flow Test...');

    // 1. Get initial chain
    console.log('\n1. Fetching initial chain...');
    try {
        const res = await fetch(`${BASE_URL}/chain`);
        const data = await res.json();
        console.log('Initial Chain Length:', data.chain.length);
        console.log('Chain Valid:', data.isValid);
    } catch (e) {
        console.error('Failed to fetch chain:', e.message);
        return;
    }

    // 2. Upload a proof
    console.log('\n2. Uploading a proof...');
    const proofData = {
        ngoId: 'TEST_NGO_123',
        deliveryId: `DEL-${Date.now()}`,
        photoUrl: 'https://example.com/proof.jpg',
        temperature: '25',
        notes: 'Test delivery proof'
    };

    try {
        const res = await fetch(`${BASE_URL}/upload-proof`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(proofData)
        });
        const data = await res.json();

        if (data.success) {
            console.log('Proof Uploaded Successfully!');
            console.log('New Block Hash:', data.block.hash);
            console.log('Block Index:', data.block.index);
        } else {
            console.error('Upload Failed:', data.error);
            return;
        }
    } catch (e) {
        console.error('Failed to upload proof:', e.message);
        return;
    }

    // 3. Verify chain update
    console.log('\n3. Verifying chain update...');
    try {
        const res = await fetch(`${BASE_URL}/chain`);
        const data = await res.json();
        const latestBlock = data.chain[data.chain.length - 1];

        console.log('New Chain Length:', data.chain.length);
        console.log('Latest Block Delivery ID:', latestBlock.data.deliveryId);

        if (latestBlock.data.deliveryId === proofData.deliveryId) {
            console.log('✅ VERIFICATION SUCCESSFUL: Block found in chain.');
        } else {
            console.error('❌ VERIFICATION FAILED: Block not found.');
        }
    } catch (e) {
        console.error('Failed to verify chain:', e.message);
    }
}

testBlockchainFlow();
