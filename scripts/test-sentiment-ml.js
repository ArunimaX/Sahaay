// Simple test without database connection for now

// Testing sentiment analysis without database

// Sentiment Analysis ML Function (from our service)
function analyzeSentiment(reviewText, rating) {
  const positiveKeywords = [
    'excellent', 'amazing', 'outstanding', 'fantastic', 'wonderful', 'great', 'awesome',
    'perfect', 'brilliant', 'superb', 'exceptional', 'marvelous', 'incredible', 'fabulous',
    'terrific', 'magnificent', 'splendid', 'remarkable', 'impressive', 'delightful',
    'satisfying', 'pleased', 'happy', 'grateful', 'thankful', 'appreciate', 'recommend',
    'helpful', 'professional', 'efficient', 'reliable', 'trustworthy', 'quality', 'value'
  ];

  const negativeKeywords = [
    'terrible', 'awful', 'horrible', 'disgusting', 'pathetic', 'useless', 'worthless',
    'disappointing', 'frustrating', 'annoying', 'irritating', 'infuriating', 'outrageous',
    'unacceptable', 'ridiculous', 'absurd', 'incompetent', 'unprofessional', 'rude',
    'disrespectful', 'unhelpful', 'slow', 'delayed', 'broken', 'defective', 'faulty',
    'poor', 'bad', 'worst', 'hate', 'regret', 'waste', 'scam', 'fraud', 'cheat'
  ];

  const text = reviewText.toLowerCase();
  let positiveScore = 0;
  let negativeScore = 0;

  // Count keyword matches
  positiveKeywords.forEach(keyword => {
    if (text.includes(keyword)) positiveScore++;
  });

  negativeKeywords.forEach(keyword => {
    if (text.includes(keyword)) negativeScore++;
  });

  // Rating influence (1-2 stars = negative bias, 4-5 stars = positive bias)
  const ratingBias = rating <= 2 ? -2 : rating >= 4 ? 2 : 0;
  const finalScore = positiveScore - negativeScore + ratingBias;

  // Determine sentiment
  let sentiment, confidence;
  if (finalScore > 1) {
    sentiment = 'positive';
    confidence = Math.min(0.9, 0.6 + (finalScore * 0.1));
  } else if (finalScore < -1) {
    sentiment = 'negative';
    confidence = Math.min(0.9, 0.6 + (Math.abs(finalScore) * 0.1));
  } else {
    sentiment = 'neutral';
    confidence = 0.5;
  }

  return {
    sentiment,
    confidence: Math.round(confidence * 100) / 100,
    positiveScore,
    negativeScore,
    ratingBias,
    finalScore
  };
}

// Test Reviews (Kiro's reviews)
const testReviews = [
  {
    entityType: 'ngo',
    entityId: 'test-ngo-1',
    rating: 5,
    title: "Outstanding Community Impact",
    reviewText: "This NGO is absolutely amazing! Their work in the community is outstanding and I'm incredibly grateful for their professional approach. The staff is helpful, reliable, and truly makes a difference. I highly recommend supporting their excellent initiatives."
  },
  {
    entityType: 'business',
    entityId: 'test-business-1', 
    rating: 1,
    title: "Terrible Service Experience",
    reviewText: "This business is absolutely terrible! The service was awful, staff was rude and unprofessional. Complete waste of time and money. I regret choosing them - it was a horrible experience that left me frustrated and disappointed."
  },
  {
    entityType: 'ngo',
    entityId: 'test-ngo-2',
    rating: 3,
    title: "Average Performance",
    reviewText: "The NGO does okay work in the community. Nothing particularly impressive but they get the job done. Staff is decent and responds to queries. Could be better but not bad either."
  },
  {
    entityType: 'business',
    entityId: 'test-business-2',
    rating: 4,
    title: "Great Value and Service",
    reviewText: "Really pleased with this business! Great value for money, professional service, and helpful staff. They delivered exactly what was promised. Would definitely recommend to others."
  },
  {
    entityType: 'ngo',
    entityId: 'test-ngo-1',
    rating: 2,
    title: "Disappointing Results",
    reviewText: "Expected much better from this NGO. Their programs are poorly organized and the impact is minimal. Staff seems unprepared and communication is frustrating. Not impressed with their work."
  }
];

