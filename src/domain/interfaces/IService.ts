import { CreateUserDto, UpdateUserDto, UserLoginDto, UpdatePasswordDto } from "src/presentation/controllers/user/user.dto";

export interface UserServicePort {
    createUser(dto: CreateUserDto): Promise<any>;
    updateUser(dto: UpdatePasswordDto): Promise<any>;
    login(dto: UserLoginDto): Promise<{ token: string }>;
}


export interface CompanyServicePort {
    getHello(): string;
}

export interface ProjectServicePort {
    getHello(): string;
}

export interface ProposalServicePort {
    getHello(): string;
}
