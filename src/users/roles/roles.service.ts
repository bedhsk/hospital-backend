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

    async findOne(id: string)
    {
        const record = await this.rolesRepository.findOne({where:{id},});
        if(record===null){
          throw new NotFoundException(`Role #${id} no encontrado`);
        }
        return record;
    }

    create(new_role: CreateRoleDto)
    {
      const role = this.rolesRepository.create(new_role);
      return this.rolesRepository.save(role);

    
    }

    async update(id: string, update_role: UpdateRoleDto)
    {
      const role =  await this.findOne(id);
      this.rolesRepository.merge(role, update_role);
      return this.rolesRepository.save(role);
    }

    async remove(id: string)
    {
      const role = await this.findOne(id);
      return this.rolesRepository.remove(role);

    }
    
}
