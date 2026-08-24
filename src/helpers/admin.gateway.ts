import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/admin',
})
export class AdminGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AdminGateway.name);
  private connectedAdmins: Map<string, Socket> = new Map();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.connectedAdmins.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('admin:register')
  handleAdminRegister(@ConnectedSocket() client: Socket) {
    this.connectedAdmins.set(client.id, client);
    this.logger.log(`Admin registered: ${client.id}`);
  }

  emitNewQuoteRequest(data: any) {
    this.server.emit('admin:new-quote-request', data);
  }

  emitNewContactMessage(data: any) {
    this.server.emit('admin:new-contact-message', data);
  }

  emitNewNewsletterSubscription(data: any) {
    this.server.emit('admin:new-newsletter-subscription', data);
  }
}
