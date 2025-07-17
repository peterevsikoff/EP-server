import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../models/user.model';
import { responseFactory } from '../api/response.factory';

export class UserController {
    static async signUp(req: Request, res: Response) {
        const api = responseFactory(res);
        try {
            const { email, password } = req.body;
            
            if (!email || !password) return api.badRequest("Email and password are required");
            
            const user = await UserService.getUserByEmail(email);
            console.log(user);
            if(user){
                return api.conflict("User with this email already exists");
            }
            // 3. Создание пользователя
            const newUser = await UserService.createUser({ email, password });
            
            // 4. Успешный ответ
            return api.created(newUser);

        } catch(error) {
            return api.serverError(error as Error);
        }
    }





    static async getAllUsers(req: Request, res: Response) {
    
    try {
      const users = await UserService.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: /*error.message*/ "" });
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

//   static async createUser(req: Request, res: Response) {
//     try {
//       const userData: CreateUserDto = req.body;
      
//       // Валидация может быть здесь или в middleware
//       if (!userData.email || !userData.password) {
//         return res.status(400).json({ error: 'Email and password are required' });
//       }

//       const newUser = await UserService.createUser(userData);
      
//       // Не возвращаем пароль в ответе
//     //   const { password, ...userWithoutPassword } = newUser;
      
//       res.status(201).json(/*userWithoutPassword*/newUser);
//     } catch (error) {
//       console.error('Error creating user:', error);
//       res.status(500).json({ 
//         error: 'Failed to create user',
//         details: /*error.message*/ ""
//       });
//     }
//   }
}