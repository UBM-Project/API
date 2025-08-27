import { CreateUserDto, UpdateUserDto, UserLoginDto, UpdatePasswordDto } from "src/presentation/user/user.dto";

export interface UserServicePort {
    createUser(dto: CreateUserDto): Promise<any>;
    updateUser(dto: UpdatePasswordDto): Promise<any>;
    login(dto: UserLoginDto): Promise<{ token: string }>;
}
