import { Inject, Injectable } from '@nestjs/common';
import * as IRepository from 'src/domain/interfaces/IRepository';

@Injectable()
export class CompanyService {

    constructor(
        @Inject('CompanyRepositoryPort')
        private readonly companyRepository: IRepository.CompanyRepositoryPort
    ) { }

    getHello(): string {
        return 'Hello World!';
    }
}
