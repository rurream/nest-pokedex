import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke.response.interface';
import { HttpAdapter } from 'src/common/adapters/http.adapter';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class SeedService {

  private environment: string;

  constructor(

    private readonly httpAdapter: HttpAdapter,

    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly configService: ConfigService
  ) {
    this.environment = configService.get<string>('environment') ?? '';
  }

  async executeSeed() {

    if (this.environment.toLocaleLowerCase() !== 'dev') throw new BadRequestException('No es posible aplicar el seed en producción')

    await this.pokemonModel.deleteMany({});

    const data = await this.httpAdapter.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const pokemonsToInsert = data.results.map(pokemon => {
      const no = Number(pokemon.url.split('/').at(-2));
      const name = pokemon.name;
      return { name, no };
    })

    await this.pokemonModel.insertMany(pokemonsToInsert);

    return 'Seed excecuted';
  }



}
