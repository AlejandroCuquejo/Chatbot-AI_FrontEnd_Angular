
import { Message } from 'src/app/demo/api/message';
import { User } from 'src/app/demo/api/user';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, finalize } from 'rxjs'; 
import { MessageResponse } from '../../shared/model/message-response.model';
import { headers } from '../../shared/helpers/util';
import { HttpErrorHandler } from '../../shared/handlers/http.error.handler';

@Injectable()
export class ChatService {

    private handler: HttpErrorHandler = new HttpErrorHandler();
    private loading = new BehaviorSubject<boolean>(false);

    //Logo IPS Logo Chat
    _activeUser: User = {
        "id": 1,
        "name": "Chat IPS",
        "image": "IPSlogo.png",
        "status": "active",
        "messages": [
            {
                "text": "¡Hola! Soy Previbot, un asistente virtual diseñado para ayudarte con tus preguntas sobre el Instituto de Previsión Social (IPS). ¿En qué puedo ayudarte hoy?",
                "ownerId": 1,
                "createdAt": 1652646338240
            },
        
        ],
        "lastSeen": "2d"
    }

    private activeUser = new BehaviorSubject<User>(this._activeUser);

    activeUser$ = this.activeUser.asObservable();

    constructor(
        private http: HttpClient
    ) { }

    getChatData() {
        return this.http.get<any>('assets/demo/data/chat.json')
            .toPromise()
            .then(res => res.data as any[])
            .then(data => data);
    }

    changeActiveChat(user: User) {
        this._activeUser = user;
        this.activeUser.next(user);
    }

    sendMessage(message: Message) {
        this._activeUser.messages.push(message);
        this.activeUser.next(this._activeUser);
    }

    /*sendMessageAI(prompt: string): Observable<MessageResponse> {
        this.loading.next(true);
      
        // Construir la URL con los datos en la consulta
        const url = `http://localhost:8080/api/bot/chat?prompt=${prompt}`;
      
        return this.http.get<MessageResponse>(url, null, { headers })
          .pipe(finalize(() => { this.loading.next(false); }))
          .pipe(catchError(this.handler.handleError<MessageResponse>('producto:crear')));
    }*/

    sendMessageAI(prompt: string): Observable<MessageResponse> {
        this.loading.next(true);
        return this.http.get<MessageResponse>(`http://localhost:8080/api/bot/chat?prompt=${prompt}`, { headers })
        .pipe(finalize(() => { this.loading.next(false)}))
        .pipe(catchError(this.handler.handleError<MessageResponse>("chat:question")))
      }
      
      


}
