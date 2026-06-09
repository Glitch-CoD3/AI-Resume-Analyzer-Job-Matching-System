import jwt from "jsonwebtoken";
import { Session } from "../models/session.models.js";
import bcrypt from "bcrypt";

const isAuthenticated = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Not logged in (no refresh token)"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const session = await Session.findOne({
            user: decoded.id,
            revoked: false
        });

        if (!session) {
            return res.status(401).json({
                success: false,
                message: "Session expired or revoked"
            });
        }

        const isMatchToken = await bcrypt.compare(refreshToken, session.refreshTokenHash);

        if (!isMatchToken) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token"
            });
        }

        req.session = session;
        req.userId = decoded.id;


        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid refresh token"
        });
    }
};

export{
    isAuthenticated
}