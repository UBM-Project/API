import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('project')
export class Project {
    @PrimaryGeneratedColumn()
    project_id: number;

    @Column({ type: 'varchar', nullable: true })
    company_id?: string;

    @Column({ type: 'varchar', nullable: true })
    name?: string;

    @Column({ type: 'varchar', nullable: true, default: '1' })
    category?: string;

    @Column({ type: 'text', nullable: true })
    tags?: string;

    @Column({ type: 'text', nullable: true })
    problem_description?: string;

    @Column({ type: 'text', nullable: true })
    proposed_solution?: string;

    @Column({ type: 'text', nullable: true, default: '1' })
    functional_requirements?: string;

    @Column({ type: 'text', nullable: true, default: '1' })
    expected_outputs?: string;

    @Column({ type: 'varchar', nullable: true })
    attachment_path?: string;

    @Column({ type: 'varchar', nullable: true, default: 'pending' })
    status?: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}
