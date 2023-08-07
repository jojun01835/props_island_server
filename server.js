const express = require("express");
const cors = require("cors");
const app = express();
const models = require("./models");
const multer = require("multer");
const port = "8080";
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

app.use(express.json());
app.use(cors()); // 브라우저의 CORS 이슈를 막기 위해 사용하는 코드
app.use("/uploads", express.static("uploads"));

app.get("/products", (req, res) => {
  models.Product.findAll({
    order: [["createdAt", "DESC"]],
    attributes: ["id", "name", "price", "seller", "imageUrl", "createdAt", "soldout"],
  })
    .then((result) => {
      console.log("PRODUCT:", result);
      res.send({
        product: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("에러발생");
    });
});

app.post("/products", (req, res) => {
  const body = req.body;
  const { name, description, seller, price, imageUrl } = body;
  if (!name || !description || !seller || !price || !imageUrl) {
    res.send("모든 필드를 입력해주세요");
  }
  models.Product.create({
    name,
    description,
    seller,
    price,
    imageUrl,
  })
    .then((result) => {
      console.log("상품생성 결과:", result);
      res.send({ result });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("문제발생");
    });
});

app.get("/products/:id", (req, res) => {
  const params = req.params;
  const { id } = params;
  models.Product.findOne({
    where: {
      id: id,
    },
  })
    .then((result) => {
      console.log("product:", result);
      res.send({
        product: result,
      });
    })
    .catch((error) => {
      console.error();
      res.status(400).send("상품조회가 에러가 발생함");
    });
});

app.post("/purchase/:id", (req, res) => {
  const { id } = req.params;
  models.Product.update(
    {
      soldout: 1,
    },
    {
      where: {
        id,
      },
    }
  )
    .then((result) => {
      res.send({
        result: true,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("에러발생");
    });
});

app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  models.Product.destroy({
    where: {
      id,
    },
  })
    .then((rowsDeleted) => {
      if (rowsDeleted > 0) {
        res.send(`제품 ID ${id}가 삭제되었습니다.`);
      } else {
        res.send(`제품 ID ${id}를 찾을 수 없습니다.`);
      }
    })
    .catch((error) => {
      console.error("제품 삭제 중 에러 발생:", error);
      res.status(500).send("제품 삭제 중 에러가 발생했습니다.");
    });
});

const passwords = {
  // 임의의 제품 ID와 비밀번호를 매핑한 데이터
  1: "1592",
  // ... 추가적인 제품 ID와 비밀번호 매핑 데이터
};

app.post("/products/:id/verify-password", (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  // 제품 ID에 해당하는 비밀번호를 데이터베이스에서 가져옵니다.
  const correctPassword = passwords[id];

  // 입력받은 비밀번호와 저장된 비밀번호를 비교하여 검증합니다.
  if (password === correctPassword) {
    // 비밀번호가 일치하는 경우 200 상태코드와 메시지를 응답합니다.
    res.sendStatus(200);
  } else {
    // 비밀번호가 일치하지 않는 경우 403 상태코드와 메시지를 응답합니다.
    res.sendStatus(403);
  }
});

app.post("/image", upload.single("image"), (req, res) => {
  const file = req.file;
  res.send({
    imageUrl: file.path,
  });
});

app.listen(port, () => {
  models.sequelize
    .sync()
    .then(() => {
      console.log("DB 연결 성공");
    })
    .catch((err) => {
      console.error(err);
      console.error("DB연결 에러");
      process.exit();
    });
});
