import type { Request, Response } from "express"
import { userModel } from "../models/user.model.js"
import jwt from "jsonwebtoken"
import { env } from "../config/env.js"
import * as emailService from "../services/email.service.js"

export const userRegister = async (req: Request, res: Response) => {
    try {
        const { name, email, password, SystemUser } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }
        const newUser = await userModel.create({
            name,
            email,
            password,
            SystemUser: SystemUser || false
        })
        const token = jwt.sign({
            id: newUser._id
        }, env.JWT_SECRET as string, { expiresIn: "1d" })
        res.cookie("token", token)
        await emailService.sendRegisterEmail(newUser.email, newUser.name)
        return res.status(201).json(
            {
                message: "User created successfully",
                user: newUser
            }
        )
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }


}

export const userLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const existingUser = await userModel.findOne({ email })
        if (!existingUser) {
            return res.status(400).json({ message: "User not found" })
        }
        const isvalidPassword = await existingUser.comparePassword(password)
        if (!isvalidPassword) {
            return res.status(400).json({ message: "Invalid password" })
        }
        const token = jwt.sign({
            id: existingUser._id
        }, env.JWT_SECRET as string, { expiresIn: "1d" })
        res.cookie("token", token)
        return res.status(200).json(
            {
                message: "User logged in successfully",
                user: existingUser
            }
        )

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
