import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChatRoomDocument, ChatRoomModel } from 'src/schemas/chat-room.schema';
import { CreateChatDto } from './dto/create-room.dto';
import { EnterRoomDto } from './dto/enter-room.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageDocument, MessageModel } from 'src/schemas/message.schema';
import { ChatGateway } from './chat.gateway';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatRoomModel.name)
    private readonly chatRoomModel: Model<ChatRoomDocument>,
    @InjectModel(MessageModel.name)
    private readonly messageModel: Model<MessageDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async checkRoomExist(roomId: string): Promise<ChatRoomModel | null> {
    return await this.chatRoomModel.findById(roomId);
  }

  async createChatRoom(creatorId: string, createChatDto: CreateChatDto) {
    const newChatRoom = new this.chatRoomModel({
      creator_id: creatorId,
      ...createChatDto,
      participants: [{ user: creatorId, joinedAt: Date.now() }],
    });
    return (await newChatRoom.save()).toObject();
  }

  async getChatRoomList(
    page: number = 1,
    limit: number = 10,
  ): Promise<Partial<ChatRoomModel>[]> {
    const skip = (page - 1) * limit;
    const roomList = await this.chatRoomModel
      .find({})
      .select('-password -createdAt -updatedAt')
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .lean();
    return roomList;
  }

  async enterRoom(
    userId: string,
    enterRoomDto: EnterRoomDto,
  ): Promise<Partial<ChatRoomModel>> {
    const room = await this.checkRoomExist(enterRoomDto._id.toString());

    if (!room) {
      throw new BadRequestException('Not Exist Room');
    }

    if (!room.isPublic) {
      if (!enterRoomDto.password || enterRoomDto.password !== room.password) {
        throw new UnauthorizedException('Invalid password');
      }
    }

    const updateRoom = this.chatRoomModel.findByIdAndUpdate(
      enterRoomDto._id,
      {
        $push: {
          participants: {
            user: new Types.ObjectId(userId),
            joinedAt: new Date(),
          },
        },
      },
      { new: true, lean: true, select: '-password' },
    );
    return updateRoom;
  }

  async findUserRooms(userId: string): Promise<ChatRoomModel> {
    return await this.chatRoomModel
      .findOne({
        'participants.user': userId,
      })
      .lean();
  }

  async leaveRoom(userId: string, roomId: string) {
    const updatedRoom = await this.chatRoomModel.findByIdAndUpdate(
      roomId,
      {
        $pull: {
          participants: {
            user: new Types.ObjectId(userId),
          },
        },
      },
      { new: true, lean: true },
    );

    if (updatedRoom && updatedRoom.participants.length === 0) {
      await this.chatRoomModel.findByIdAndDelete(roomId);
      this.eventEmitter.emit('room_deleted', roomId);
      return null;
    }

    return updatedRoom;
  }

  async createMessage(
    createMessageDto: CreateMessageDto,
    senderId?: string | Types.ObjectId,
  ) {
    const newMessage = new this.messageModel({
      ...createMessageDto,
      sender_id: senderId,
    });

    return (await newMessage.save()).toObject();
  }

  async roomDetail(roomId: string) {
    return await this.chatRoomModel.findById(roomId).lean();
  }
}
