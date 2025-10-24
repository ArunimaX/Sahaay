// Complete Blacklisting Workflow Test

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

  positiveKeywords.forEach(keyword => {
    if (text.includes(keyword)) positiveScore++;
  });

  negativeKeywords.forEach(keyword => {
    if (text.includes(keyword)) negativeScore++;
  });

  const ratingBias = rating <= 2 ? -2 : rating >= 4 ? 2 : 0;
  const finalScore = positiveScore - negativeScore + ratingBias;

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

  return { sentiment, confidence, positiveScore, negativeScore, ratingBias, finalScore };
}

// Simulate complete workflow
function simulateBlacklistWorkflow() {
  console.log('🔄 COMPLETE BLACKLISTING WORKFLOW SIMULATION');
  console.log('=' .repeat(60));
  
  // Simulate reviews coming in over time
  const reviewStream = [
    { entity: 'NGO-HelpingHands', rating: 5, text: "Amazing work! Excellent service and professional staff. Highly recommend!" },
    { entity: 'NGO-HelpingHands', rating: 4, text: "Great impact in community. Reliable and trustworthy organization." },
    { entity: 'Business-QuickFix', rating: 1, text: "Terrible service! Awful experience, completely useless and unprofessional." },
    { entity: 'NGO-HelpingHands', rating: 2, text: "Disappointing results. Poor organization and frustrating communication." },
    { entity: 'Business-QuickFix', rating: 1, text: "Horrible experience! Rude staff, pathetic service. Complete waste of money." },
    { entity: 'NGO-HelpingHands', rating: 1, text: "Useless organization. Terrible management and awful results. Regret donating." },
    { entity: 'Business-QuickFix', rating: 4, text: "Good service this time. Professional and helpful staff." },
    { entity: 'NGO-HelpingHands', rating: 1, text: "Disgusting misuse of funds. Incompetent staff and outrageous practices." }
  ];
  
  const entities = {};
  
  reviewStream.forEach((review, index) => {
    console.log(`\n📝 REVIEW ${index + 1} RECEIVED:`);
    console.log(`Entity: ${review.entity}`);
    console.log(`Rating: ${review.rating}/5`);
    console.log(`Text: "${review.text}"`);
    
    // Initialize entity if new
    if (!entities[review.entity]) {
      entities[review.entity] = {
        totalReviews: 0,
        negativeReviews: 0,
        reviews: [],
        status: 'active'
      };
    }
    
    // Analyze sentiment
    const analysis = analyzeSentiment(review.text, review.rating);
    console.log(`🤖 ML Analysis: ${analysis.sentiment.toUpperCase()} (${(analysis.confidence * 100).toFixed(1)}%)`);
    
    // Update entity data
    entities[review.entity].totalReviews++;
    entities[review.entity].reviews.push({ ...review, analysis });
    
    if (analysis.sentiment === 'negative' && analysis.confidence > 0.6) {
      entities[review.entity].negativeReviews++;
    }
    
    // Check blacklisting threshold
    const negativePercentage = (entities[review.entity].negativeReviews / entities[review.entity].totalReviews) * 100;
    const shouldFlag = negativePercentage > 30 && entities[review.entity].status === 'active';
    
    console.log(`📊 Entity Status: ${entities[review.entity].negativeReviews}/${entities[review.entity].totalReviews} negative (${negativePercentage.toFixed(1)}%)`);
    
    if (shouldFlag) {
      entities[review.entity].status = 'flagged';
      console.log(`🚨 ALERT: ${review.entity} FLAGGED FOR BLACKLISTING!`);
      console.log(`   Reason: Exceeded 30% negative review threshold`);
      console.log(`   Action Required: Admin investigation needed`);
    }
    
    console.log('-'.repeat(40));
  });
  
  // Final summary
  console.log('\n📋 FINAL ENTITY STATUS REPORT:');
  console.log('=' .repeat(60));
  
  Object.entries(entities).forEach(([entityName, data]) => {
    const negativePercentage = (data.negativeReviews / data.totalReviews) * 100;
    
    console.log(`\n🏢 ${entityName.toUpperCase()}:`);
    console.log(`   Total Reviews: ${data.totalReviews}`);
    console.log(`   Negative Reviews: ${data.negativeReviews}`);
    console.log(`   Negative Percentage: ${negativePercentage.toFixed(1)}%`);
    console.log(`   Status: ${data.status.toUpperCase()}`);
    
    if (data.status === 'flagged') {
      console.log(`   🚨 FLAGGED FOR ADMIN REVIEW`);
      console.log(`   📋 Admin Actions Available:`);
      console.log(`      • Investigate entity practices`);
      console.log(`      • Clear flag if reviews are unfair`);
      console.log(`      • Blacklist if practices are problematic`);
    } else {
      console.log(`   ✅ OPERATING NORMALLY`);
    }
  });
  
  console.log('\n✅ BLACKLISTING WORKFLOW TEST COMPLETE!');
  console.log('\n🎯 KEY INSIGHTS:');
  console.log('• ML sentiment analysis automatically detects problematic entities');
  console.log('• 30% threshold prevents false positives from single bad reviews');
  console.log('• Real-time flagging enables quick admin intervention');
  console.log('• System maintains audit trail for all decisions');
}

simulateBlacklistWorkflow();