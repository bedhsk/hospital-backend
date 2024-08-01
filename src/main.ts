import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // Para que no se envien datos que no están en el DTO
      whitelist: true,
      forbidNonWhitelisted: true,
      // Para que los datos que se envien se transformen a los tipos de datos que se estan esperando
      transform: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Documentación Oficial')
    .setDescription(
      'Esta es la documentación oficial de la web API del hospital',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
