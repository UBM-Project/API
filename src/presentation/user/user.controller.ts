import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    Query,
    Inject,
    Put,
    ValidationPipe,
    UseGuards
} from '@nestjs/common';
import { CreateUserDto, UpdatePasswordDto, UpdateUserDto, UserLoginDto } from './user.dto';
import * as IUserRepository from 'src/domain/interfaces/user/IUser.repository';
import * as IUserService from 'src/domain/interfaces/user/IUser.service';
import { JwtAuthGuard } from '../auth/auth.guard';
@Controller('users')
export class UserController {
    constructor(
        @Inject('UserRepositoryPort')
        private readonly userRepository: IUserRepository.UserRepositoryPort,

        @Inject('UserServicePort')
        private readonly userService: IUserService.UserServicePort,
    ) { }

    @Post()
    async create(@Body(new ValidationPipe({ whitelist: true })) dto: CreateUserDto) {
        // Aqui poderia ter validações mínimas, mas CRUD vai direto pro repository
        return this.userService.createUser(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.userRepository.findById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Query() filters: Record<string, any>) {
        return this.userRepository.findAll(filters);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body(new ValidationPipe({ whitelist: true })) dto: UpdateUserDto) {
        return this.userRepository.update(id, dto);
    }
    
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async updatePassword(
        @Body(new ValidationPipe({ whitelist: true })) dto: UpdatePasswordDto,
    ) {
        return this.userService.updateUser(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async softDelete(@Param('id') id: string) {
        return this.userRepository.softDelete(id);
    }

    @Post('/login')
    async login(@Body(new ValidationPipe({ whitelist: true })) dto: UserLoginDto) {
        return this.userService.login(dto);
    }
}
