const express = require("express");
const mongoose = require("mongoose");
const Memo = require("./models/Memo");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/memo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/api/", (req, res) => {
  const searchTerm = req.query.search || "";
  const searchRegex = new RegExp(searchTerm, "i"); // 'i' makes it case-insensitive

  Memo.find({ text: { $regex: searchRegex } })
    .then((memos) => res.json(memos))
    .catch((err) => res.status(500).json(err));
});

app.post("/api/", (req, res) => {
  Memo.create(req.body)
    .then(() => res.json({ message: "success" }))
    .catch((err) => res.status(500).json(err));
});

app.delete("/api/:id", (req, res) => {
  const memoId = req.params.id;
  Memo.deleteOne({ _id: memoId })
    .then(() => res.json({ message: "success" }))
    .catch((err) => res.status(500).json(err));
});

app.put("/api/", (req, res) => {
  Memo.updateOne({ _id: req.body.id }, { text: req.body.text })
    .then(() => res.json({ message: "success" }))
    .catch((err) => res.status(500).json(err));
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
