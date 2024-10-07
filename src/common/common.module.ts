import { Global, Module } from '@nestjs/common';
import { ErrorsService } from './service/errors/errors.service';

@Global()
@Module({
  providers: [ErrorsService],
  exports:[ErrorsService]
})
export class CommonModule {}
