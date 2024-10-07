import {  Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id, isActive: true },
    });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  async deleteOne(id: string) {
    const user = await this.findOne(id);

    return this.userRepository.update(user.id, { isActive: false });
  }
  async deleteMany(ids: string[]) {
    let totaslEliminated = 0;
   for (const id of ids) {
      await this.deleteOne(id);
      totaslEliminated++;
   }
    return { totaslEliminated };
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    const {password, ...userData} = updateUserDto;

    const user = await this.userRepository.preload({
      id: id,
      ...userData
    })

    if(!user) throw new NotFoundException(`User with id ${id} not found`);

    return this.userRepository.save(user);
  }
}
