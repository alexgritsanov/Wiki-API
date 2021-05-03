//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app  = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
  title: String,
  content: String
} ;

const Article = mongoose.model("Article", articleSchema);

/////// Requests Targetting all Articles ///////////

app.route("/articles").get(function(req,res){
  Article.find(function(err, foundArticles){
    console.log("Hey");
    console.log(foundArticles);
res.send(foundArticles);
});
})

.post(function(req,res) {
  console.log(req.body.title);
  console.log(req.body.content);

  const newArticle = new Article ({
    title : req.body.title,
    content: req.body.content
  })
  newArticle.save(function(err) {
    if (!err){
      res.send("Successfully added new article.")
    } else {
      res.send(err);
    }
  });
})

.delete(function(req,res){
   Article.deleteMany(function(err){
     if (!err) {
       res.send("Succesfully deleted all aritcles" )}
       else {
         res.send (err);
       }
   })
});


////// requests targetting a specific article


app.route("/articles/:articleTitle")

.get(function(req,res){
  Article.findOne({title:req.params.articleTitle}, function(err, foundArticles){
    if (foundArticles) {
      res.send(foundArticles);
    } else {
      res.send("No articles matching that title  was found")
    }

});
})

.put(function(req,res){
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
  function(err){
    if (!err){
      res.send("Succesfully updated article.");
    }
  }
);
})

.patch(function(req,res) {
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if (!err){
        res.send("Succesfully updated article")
      } else {
        res.send(err);
      }

    }
  )

})

.delete(function(req,res){
  Article.deleteOne({title:req.params.articleTitle}, function(err){
    if (!err) {
      res.send("Article deleted Succesfully!");
    }
  })
});

app.listen(3000, function () {
  console.log("Server started on port 3000")
});
