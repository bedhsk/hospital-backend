import { Injectable, NotFoundException } from '@nestjs/common';
import Role from '../entities/role.entity';
import { Repository } from 'typeorm';
import CreateRoleDto from '../dto/create-role.dto';
import UpdateRoleDto from '../dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolesService {
    
    constructor(
        @InjectRepository(Role) 
    private readonly rolesRepository: Repository<Role>
    ){}
    findAll()
    {
        return this.rolesRepository.find();
    }

    async findOne(id: number)
    {
        const record = await this.rolesRepository.findOne({where:{id},});
        if(record===null){
          throw new NotFoundException(`Role #${id} no encontrado`);
        }
        return record;
    }

    create(new_user: CreateRoleDto)
    {
      const user = this.rolesRepository.create(new_user);
      return this.rolesRepository.save(user);

    
    }

    async update(id: number,update_user: UpdateRoleDto)
    {
      const user =  await this.findOne(id);
      this.rolesRepository.merge(user, update_user);
      return this.rolesRepository.save(user);
    }

    async remove(id:number)
    {
      const user = await this.findOne(id);
      return this.rolesRepository.remove(user);

    }
    
}
