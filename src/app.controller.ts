import { Controller, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable, Subject, interval, lastValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';

interface MessageEvent {
  data: string | object;
}
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private httpService: HttpService,
  ) {}

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return interval(1000).pipe(
      map((num: number) => {
        return {
          data: 'hello' + num,
        };
      }),
    );
  }
  @Sse('asyncsse')
  async customSSE(): Promise<Observable<MessageEvent>> {
    return await this.getData();
  }
  stocks: Subject<any> = new Subject();
  async getData() {
    setInterval(async () => {
      const posts = await lastValueFrom(
        this.httpService.get('https://jsonplaceholder.typicode.com/posts'),
      );
      this.stocks.next({ data: { message: posts.data } });
    }, 5000);
    return this.stocks.asObservable();
  }
}
