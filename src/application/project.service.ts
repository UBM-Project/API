import { Inject, Injectable } from '@nestjs/common';
import * as IRepository from 'src/domain/interfaces/IRepository';

@Injectable()
export class ProjectService {

    constructor(
        @Inject('ProjectRepositoryPort')
        private readonly companyRepository: IRepository.ProjectRepositoryPort
    ) { }

    getHello(): string {
        return 'Hello World!';
    }
}
