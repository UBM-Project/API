import { CreateUserDto, UpdateUserDto, UserResponseDto } from "src/presentation/user/user.dto";

export interface UserRepositoryPort {
    create(dto: CreateUserDto): Promise<UserResponseDto>;
    findById(id: string): Promise<UserResponseDto>;
    findAll(filters: Record<string, any>): Promise<UserResponseDto[]>;
    findLogin(filters: Record<string, any>): Promise<UserResponseDto[]>
    update(id: string, dto: UpdateUserDto): Promise<UserResponseDto>;
    softDelete(id: string): Promise<any>;
}
