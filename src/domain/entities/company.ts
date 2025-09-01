import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('company')
export class User {
    @PrimaryGeneratedColumn('uuid')
    company_id: string;

    @Column({ type: 'varchar', nullable: true })
    name?: string;

    @Column({ type: 'varchar', nullable: true, unique: true })
    email?: string;

    @Column({ type: 'boolean', nullable: true })
    is_active?: boolean;

    @Column({ type: 'boolean', nullable: true })
    is_external?: boolean;

    @Column({ type: 'varchar', nullable: true })
    location?: string;

    @Column({ type: 'varchar', nullable: true })
    business_area?: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}
