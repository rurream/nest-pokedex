import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke.response.interface';
import { map as Map } from 'rxjs';


@Injectable()
export class SeedService {

  constructor(private readonly httpService: HttpService) { }
  // :Observable<AxiosResponse<PokeResponse>> 
  executeSeed() {

    const data = this.httpService.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10').pipe(
      Map((pokemonResponse) => {
        pokemonResponse.data?.results
          .map(({ name, url }) => {

            const no = url.split('/').at(-2);

            return { name, no };

          })
      }
      )
    );

    return data;
  }



}
