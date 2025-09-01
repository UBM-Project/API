// src/domain/services/user.service.ts
import { Injectable, UnauthorizedException, BadRequestException, Inject } from '@nestjs/common';
import type { UserRepositoryPort } from '../domain/interfaces/IRepository';
import { CreateUserDto, UpdatePasswordDto, UserLoginDto } from 'src/presentation/controllers/user/user.dto';
import * as bcrypt from 'bcrypt';
import { SignJWT } from 'jose';

@Injectable()
export class UserService {
    constructor(
        @Inject('UserRepositoryPort')
        private readonly userRepository: UserRepositoryPort
    ) { }

    // Criação de usuário com hash de senha
    async createUser(dto: CreateUserDto): Promise<any> {
        if (!dto.password_hash || dto.password_hash.length < 6) {
            throw new BadRequestException('Senha inválida');
        }

        if (dto.email && !dto.email.includes('@')) {
            throw new BadRequestException('Email inválido');
        }

        const hashedPassword = await bcrypt.hash(dto.password_hash, 10);
        const user = await this.userRepository.create({ ...dto, password_hash: hashedPassword });
        return user;
    }

    // Atualização de usuário (opcional atualizar senha)
    async updateUser(id: string, dto: UpdatePasswordDto): Promise<any> {
        if (!dto.password_hash) {
            throw new BadRequestException('Argumentos inválidos');
        }

        if (dto.password_hash) {
            dto.password_hash = await bcrypt.hash(dto.password_hash, 10);
        }
        return await this.userRepository.update(id, dto);
    }

    // Login: valida email + senha
    async login(dto: UserLoginDto): Promise<{ token: string }> {
        const { password_hash, ...rest }: Record<string, any> = dto;
        const [user] = await this.userRepository.findLogin(rest);

        if (!user.data.password_hash) {
            throw new UnauthorizedException('Usuário ou senha incorretos');
        }

        const isPasswordValid = await bcrypt.compare(password_hash, (user as any).password_hash);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Usuário ou senha incorretos');
        }

        // Criação do JWT usando jose
        const token = await new SignJWT({ sub: user.data.user_id, email: user.data.email })
            .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
            .setExpirationTime('2h')
            .sign(new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret'));

        return { token };
    }
}
