import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(

    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly configService: ConfigService

  ) {
    this.defaultLimit = configService.get<number>('defaultLimit') ?? 20;
  }

  private handleExceptions(error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && 'keyValue' in error) {
      if (error.code === 11000) {
        throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`);
      }
    } else {
      throw new InternalServerErrorException(`Can't create pokemon - Check server logs`);
    }
  }

  async create(createPokemonDto: CreatePokemonDto) {

    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase().trim();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);

      return pokemon;
    } catch (error: unknown) {

      this.handleExceptions(error);
    }

  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;

    return await this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({
        no: 1
      })
      .select('-__v');
  }

  async findOne(term: string) {

    let pokemon: Pokemon | null = null;

    //por no
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: Number(term) });
    }

    // por MongoID
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    // name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim() });
    }

    if (!pokemon) throw new NotFoundException(`Pokemon with id, name or no "${term}" not found`)

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    let pokemon: Pokemon | null = await this.findOne(term);

    if (updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase().trim();

    try {

      // await pokemon.updateOne(updatePokemonDto, { new: true });

      pokemon = await this.pokemonModel.findByIdAndUpdate({ _id: pokemon._id }, updatePokemonDto, { new: true });

      return pokemon;

    } catch (error: unknown) {
      this.handleExceptions(error);
    }


  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);

    // await this.pokemonModel.deleteOne({ _id: pokemon._id });
    // // await pokemon.deleteOne();

    const result = await this.pokemonModel.findByIdAndDelete(id);
    if (!result) throw new BadRequestException(`Pokemon with id "${id}" not found`);

  }
}
