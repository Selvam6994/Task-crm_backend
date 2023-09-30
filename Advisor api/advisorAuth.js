import jwt from "jsonwebtoken";

export const advisorAuth = (request, response, next) => {
  try {
    const token = request.header("x-auth-advisorToken");
    jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch {
    response.status(401).send({ message: "not allowed" });
  }
};