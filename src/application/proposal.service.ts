import { Inject, Injectable } from '@nestjs/common';
import * as IRepository from 'src/domain/interfaces/IRepository';

@Injectable()
export class ProposalService {

    constructor(
        @Inject('ProposalRepositoryPort')
        private readonly companyRepository: IRepository.ProposalRepositoryPort
    ) { }

    getHello(): string {
        return 'Hello World!';
    }
}
