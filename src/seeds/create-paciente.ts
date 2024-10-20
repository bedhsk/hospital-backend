import { DataSource } from 'typeorm';

export class CreatePacienteSeed {
  async run(dataSource: DataSource): Promise<void> {
    const pacienteRepository = dataSource.getRepository('Paciente');

    const paciente = [
      {
        nombre: 'Juan Pérez',
        sexo: 'Masculino',
        cui: '123456789012',
        nacimiento: '1980-01-01',
        familiares: 'Padre, Madre',
        medicos: 'Dr. Smith',
        quirurgicos: 'Apendicectomía',
        traumaticos: 'Fractura de pierna',
        alergias: 'Penicilina',
        vicios: 'Tabaco',
      },
      {
        nombre: 'Maria Lopez',
        sexo: 'Femenino',
        cui: '123456789013',
        nacimiento: '1980-01-01',
        familiares: 'Padre, Madre',
        medicos: 'Dr. Smith',
        quirurgicos: 'Apendicectomía',
        traumaticos: 'Fractura de pierna',
        alergias: 'Penicilina',
        vicios: 'Tabaco',
        antecedente: {
          gestas: 2,
          hijos_vivos: 1,
          hijos_muertos: 0,
          abortos: 2,
          ultima_regla: '2024-06-01',
          planificacion_familiar: 1,
          partos: 2,
          cesareas: 1,
        },
      },
    ];

    await pacienteRepository.save(paciente);
  }
}
