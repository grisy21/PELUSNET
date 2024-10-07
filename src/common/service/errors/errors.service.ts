import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

@Injectable()
export class ErrorsService {

    
    handleDBErrors( error: any,origin:string ): never {
        const logger = new Logger(origin);
        if ( error.code === '23505' ) 
          throw new BadRequestException( error.detail );
    
        logger.error(error)
    
        throw new InternalServerErrorException('Please check server logs');
    
      }
}
