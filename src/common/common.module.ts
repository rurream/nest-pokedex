import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HttpAdapter } from './adapters/http.adapter';

@Module({
    providers: [HttpAdapter],
    exports: [HttpAdapter],
    imports: [HttpModule,]
})
export class CommonModule { }
