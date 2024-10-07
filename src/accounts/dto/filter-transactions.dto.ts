import { Type } from 'class-transformer';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class FilterTransactionsDto extends PaginationDto {

    
    @Type( () => Number ) // enableImplicitConversions: true
    clientId: number;
}