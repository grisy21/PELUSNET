import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterTransactionsDto } from '../dto/filter-transactions.dto';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class AccountsReportService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}
  async getTransactionsByClient(accountNumber:string,filterDto: FilterTransactionsDto) {
    const { page=1, limit=10 } = filterDto;
    
    const [transactions,count] = await this.transactionRepository.findAndCount({
        where: [
          { fromAccount: { accountNumber } },
         
        ],
        skip: (page - 1) * limit,
        take: limit,
        order: { date: 'DESC' },
      });
      const totalPages = Math.ceil(count / limit);
      const previousPage = page > 0 ? page - 1 : null;
      const nextPage = page < totalPages - 1 ? page + 1 : null;
  
      return {
        currentPage: page,
        totalPages,
        previousPage,
        nextPage,
        totalCount: count,
        transactions,
      };
  }
}
