import { Injectable, signal, WritableSignal } from "@angular/core";
import { LsxMessage, Request, Response } from "@phobos-lsx/protocol";

import { v4 as uuidv4 } from 'uuid';
import { Subject } from "rxjs";
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

const LSX_SERVER_HOSTNAME = window?.__env?.LSX_SERVER_HOSTNAME || window.location.hostname;
const LSX_SERVER_PORT = window?.__env?.LSX_SERVER_PORT || 3002;

const WS_PROTOCOL = window.location.protocol === 'https:' ? 'wss' : 'ws';
const WS_URL = `${WS_PROTOCOL}://${LSX_SERVER_HOSTNAME}:${LSX_SERVER_PORT}`;

@Injectable(
  { providedIn: 'root' }
)
export class LsxGateway {
  public onRequest: Subject<{ id: string, request: Request }> = new Subject<{ id: string, request: Request }>();
  public onMessage: Subject<LsxMessage> = new Subject<LsxMessage>();
  public onOpen: Subject<void> = new Subject<void>();
  public onClose: Subject<void> = new Subject<void>();

  public isConnected: WritableSignal<boolean> = signal(false);

  private requests: Map<string, (value: Response) => void> = new Map<string, (value: Response) => void>();
  private ws!: WebSocketSubject<any>;

  constructor() { }

  public connect(jwt: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log(`Connecting to LSX WebSocket at ${WS_URL}`);
      this.ws = webSocket({
        url: `${WS_URL}/api?token=${jwt}`,
        openObserver: {
          next: () => {
            console.log("WebSocket connection established");
            this.isConnected.set(true);
            this.onOpen.next();
            resolve();
          }
        }
      });

      this.ws.subscribe({
        next: this.handleMessage.bind(this),
        error: (err) => {
          this.handleClose();
          reject(err);
        },
        complete: this.handleClose.bind(this)
      });
    });
  }

  public request(req: Request): Promise<Response> {
    return new Promise((resolve, reject) => {
      const msg: LsxMessage = {
        id: uuidv4(),
        request: req
      }
      this.requests.set(msg.id, resolve.bind(this));
      setTimeout(this.rejectOnTimeout.bind(this, msg.id, reject.bind(this, `${req} timed out`)), 5000);
      this.ws.next({ event: 'msg', data: JSON.stringify(LsxMessage.toJSON(msg)) });
    });

  }

  public respond(id: string, res: Response) {
    const msg: LsxMessage = {
      id: id,
      response: res
    }
    this.ws.next({ event: 'msg', data: JSON.stringify(LsxMessage.toJSON(msg)) });
  }

  private handleMessage(buffer: { event: 'msg', data: string }) {
    const msg = LsxMessage.fromJSON(JSON.parse(buffer.data));
    if (msg.request) {
      this.onRequest.next({ id: msg.id, request: msg.request });
    }

    if (msg.response) {
      if (this.requests.has(msg.id)) {
        this.requests.get(msg.id)!(msg.response);
        this.requests.delete(msg.id);
      }
    }

    this.onMessage.next(msg);
  }

  private handleClose() {
    this.isConnected.set(false);
    this.onClose.next();
  }

  private rejectOnTimeout(id: string, reject: (reason?: any) => void) {
    if (this.requests.delete(id)) {
      reject();
    };
  }
}
