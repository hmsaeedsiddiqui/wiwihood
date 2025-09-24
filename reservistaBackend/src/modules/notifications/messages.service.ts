import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../../entities/message.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findUserMessages(userId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: [
        { senderId: userId },
        { receiverId: userId }
      ],
      relations: ['sender', 'receiver'],
      order: { createdAt: 'DESC' }
    });
  }

  async getConversations(userId: string): Promise<any[]> {
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .where('message.senderId = :userId OR message.receiverId = :userId', { userId })
      .orderBy('message.createdAt', 'DESC')
      .getMany();

    // Group messages by conversation partner
    const conversations = new Map();
    
    messages.forEach(message => {
      const partnerId = message.senderId === userId ? message.receiverId : message.senderId;
      const partner = message.senderId === userId ? message.receiver : message.sender;
      
      if (!conversations.has(partnerId)) {
        conversations.set(partnerId, {
          partner,
          messages: [],
          lastMessage: message,
          unreadCount: 0
        });
      }
      
      const conversation = conversations.get(partnerId);
      conversation.messages.push(message);
      
      if (!message.isRead && message.receiverId === userId) {
        conversation.unreadCount++;
      }
    });

    return Array.from(conversations.values());
  }

  async getConversationMessages(userId: string, partnerId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: [
        { senderId: userId, receiverId: partnerId },
        { senderId: partnerId, receiverId: userId }
      ],
      relations: ['sender', 'receiver'],
      order: { createdAt: 'ASC' }
    });
  }

  async sendMessage(data: {
    senderId: string;
    receiverId: string;
    message: string;
    type?: string;
    attachments?: any;
  }): Promise<Message> {
    const message = this.messageRepository.create({
      senderId: data.senderId,
      receiverId: data.receiverId,
      message: data.message,
      type: data.type || 'text',
      attachments: data.attachments,
      conversationId: this.generateConversationId(data.senderId, data.receiverId)
    });

    return this.messageRepository.save(message);
  }

  async markAsRead(messageId: string, userId: string): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId, receiverId: userId }
    });

    if (message) {
      message.isRead = true;
      message.readAt = new Date();
      return this.messageRepository.save(message);
    }

    throw new Error('Message not found or access denied');
  }

  async markConversationAsRead(userId: string, partnerId: string): Promise<void> {
    await this.messageRepository.update(
      { senderId: partnerId, receiverId: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
  }

  private generateConversationId(userId1: string, userId2: string): string {
    return [userId1, userId2].sort().join('-');
  }

  async getUnreadMessagesCount(userId: string): Promise<number> {
    return this.messageRepository.count({
      where: { receiverId: userId, isRead: false }
    });
  }
}