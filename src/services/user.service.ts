import { supabase } from '../config/supabase';
import { CreateUserDto, UpdateUserDto } from '../models/user.model';
import { Database } from '../types/database.types';
import bcrypt from "bcrypt";

type User = Database['public']['Tables']['Users']['Row'];

class DatabaseError extends Error {
    constructor(
        message: string,
        public readonly meta?: {
            code?: string;
            status?: number;
            originalError?: unknown;
            context?: object;
        }
    ) {
        super(message);
    }
}

export class UserService {
    static async getUserByEmail(email: string): Promise<User | null> {
        try {
            const { data, error } = await supabase.from("Users").select("*").eq("email", email).maybeSingle();
            if (error) {
                console.error("Error fetching user by email:", error);
                return null;
            }
            return data;
        } catch(err){
            console.error("Unexpected error in getUserByEmail:", err);
            return null;
        } 
    }

    static async createUser(userData: CreateUserDto): Promise<User> {
        try {
            const { email, password } = userData;
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            const { data, error } = await supabase.from("Users").insert({email: email, password: hash}).select("*").single();
            console.log(data, error);

            if (error || !data) {
                throw new DatabaseError("Failed to create user", {
                    originalError: error,
                    context: { userData }
                });
            }
            return data;

            // bcrypt.genSalt(10, (err, salt) => {
            //     if (err) {
            //         throw new DatabaseError("Failed to create user", {
            //             originalError: err,
            //             context: { userData }
            //         });
            //     }
                
            //     bcrypt.hash(password, salt, async (err, hash) => {
            //         if (err) {
            //             throw new DatabaseError("Failed to create user", {
            //                 originalError: err,
            //                 context: { userData }
            //             });
            //         }

                    
            //     });

            // });    


            
        } catch(error){
            if (error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError("User creation failed", {
                originalError: error as Error
            });
        }
    }




    static async getUsers(): Promise<User[]> {
        const { data, error } = await supabase
        .from('Users')
        .select('*');
        // console.log(data, error);
        if (error) throw error;
        return data || [];
    }

    

//   static async getUserById(id: string): Promise<User | null> {
//     const { data, error } = await supabase
//       .from<User>('users')
//       .select('*')
//       .eq('id', id)
//       .single();
    
//     if (error) return null;
//     return data;
//   }


}