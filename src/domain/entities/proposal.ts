import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('proposal')
export class Proposal {
    @PrimaryGeneratedColumn()
    proposal_id: number;

    @Column({ type: 'int', nullable: true })
    project_id?: number;

    @Column({ type: 'varchar', nullable: true })
    company_id?: string;

    @Column({ type: 'varchar', nullable: true })
    user_id?: string;

    @Column({ type: 'varchar', nullable: true })
    user_email?: string;

    @Column({ type: 'int', nullable: true })
    participants?: number;

    @Column({ type: 'varchar', nullable: true })
    solving_company_id?: string;

    @Column({ type: 'varchar', nullable: true })
    submitting_company_id?: string;

    @Column({ type: 'varchar', nullable: true })
    attachment_path?: string;

    @Column({ type: 'numeric', nullable: true })
    market_value?: number;

    @Column({ type: 'numeric', default: 0 })
    proposal_value: number = 0;

    @Column({ type: 'boolean', default: false })
    is_volunteer: boolean = false;

    @Column({ type: 'varchar', default: 'submitted' })
    status: string = 'submitted';

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}
