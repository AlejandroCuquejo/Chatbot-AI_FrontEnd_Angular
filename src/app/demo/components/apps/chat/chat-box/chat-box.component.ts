import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Message } from 'src/app/demo/api/message';
import { User } from 'src/app/demo/api/user';
import { ChatService } from '../service/chat.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';


@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatBoxComponent implements OnInit {

    public MessageAI!: FormGroup;
    loading: boolean = false;

    defaultUserId: number = 123;

    message!: Message;

    mostrar: boolean = true;

    isBotTyping: boolean = false; // Agregar esta variable

    textContent: string = '';

    uploadedFiles: any[] = [];

    conversation: any[] = [];


    emojis = [
        '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😇', '😉', '😊', '🙂', '🙃', '😋', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '🤪', '😜', '😝', '😛',
        '🤑', '😎', '🤓', '🧐', '🤠', '🥳', '🤗', '🤡', '😏', '😶', '😐', '😑', '😒', '🙄', '🤨', '🤔', '🤫', '🤭', '🤥', '😳', '😞', '😟', '😠', '😡', '🤬', '😔',
        '😟', '😠', '😡', '🤬', '😔', '😕', '🙁', '😬', '🥺', '😣', '😖', '😫', '😩', '🥱', '😤', '😮', '😱', '😨', '😰', '😯', '😦', '😧', '😢', '😥', '😪', '🤤'
    ];

    @Input() user!: User;

    constructor(
        public chatService: ChatService,
        private cd: ChangeDetectorRef
    ) { }

    setMessage() {
        if (this.user) {
            let filteredMessages = this.user.messages.filter(m => m.ownerId !== this.defaultUserId);
            this.message = filteredMessages[filteredMessages.length - 1];
        }
    }

    ngOnInit(): void {
        this.setMessage();
        this.initComponent();
        //this.send("Hola");
    }

    initComponent() {
        this.MessageAI = new FormGroup({
            prompt: new FormControl(""),
        })
    }

    sendMessage() {
        if (this.textContent.trim() === '') {
            console.log("NoEnviado");
            return;
        } else {
            console.log("Enviado1");
            this.send("");
            const message = {
                text: this.textContent,
                ownerId: 123,
                createdAt: new Date().getTime(),
            };

            // Agrega el mensaje actual al historial de conversación
            this.conversation.push({ text: this.textContent, owner: 'user' });

            // Luego, limpia el cuadro de entrada de texto
            this.textContent = '';

            // Envia el mensaje al servicio del chat bot
            this.chatService.sendMessage(message);
        }
    }

    onEmojiSelect(emoji: string) {
        this.textContent += emoji;
    }

    parseDate(timestamp: number) {
        return new Date(timestamp).toTimeString().split(':').slice(0, 2).join(':');
    }
    
    response: any;
    send(prompt: any) {
        this.isBotTyping = true; // Activa la animación antes de enviar el mensaje
    
        this.chatService.sendMessageAI(prompt || this.textContent).subscribe(
            (res) => {
                if (res) {
                    this.response = res;
                    this.mostrar = true;
    
                    // Agrega la respuesta del chat bot al historial de conversación
                    if (res.data && res.data.choices && res.data.choices.length > 0) {
                        const botResponse = res.data.choices[0].message.content;
                        this.conversation.push({ text: botResponse, owner: 'bot' });
                    }
    
                    // Restablece la variable isBotTyping a false
                    this.isBotTyping = false; // Desactiva la animación después de recibir la respuesta
    
                    this.cd.detectChanges(); // Forzar la detección de cambios
                }
            },
            (error) => {
                console.error(error);
            }
        );
    }
    
    
    


}