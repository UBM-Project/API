export interface IProject {
    project_id: number;
    company_id?: string;
    name?: string;
    category?: string;
    tags?: string;
    problem_description?: string;
    proposed_solution?: string;
    functional_requirements?: string;
    expected_outputs?: string;
    attachment_path?: string;
    status?: string;
    created_at: Date;
    updated_at: Date;
}
