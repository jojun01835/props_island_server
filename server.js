// server.js

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
app.use(cors());
app.use("/uploads", express.static("uploads"));

const { DataTypes } = require("sequelize"); // 이 부분이 추가되었습니다.

const sequelize = models.sequelize; // 이 부분이 추가되었습니다.

const Product = models.Product; // 이 부분이 추가되었습니다.
Product.init(
  {
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    seller: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    soldout: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 0,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 159298,
    },
  },
  {
    sequelize: sequelize,
    modelName: "Product",
  }
);

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
  const { name, description, seller, price, imageUrl, password } = body;
  if (!name || !description || !seller || !price || !imageUrl || !password) {
    res.send("모든 필드를 입력해주세요");
  }
  models.Product.create({
    name,
    description,
    seller,
    price,
    imageUrl,
    password, // 비밀번호도 함께 저장합니다.
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

app.post("/products/:id/verify-password", (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  models.Product.findOne({
    where: {
      id,
    },
  })
    .then((product) => {
      if (!product) {
        return res.status(404).send("제품을 찾을 수 없습니다.");
      }

      if (password !== product.password) {
        return res.status(403).send("비밀번호가 일치하지 않습니다.");
      }

      res.sendStatus(200);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("에러발생");
    });
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
