import { UserType } from 'src/presentation/user/user.dto';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    user_id: string;

    @Column({ type: 'varchar', nullable: true })
    name?: string;

    @Column({ type: 'varchar', nullable: true, unique: true })
    email?: string;

    @Column({ type: 'text', nullable: true })
    password_hash?: string;

    @Column({ type: 'varchar', nullable: true })
    user_type?: UserType;

    @Column({ type: 'boolean', default: false })
    is_active: boolean = false;

    @Column({ type: 'varchar', nullable: true })
    company_id?: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}
