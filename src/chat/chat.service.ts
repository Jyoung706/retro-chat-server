import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatRoomDocument, ChatRoomModel } from 'src/schemas/chat-room.schema';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatRoomModel.name)
    private readonly chatRoomModel: Model<ChatRoomDocument>,
  ) {}

  async createChatRoom(creatorId: string, createChatDto: CreateChatDto) {
    const newChatRoom = new this.chatRoomModel({
      creator_id: creatorId,
      ...createChatDto,
    });
    return (await newChatRoom.save()).toObject();
  }
}
