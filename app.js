//jshint esversion:6

const express = require("express");

const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todoListDB",
// for deploying... use Atlas

{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}); //connetted to mongoose
//new schema for items
const itemsSchema = {
  name: String
};
//a model(to add with a schema for adding) (model=== colection)
const Item = mongoose.model("Item", itemsSchema); // best practice to name a model with captial letter 1st
//example(item === Item (RIGHT way))
const item1 = new Item({
  name: "Buy Food",
});
const item2 = new Item({
  name: "Cook Food",
}); //three items
const item3 = new Item({
  name: "Eat food",
});
//put in a array
const defaultItems = [item1, item2, item3];
//insert a that array in Item collections...



//const items = ["Buy Food", "Cook Food", "Eat Food"];
//const workItems = [];

app.get("/", function (req, res) {
  Item.find({}, (err, item) => {
    if (item.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("alright ok");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: "Today",
        newListItems: item
      });
    }
  })

});

app.post("/", function (req, res) {

  const itemName = req.body.newItem;

const item = new Item({
  name:itemName
});
item.save();
res.redirect("/")

  // if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }
});
app.post("/delete", (req,res)=>{
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId,(err)=>{
    if(!err){
      console.log("Every thing fine");
      }
    res.redirect("/");
    });
});

// app.get("/work", function (req, res) {
//   res.render("list", {
//     listTitle: "Work List",
//     newListItems: workItems
//   });
// });
app.get("/:customListName", (req,res)=>{
  const customListName = req.params.customListName;
  
})

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});