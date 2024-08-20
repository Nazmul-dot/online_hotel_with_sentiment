const express = require("express");
const router = express.Router();
const Room = require("../models/roomModels");

const natural = require("natural");
const analyzer = new natural.SentimentAnalyzer(
  "English",
  natural.PorterStemmer,
  "afinn"
);
const stemmer = natural.PorterStemmer;


function analyzeSentiment(comment) {
  const tokenizedComment = comment.toLowerCase().split(/\s+/);
  const stems = tokenizedComment.map((word) => stemmer.stem(word));
  const sentiment = analyzer.getSentiment(stems);

  return sentiment;
}

router.post("/commentOn", async (req, res) => {
  console.log(req.body);
  const { name, commentText, Image, roomID,email,PersonalRating } = req.body;
  //   console.log(name, commentText, Image, roomID);
  if (roomID) {
    const roomData = await Room.findById({ _id: roomID });
    // console.log(roomData);
    const sentiment = analyzeSentiment(commentText);
 
    let numReview=roomData.NumberOfReview==0?1:roomData.NumberOfReview+1;
    if(sentiment>0){
        // positive
        const posi=roomData.positive.posiNum==0?1:roomData.positive.posiNum+1;
        roomData.positive.posiNum=posi;
        roomData.positive.posiRating=((posi/numReview)*5).toFixed(2)
        roomData.NumberOfReview=numReview
        
    }else{
        // negative
        const negi=roomData.nagetive.negiNum==0?1:roomData.nagetive.negiNum+1
        roomData.nagetive.negiNum=negi
        roomData.nagetive.negiRating=((negi/numReview)*5).toFixed(2)
        roomData.positive.posiRating=((roomData.positive.posiNum/numReview)*5).toFixed(2)
        roomData.NumberOfReview=numReview
    }
    
 
    console.log("Sentiment:", sentiment);

    const reviewData = {
      name: name,
      review: commentText,
      image: Image,
      email: email,
      numberOfReview:numReview,
      PersonalRating:PersonalRating

    };

    roomData.reviews.push(reviewData);
    const respons= await roomData.save()
    res.send(respons);
  }

  
});

module.exports = router;
