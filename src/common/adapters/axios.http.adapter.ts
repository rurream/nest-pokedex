import { HttpService } from "@nestjs/axios";
import { HttpAdapter } from "../interfaces/http-adapter.interface";
import { lastValueFrom } from "rxjs";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AxiosHttpAdapter implements HttpAdapter {

    constructor(
        private httpService: HttpService
    ) { }

    async get<T>(url: string): Promise<T> {

        try {
            const { data } = await lastValueFrom(this.httpService.get<T>(url).pipe());
            return data
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error: unknown) {
            throw new Error('This is an error in the GET request');
        }
    }

}