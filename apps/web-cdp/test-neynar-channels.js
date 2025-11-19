// Test script to check if Neynar supports channel creation
// Run with: node test-neynar-channels.js

const { NeynarAPIClient, Configuration } = require('@neynar/nodejs-sdk');

const config = new Configuration({
  apiKey: process.env.NEYNAR_API_KEY,
});

const neynarClient = new NeynarAPIClient(config);

async function testChannelCreation() {
  console.log('Testing Neynar channel capabilities...\n');

  // Check if createChannel method exists
  if (typeof neynarClient.createChannel === 'function') {
    console.log('✅ createChannel method exists in SDK');

    try {
      // Try to create a test channel
      console.log('\nAttempting to create a test channel...');
      const testChannel = await neynarClient.createChannel({
        id: 'test-lendfriend-' + Date.now(),
        name: 'Test LendFriend Channel',
        description: 'Test channel - will delete',
      });

      console.log('✅ SUCCESS! Channel creation is supported!');
      console.log('Channel created:', testChannel);
      return true;
    } catch (error) {
      console.log('❌ FAILED: Channel creation not available');
      console.log('Error:', error.message);

      if (error.message?.includes('403') || error.message?.includes('forbidden')) {
        console.log('\n💡 Your Neynar plan may not include channel creation.');
        console.log('   Contact Neynar to upgrade your plan.');
      } else if (error.message?.includes('not found') || error.message?.includes('404')) {
        console.log('\n💡 createChannel endpoint not available in API.');
      }

      return false;
    }
  } else {
    console.log('❌ createChannel method does NOT exist in SDK');
    console.log('\nAvailable methods:', Object.keys(neynarClient).filter(key => typeof neynarClient[key] === 'function'));
    return false;
  }
}

// Also check for fetchChannel to see if we can at least read channels
async function testChannelReading() {
  console.log('\n\nTesting channel reading capabilities...\n');

  try {
    // Try to fetch the main Farcaster channel
    const channel = await neynarClient.fetchChannel({
      id: 'farcaster',
    });

    console.log('✅ Can read channels!');
    console.log('Example channel:', {
      id: channel.id,
      name: channel.name,
      followerCount: channel.follower_count,
    });
  } catch (error) {
    console.log('❌ Cannot read channels');
    console.log('Error:', error.message);
  }
}

// Run tests
(async () => {
  const canCreate = await testChannelCreation();
  await testChannelReading();

  console.log('\n\n=== SUMMARY ===');
  if (canCreate) {
    console.log('✅ You CAN create channels programmatically!');
    console.log('   Proceed with per-loan channel creation.');
  } else {
    console.log('❌ Channel creation not available');
    console.log('   Options:');
    console.log('   1. Contact Neynar to upgrade plan');
    console.log('   2. Use shared /lendfriend channel for all loans');
    console.log('   3. Manually create channels via Warpcast');
  }
})();
