import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto, UpdateClientDto } from './dto';
import { ErrorsService } from 'src/common/service/errors/errors.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly errorsService: ErrorsService
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
 

    try {
      const user = await this.userRepository.findOne({ where: { id: createClientDto.userId, isActive:true } });

    if (!user) {
      throw new Error(`Usuario con id ${createClientDto.userId} no encontrado`);
    }
    
      const client = this.clientRepository.create({
        ...createClientDto,
        user,
      });
      console.log(client);
      
      await this.clientRepository.save(client);
      return client;
    } catch (error) {
      this.errorsService.handleDBErrors(error, ClientsService.name);
    }
   
  }

  async findAll(): Promise<Client[]> {
    return this.clientRepository.find();
  }

  async findOne(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id, isActive:true } });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<Client> {
    
    const client = await this.clientRepository.preload({
      id,
      ...updateClientDto,
    });
    
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return this.clientRepository.save(client);
  }

  async remove(id: number): Promise<String> {
     await this.update(id,{isActive: false})

     return 'Client deleted succesfully'
  }
}
