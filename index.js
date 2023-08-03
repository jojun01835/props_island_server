const cors = require("cors");
const express = require("express");
const app = express();
const port = "8080";

app.use(express.json());
app.use(cors()); // 브라우저의 cors 이슈를 막기 위해 사용하는 코드
app.get("/products", (req, res) => {
  const query = req.query;
  console.log("queryString :", query);
  res.send({
    products: [
      {
        name: "독버섯 조명",
        price: 89000,
        seller: "유니스의 정원",
        imageUrl: "img/products/products01.jpg",
        id: 0,
      },
      {
        name: "허리박살의자",
        price: 819000,
        seller: "유니스의 정원",
        imageUrl: "img/products/products02.jpg",
        id: 1,
      },
      {
        name: "구불구불거울",
        price: 1809000,
        seller: "더휴먼",
        imageUrl: "img/products/products03.jpg",
        id: 2,
      },
    ],
  });
});

app.post("/products", (req, res) => {
  const body = req.body;
  res.send({
    body,
  });
});

app.get("/products/:id", (req, res) => {
  const params = req.params;
  const { id } = params;
  res.send(`id는  ${id} 입니둥`);
});

app.listen(port, () => {
  console.log("server on");
});