async function testSentimentAnalysis() {
  console.log('🧪 TESTING ML-BASED SENTIMENT ANALYSIS SYSTEM');
  console.log('=' .repeat(60));
  
  for (let i = 0; i < testReviews.length; i++) {
    const review = testReviews[i];
    console.log(`\n📝 TEST REVIEW ${i + 1}:`);
    console.log(`Entity: ${review.entityType.toUpperCase()} (${review.entityId})`);
    console.log(`Rating: ${review.rating}/5 stars`);
    console.log(`Title: "${review.title}"`);
    console.log(`Text: "${review.reviewText}"`);
    
    // Run ML sentiment analysis
    const analysis = analyzeSentiment(review.reviewText, review.rating);
    
    console.log('\n🤖 ML ANALYSIS RESULTS:');
    console.log(`Sentiment: ${analysis.sentiment.toUpperCase()}`);
    console.log(`Confidence: ${(analysis.confidence * 100).toFixed(1)}%`);
    console.log(`Positive Keywords Found: ${analysis.positiveScore}`);
    console.log(`Negative Keywords Found: ${analysis.negativeScore}`);
    console.log(`Rating Bias: ${analysis.ratingBias}`);
    console.log(`Final Score: ${analysis.finalScore}`);
    
    // Determine if this would contribute to blacklisting
    const wouldFlag = analysis.sentiment === 'negative' && analysis.confidence > 0.6;
    console.log(`🚩 Would Flag for Blacklist: ${wouldFlag ? 'YES' : 'NO'}`);
    
    console.log('-'.repeat(50));
  }
  
  // Summary statistics
  const sentiments = testReviews.map(review => 
    analyzeSentiment(review.reviewText, review.rating)
  );
  
  const positive = sentiments.filter(s => s.sentiment === 'positive').length;
  const negative = sentiments.filter(s => s.sentiment === 'negative').length;
  const neutral = sentiments.filter(s => s.sentiment === 'neutral').length;
  
  console.log('\n📊 SUMMARY STATISTICS:');
  console.log(`Total Reviews Analyzed: ${testReviews.length}`);
  console.log(`Positive Sentiment: ${positive} (${(positive/testReviews.length*100).toFixed(1)}%)`);
  console.log(`Negative Sentiment: ${negative} (${(negative/testReviews.length*100).toFixed(1)}%)`);
  console.log(`Neutral Sentiment: ${neutral} (${(neutral/testReviews.length*100).toFixed(1)}%)`);
  
  // Test blacklisting logic
  console.log('\n🛡️ BLACKLISTING SIMULATION:');
  const entities = {};
  
  testReviews.forEach(review => {
    const key = `${review.entityType}-${review.entityId}`;
    if (!entities[key]) {
      entities[key] = { total: 0, negative: 0, reviews: [] };
    }
    
    const analysis = analyzeSentiment(review.reviewText, review.rating);
    entities[key].total++;
    entities[key].reviews.push(analysis);
    
    if (analysis.sentiment === 'negative' && analysis.confidence > 0.6) {
      entities[key].negative++;
    }
  });
  
  Object.entries(entities).forEach(([entityKey, data]) => {
    const negativePercentage = (data.negative / data.total) * 100;
    const shouldFlag = negativePercentage > 30;
    
    console.log(`\n${entityKey.toUpperCase()}:`);
    console.log(`  Total Reviews: ${data.total}`);
    console.log(`  Negative Reviews: ${data.negative}`);
    console.log(`  Negative Percentage: ${negativePercentage.toFixed(1)}%`);
    console.log(`  🚨 FLAGGED FOR BLACKLIST: ${shouldFlag ? 'YES' : 'NO'}`);
  });
  
  console.log('\n✅ SENTIMENT ANALYSIS TEST COMPLETE!');
}

// Run the test
testSentimentAnalysis().catch(console.error);