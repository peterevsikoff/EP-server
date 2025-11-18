import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { responseFactory } from '../api/response.factory';
import { languageRu as language } from '../locales/ru-RU';
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { VerificationTokenPayload } from '@/models/jwt.model';
import * as crypto from "crypto";

export class UserController {
    static async signUp(req: Request, res: Response) {

        const api = responseFactory(res);

        try {
            const { email, password } = req.body;

            if(!email) return api.badRequest(language.email_requared);
            if (!password) return api.badRequest(language.password_requared);
            
            const user = await UserService.getUserByEmail(email);
            if(user && !user.isVerified)
                return api.badRequest(language.user_not_verified);
            
            if(user && user.password){
                const result = await bcrypt.compare(password, user.password);
                if(result)
                    return api.ok(user);
                else
                    return api.badRequest(language.user_exist);
            }


            
            const newUser = await UserService.createUser({ email, password });
            return api.created(newUser);

        } catch(error) {
            return api.serverError(error as Error);
        }
    }

    static async signIn(req: Request, res: Response){
        const api = responseFactory(res);

        try {
            const { email, password } = req.body;

            if(!email) return api.badRequest(language.email_requared);
            if (!password) return api.badRequest(language.password_requared);
            
            const user = await UserService.getUserByEmail(email);
         
            if(user && user.password){
                const result = await bcrypt.compare(password, user.password);
                if(result) return api.ok(user);
            } else 
                return api.badRequest(language.wrong_email_password)

        } catch(error) {
            return api.serverError(error as Error);
        }
    }

    static async getAllUsers(req: Request, res: Response) {
        const api = responseFactory(res);

        try {
            const users = await UserService.getUsers();
            return api.ok(users);
        } catch (error) {
            return api.serverError(error as Error);
        }
    }

    static async emailVerified(req: Request, res: Response) {

        const api = responseFactory(res);

        try {
            const { token } = req.body;

            if(!token) return api.badRequest(language.email_requared);
            
            const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET || "email_verification");
  
            if (typeof decoded === "string") {
                throw new Error('Invalid token format');
            }
            // Проверяем назначение токена
            if (decoded.purpose !== 'email_verification') {
                throw new Error('Invalid token purpose');
            }

            const payload = decoded as JwtPayload & VerificationTokenPayload;
    
            // Проверяем обязательные поля
            if (!token || !payload.email || !payload.purpose) {
                throw new Error('Invalid token payload');
            }

            const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

            // 5. Ищем пользователя...
            // const user = await UserService.getUserByEmailToken(payload.email, hashedToken);
            const user = await UserService.getUserByEmail(payload.email);

            if (!user) {
                return res.status(400).json({ error: 'Invalid token' });
            }

            user.isVerified = true;
            user.verificationToken = null;
            // 6. Активируем пользователя
            UserService.updateUser(user);
            
            return api.ok(user);
        } catch(error) {
            return api.serverError(error as Error);
        }
    }


//   static async getUser(req: Request, res: Response) {
//     try {
//         console.log("ityuyu");

//       const user = await UserService.getUserById(req.params.id);
//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }
//       res.json(user);
//     } catch (error) {
//       res.status(500).json({ error: /*error.message*/ "" });
//     }
//   }
}