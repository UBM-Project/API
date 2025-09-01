import { UserType } from 'src/presentation/controllers/user/user.dto';

export interface IUser {
    user_id: string;
    name?: string;
    email?: string;
    password_hash?: string;
    user_type?: UserType;
    is_active: boolean;
    company_id?: string;
    created_at: Date;
    updated_at: Date;
}

