const router = require("express").Router();
const userModel = require("./users-model");
const bcrypt = require("bcryptjs");
const jsWTN = require("jsonwebtoken");
const mw = require("../posts/post-middleware");
const { JWT_SECRET } = require("../config/config");
const tokenMW = require("../../middleware/restricted");
router.post("/register", async (req, res, next) => {
  try {
    const newUser = req.body;
    const getUser = await userModel.findByFilter({
      username: newUser.username,
    });
    if (getUser) {
      res.status(400).json({
        message: "Bu kullanıcı kullanılıyor ",
      });
    }
    if (!newUser.username || !newUser.password) {
      res.status(400).json({
        message: "Kullanıcı adı ve şifre girmeniz zorunlu",
      });
    } else {
      const hash = await bcrypt.hash(newUser.password, 8);
      newUser.password = hash;
      const addUser = await userModel.createUser(newUser);
      res.status(201).json({ message: `Hoşgeldin ${newUser.username}` });
    }
  } catch (error) {
    next(error);
  }
});
router.post("/login", async (req, res, next) => {
  try {
    const loginUser = await userModel.findByFilter({
      username: req.body.username,
    });
    if (!loginUser) {
      res.status(404).json({
        message: "Geçersiz kriter",
      });
    }
    if (!req.body.username || !req.body.password) {
      res.status(404).json({
        message: "Username ve Password girmeniz gereklidir",
      });
    }
    if (
      loginUser &&
      bcrypt.compareSync(req.body.password, loginUser.password)
    ) {
      let token = jsWTN.sign(
        {
          subject: loginUser.user_id,
          username: loginUser.username,
          role_name: loginUser.role_name,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({
        message: `Hoşgeldin ${loginUser.username}`,
        token,
      });
    }
  } catch (error) {
    next(error);
  }
});
function generatetoken(user) {
  const payload = {
    subject: user.user_id, //sub
    username: user.username,
    role_name: user.role_name,
    //....
  };
  const options = {
    expiresIn: "8h",
  };
  const token = jsWTN.sign(payload, JWT_SECRET, options);
  return token;
}
router.get(
  "/",
  tokenMW.restricted,
  tokenMW.checkRole("admin"),
  async (req, res, next) => {
    try {
      const allUser = await userModel.findAllUsers();
      res.status(200).json(allUser);
      //sadece adminlerin görebileceği şekilde configure edilecek
    } catch (error) {
      next(error);
    }
  }
);
router.get("/:id", mw.checkUserPostId, async (req, res, next) => {
  try {
    const selectedUser = await userModel.findUserById(req.params.id);
    res.status(200).json(selectedUser);
  } catch (error) {
    next(error);
  }
});
router.put("/:id/sifredegistir", async (req, res, next) => {
  try {
    if (!req.body.password) {
      res.status(404).json({
        message:
          "Şifrenizi değiştirmek için geçerli bir Şifre girmeniz gereklidir",
      });
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 8);
      await userModel.updateUserById(req.params.id, {
        password: hashedPassword,
      });
    }
    res.status(201).json({ message: "Şifre Başarıyla Değiştirildi." });
  } catch (error) {
    next(error);
  }
});
router.put(
  "/:id/kullaniciadidegistir",

  async (req, res, next) => {
    try {
      if (!req.body.password || !req.body.username) {
        res.status(404).json({
          message:
            "Kullanıcı adını değiştirmek için yeni bir kullanıcı ve mevcut şifreinizi girin",
        });
      }
      const newUser = req.body;
      const getUser = await userModel.findByFilter({
        username: newUser.username,
      });
      if (getUser) {
        res.status(404).json({ message: "Bu kullanıcı daha önce alındı" });
      }
      const checkPassword = await userModel.findUserById(req.params.id);
      console.log(checkPassword);
      const statu = await bcrypt.compare(
        req.body.password,
        checkPassword.password
      );
      console.log(statu);
      if (!statu) {
        res.status(404).json({ message: "Geçersiz Kriter" });
      } else {
        await userModel.updateUserById(req.params.id, {
          username: newUser.username,
        });
        res.status(200).json({
          message: "Kullanıcı ismi başarıyla değiştirildi",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
);
router.delete("/:id", async (req, res, next) => {
  try {
    const selectedUser = await userModel.deleteUser(req.params.id);
    res.status(200).json({ message: "Kullanıcı başarıyla silindi" });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
