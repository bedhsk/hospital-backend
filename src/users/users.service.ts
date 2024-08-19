import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import User from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';
import { RolesService } from './roles/roles.service';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) 
        private readonly usersRepository: Repository<User>,
        private readonly rolesService: RolesService
        ){}
        

        findAll()
        {
            return this.usersRepository.find();
        }
        async findOne(id: number)
        {
            const record = await this.usersRepository.findOne({where:{id},});
            if(record===null){
              throw new NotFoundException(`Usuario #${id} no encontrado`);

            }
            return record;
        }

        create(new_user: CreateUserDto)
        {
          const role = this.rolesService.findOne(new_user.roleId)
         if (role!==null)
         {
            const user = this.usersRepository.create(new_user);
            return this.usersRepository.save(user);
         }
          
         return null;
        }

        async update(id: number,update_user: UpdateUserDto)
        {
          const user =  await this.findOne(id);
          this.usersRepository.merge(user, update_user);
          return this.usersRepository.save(user);
        }

        async remove(id:number)
        {
          const user = await this.findOne(id);
          return this.usersRepository.remove(user);
    
        }
}
