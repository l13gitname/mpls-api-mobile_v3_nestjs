import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true
  });

  const configservice = app.get<ConfigService>(ConfigService)

  app.enableCors({
    origin: 'http://localhost:4200',
  });
  
  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
    .setTitle('ENQUIRY API')
    .setDescription('credit approval api (oracle form E01)')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', //  === This name here is important for matching up with @ApiBearerAuth() in your controller! ===
    )
    // === set index of each ApiTags (show first in index 0) ===
    .addTag('User') // === set is first index in tag for easy to login (18/11/2022) === 
    .addTag('Quotation')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api-docs', app, document)
  await app.listen(configservice.get('API_PORT'));
}
bootstrap();
