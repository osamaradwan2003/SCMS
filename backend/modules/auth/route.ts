import { Router } from "express";

const routes = Router();

routes.post("/login", function (req, res) {
  res.send({
    token: "test",
    user: {
      username: "osama",
      firstname: "osama",
      lastname: "radwan",
      email: "tes.com",
      image: "tes.png",
      role: {
        name: "super_admin",
        permissions: ["all"],
      },
    },
  });
});

routes.post("/me", function (req, res) {
  const token = req.headers["authorization"]?.split("Bearer ")[1];
  res.send({ token: token, valid: token == "test" });
});

export default routes;
