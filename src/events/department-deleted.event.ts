import Departamento from 'src/departamentos/entities/departamento.entity';

export class DepartmentDeletedEvent {
  constructor(
    public readonly departamentoId: string,
    public readonly departamento: Departamento,
  ) {}
}
