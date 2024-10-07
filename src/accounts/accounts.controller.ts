import { Controller, Post, Body, Param, Get, ParseIntPipe, Query } from '@nestjs/common';
import { AccountsService } from './services/accounts.service';
import { AccountsReportService } from './services/accounts-report.service';
import { CreateAccountDto, CreateTransactionDto, FilterTransactionsDto} from './dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/users/entities/user.entity';
import { Account } from './entities';

@Auth()
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountService: AccountsService,private readonly accountsReportService: AccountsReportService) {}

  @Post('create')
  async createAccount(@GetUser() user:User,@Body() createAccountDto: CreateAccountDto) {
    const { clientId, accountType } = createAccountDto;
    return this.accountService.createAccount(clientId, user.id, accountType);
  }

  @Post('transactions')
  async deposit( @Body() transactionDTO: CreateTransactionDto) {
    return this.accountService.doTransaction(transactionDTO);
  }
   
   @Get('client/:clientId')
   async findByClientId(@Param('clientId', ParseIntPipe) clientId: number): Promise<Account[]> {
     return this.accountService.findByClientId(clientId);
   }
  
   //reports
   @Get('client/:accountNumber/transactions')
   async getClientTransfers(
     @Param('accountNumber') accountNumber: string,
     @Query() filterDto: FilterTransactionsDto,
   ) {
     return this.accountsReportService.getTransactionsByClient(accountNumber,filterDto);
   }
}
