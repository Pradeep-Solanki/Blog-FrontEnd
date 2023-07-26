import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import Token from "../model/token.js";

dotenv.config();

export const authenticateToken = (request, response, next) => {
  const authHeader = request.headers["authorization"];
  // console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  // console.log("token:", token);

  if (token == null) {
    return response.status(401).json({ msg: "Token is missing" });
  }

  jwt.verify(token, process.env.ACCESS_SECRET_KEY, (error, user) => {
    if (error) {
      return response.status(403).json({ msg: "Invalid token" });
    }

    request.user = user;
    next();
  });
};

export const createNewToken = async (request, response) => {
  const refreshToken = request.body.token.split(" ")[1];

  if (!refreshToken) {
    return response.status(401).json({ msg: "Refresh token is missing" });
  }

  try {
    const token = await Token.findOne({ token: refreshToken });

    if (!token) {
      return response.status(404).json({ msg: "Refresh token is not valid" });
    }

    jwt.verify(token.token, process.env.REFRESH_SECRET_KEY, (error, user) => {
      if (error) {
        return response.status(500).json({ msg: "Invalid refresh token" });
      }

      // Reuse the previous access token's expiry for the new access token
      const accessToken = jwt.sign(user, process.env.ACCESS_SECRET_KEY, {
        expiresIn:
          jwt.decode(request.body.token).exp - Math.floor(Date.now() / 1000),
      });

      return response.status(200).json({ accessToken: accessToken });
    });
  } catch (error) {
    return response
      .status(500)
      .json({ msg: "Error creating new access token" });
  }
};
