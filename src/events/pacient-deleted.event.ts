import Paciente from 'src/pacientes/entities/paciente.entity';

export class PacientDeletedEvent {
  constructor(
    public readonly pacienteId: string,
    public readonly paciente: Paciente,
  ) {}
}
