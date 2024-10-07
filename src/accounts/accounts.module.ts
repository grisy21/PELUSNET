import { Module } from '@nestjs/common';
import { AccountsService } from './services/accounts.service';
import { AccountsController } from './accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from 'src/clients/clients.module';
import { AuthModule } from 'src/auth/auth.module';
import { AccountsReportService } from './services/accounts-report.service';
import { Account, Transaction } from './entities';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService, AccountsReportService],
  imports: [ClientsModule,AuthModule
    ,TypeOrmModule.forFeature([Account, Transaction])],
  exports: [TypeOrmModule],
})
export class AccountsModule {}
