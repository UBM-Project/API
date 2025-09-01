export interface ICompany {
    company_id: string;
    name?: string;
    email?: string;
    is_active?: boolean;
    is_external?: boolean;
    location: string;
    business_area?: string;
    created_at: Date;
    updated_at: Date;
}
