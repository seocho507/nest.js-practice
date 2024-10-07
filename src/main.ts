import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
    }));

    const config = new DocumentBuilder()
        .setTitle("Movie API")
        .setVersion("1.0")
        .addBearerAuth()
        .addBasicAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("doc", app, document);

    await app.listen(3000);
}

bootstrap();