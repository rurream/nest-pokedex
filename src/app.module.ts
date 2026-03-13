import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';
import dns from "node:dns/promises";

dns.setServers(["1.1.1.1"]);


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), renderPath: '/',
    }),

    MongooseModule.forRoot(process.env.MONGODB!, {
      dbName: 'pokemonsdb'
    }),

    PokemonModule,

    CommonModule,

    SeedModule
  ],
  controllers: [],
  providers: [],

})
export class AppModule { }
