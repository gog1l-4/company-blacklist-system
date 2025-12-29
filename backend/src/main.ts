import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { seedDatabase } from './seed';
import { DataSource } from 'typeorm';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Enable CORS for frontend (supports both development and production)
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    });

    // Serve static files from uploads directory
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });

    // Set global API prefix
    app.setGlobalPrefix('api');

    // Run seed script
    const dataSource = app.get(DataSource);
    await seedDatabase(dataSource);

    // Start server - bind to 0.0.0.0 for Railway/Docker
    const port = process.env.PORT || 3001;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Server is running on http://localhost:${port}`);
    console.log(`📚 API available at http://localhost:${port}/api`);
    console.log(`📁 Uploads available at http://localhost:${port}/uploads/`);
}

bootstrap();
