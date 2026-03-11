import axios, { AxiosInstance } from "axios";
import { HttpAdapter } from "../interfaces/http-adapter.interface";


export class AxiosAdapter implements HttpAdapter {

    private axios: AxiosInstance = axios;

    async get<T>(url: string): Promise<T> {

        try {
            const { data } = await this.axios.get<T>(url);
            return data
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error: unknown) {
            throw new Error('This is an error in the GET request');
        }
    }
}