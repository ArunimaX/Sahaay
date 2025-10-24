// Advanced Sentiment Analysis Testing with Edge Cases

// Sentiment Analysis ML Function
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

  return {
    sentiment,
    confidence: Math.round(confidence * 100) / 100,
    positiveScore,
    negativeScore,
    ratingBias,
    finalScore
  };
}

// Comprehensive Test Cases
const testCases = [
  {
    name: "Extremely Positive Review",
    text: "This organization is absolutely fantastic! Amazing work, excellent service, outstanding results. I'm incredibly grateful and highly recommend them to everyone!",
    rating: 5,
    expectedSentiment: "positive"
  },
  {
    name: "Extremely Negative Review", 
    text: "Terrible experience! Awful service, horrible staff, completely useless. This was a disgusting waste of time and money. Absolutely pathetic!",
    rating: 1,
    expectedSentiment: "negative"
  },
  {
    name: "Mixed Review (Positive Words, Low Rating)",
    text: "The staff was professional and helpful, but the overall experience was disappointing due to poor organization.",
    rating: 2,
    expectedSentiment: "negative"
  },
  {
    name: "Mixed Review (Negative Words, High Rating)",
    text: "Had some initial problems and delays, but they resolved everything quickly and professionally. Great final outcome!",
    rating: 4,
    expectedSentiment: "positive"
  },
  {
    name: "Neutral Review",
    text: "Standard service, nothing special but gets the job done. Staff is okay, responds to basic queries.",
    rating: 3,
    expectedSentiment: "neutral"
  },
  {
    name: "Sarcastic Negative (Edge Case)",
    text: "Oh wonderful, another delayed response. Fantastic communication skills. Really professional approach to customer service.",
    rating: 1,
    expectedSentiment: "negative"
  },
  {
    name: "Constructive Criticism",
    text: "Good intentions but poor execution. The team needs better organization and communication. Has potential for improvement.",
    rating: 2,
    expectedSentiment: "negative"
  },
  {
    name: "Enthusiastic Positive",
    text: "Incredible impact in our community! These people are amazing, reliable, and truly make a difference. Exceptional work!",
    rating: 5,
    expectedSentiment: "positive"
  }
];

function runAdvancedTests() {
  console.log('🔬 ADVANCED ML SENTIMENT ANALYSIS TESTING');
  console.log('=' .repeat(70));
  
  let correctPredictions = 0;
  let totalTests = testCases.length;
  
  testCases.forEach((testCase, index) => {
    console.log(`\n🧪 TEST ${index + 1}: ${testCase.name}`);
    console.log(`Rating: ${testCase.rating}/5`);
    console.log(`Text: "${testCase.text}"`);
    console.log(`Expected: ${testCase.expectedSentiment.toUpperCase()}`);
    
    const result = analyzeSentiment(testCase.text, testCase.rating);
    
    console.log(`\n🤖 ML Result: ${result.sentiment.toUpperCase()}`);
    console.log(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);
    console.log(`Analysis: +${result.positiveScore} pos, -${result.negativeScore} neg, bias: ${result.ratingBias}`);
    
    const isCorrect = result.sentiment === testCase.expectedSentiment;
    console.log(`✅ Prediction: ${isCorrect ? 'CORRECT' : 'INCORRECT'}`);
    
    if (isCorrect) correctPredictions++;
    
    console.log('-'.repeat(50));
  });
  
  const accuracy = (correctPredictions / totalTests) * 100;
  
  console.log('\n📊 FINAL RESULTS:');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Correct Predictions: ${correctPredictions}`);
  console.log(`Accuracy: ${accuracy.toFixed(1)}%`);
  
  if (accuracy >= 80) {
    console.log('🎉 EXCELLENT! ML model performs very well');
  } else if (accuracy >= 60) {
    console.log('👍 GOOD! ML model performs adequately');
  } else {
    console.log('⚠️  NEEDS IMPROVEMENT! Consider tuning parameters');
  }
  
  // Test blacklisting threshold scenarios
  console.log('\n🛡️ BLACKLISTING THRESHOLD TESTING:');
  
  const scenarios = [
    { negative: 1, total: 3, description: "33% negative (just above 30% threshold)" },
    { negative: 2, total: 7, description: "29% negative (just below 30% threshold)" },
    { negative: 3, total: 5, description: "60% negative (well above threshold)" },
    { negative: 0, total: 10, description: "0% negative (no flagging)" }
  ];
  
  scenarios.forEach(scenario => {
    const percentage = (scenario.negative / scenario.total) * 100;
    const shouldFlag = percentage > 30;
    console.log(`${scenario.description}: ${shouldFlag ? '🚨 FLAGGED' : '✅ SAFE'}`);
  });
  
  console.log('\n✅ ADVANCED TESTING COMPLETE!');
}

// Run the advanced tests
runAdvancedTests();