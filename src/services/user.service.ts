import { supabase } from '../config/supabase';
import { CreateUserDto, UpdateUserDto } from '../models/user.model';
import { Database } from '../types/database.types';

type User = Database['public']['Tables']['Users']['Row'];

export class UserService {
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

//   static async createUser(userData: CreateUserDto): Promise<User> {
//     const { data, error } = await supabase
//       .from<User>('users')
//       .insert(userData)
//       .single();
    
//     if (error) throw error;
//     return data!;
//   }
}