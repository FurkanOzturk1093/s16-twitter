const db = require("./data/db-config");
const server = require("./api/server");
const superTest = require("superTest");
test("[0]test environment testing olarak ayarlanmış", () => {
  expect(process.env.NODE_ENV).toBe("testing");
});
beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

describe("Server Test", () => {
  it("[1] Server çalışıyor mu", async () => {
    const res = await superTest(server).get("/");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Server Çalışıyor");
  });
});
describe("Register and Login test", () => {
  it("[2] Register Başarılı mı", async () => {
    const res = await superTest(server).post("/api/users/register").send({
      username: "furkanozturk",
      password: "159357",
      role_name: "admin",
    });
    expect(res.body.message).toBe("Hoşgeldin furkanozturk");
  }, 1000);
  it("[3] Register de username veya password eksikse hata veriyor mu", async () => {
    const res = await superTest(server)
      .post("/api/users/register")
      .send({ username: "furkanozturk11" });
    expect(res.body.message).toBe("Kullanıcı adı ve şifre girmeniz zorunlu");
  }, 1000);
  it("[4] Register de username alındıysa hata veriyor mu", async () => {
    const res = await superTest(server).post("/api/users/register").send({
      username: "furkanozturk",
      password: "159357",
      role_name: "admin",
    });
    expect(res.body.message).toBe("Bu kullanıcı kullanılıyor ");
  }, 1000);
  it("[5] Login başarılı mı", async () => {
    const res = await superTest(server).post("/api/users/login").send({
      username: "furkanozturk",
      password: "159357",
      role_name: "admin",
    });
    expect(res.body.message).toBe("Hoşgeldin furkanozturk");
    expect(res.body.token).toBeDefined();
  }, 1000);
});
describe("Post's Test", () => {
  it("[6] oluştururken token istiyor mu ", async () => {
    const res = await superTest(server)
      .post("/api/posts")
      .send({ post: "deneme123", user_id: 1 });
    expect(res.body.message).toBe("token gereklidir");
  });
  it("[7] token geçerliyse boş bir kullanıcı listesi", async () => {
    let res = await superTest(server).post("/api/users/login").send({
      username: "furkanozturk",
      password: "159357",
      role_name: "admin",
    });
    res = await superTest(server)
      .get("/api/posts")
      .set("Authorization", res.body.token);
    expect(res.body).toMatchObject([]);
  }, 750);
  it("[8] token geçerliyse  yeni bir post ekliyor mu", async () => {
    let res = await superTest(server).post("/api/users/login").send({
      username: "furkanozturk",
      password: "159357",
      role_name: "admin",
    });
    res = await superTest(server)
      .post("/api/posts")
      .set("Authorization", res.body.token)
      .send({ post: "deneme123", user_id: 1 });

    expect(res.body.message).toBe("Başarıyla eklendi");
  }, 750);
  it("[9] token geçerliyse  post edit edilebiliyor mu", async () => {
    let res = await superTest(server).post("/api/users/login").send({
      username: "furkanozturk",
      password: "159357",
      role_name: "admin",
    });
    res = await superTest(server)
      .put("/api/posts/1")
      .set("Authorization", res.body.token)
      .send({ post: "deneme1234" });

    expect(res.body.message).toBe("Post Başarıyla Güncellendi");
  }, 750);
  it("[10] token geçerliyse  post silinebiliyor mu mu", async () => {
    let res = await superTest(server).post("/api/users/login").send({
      username: "furkanozturk",
      password: "159357",
      role_name: "admin",
    });
    res = await superTest(server)
      .delete("/api/posts/1")
      .set("Authorization", res.body.token);

    expect(res.body.message).toBe("Post başarıyla silindi");
  }, 750);
});
