import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { responseFactory } from '../api/response.factory';
import { languageRu as language } from '../locales/ru-RU';
import bcrypt from "bcrypt";

export class UserController {
    static async signUp(req: Request, res: Response) {

        const api = responseFactory(res);

        try {
            const { email, password } = req.body;

            if(!email) return api.badRequest(language.email_requared);
            if (!password) return api.badRequest(language.password_requared);
            
            const user = await UserService.getUserByEmail(email);
            
            if(user && user.password){
                const result = await bcrypt.compare(user.password, password);
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
                const result = await bcrypt.compare(user.password, password);
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