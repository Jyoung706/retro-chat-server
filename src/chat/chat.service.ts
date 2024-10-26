import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChatRoomDocument, ChatRoomModel } from 'src/schemas/chat-room.schema';
import { CreateChatDto } from './dto/create-chat.dto';
import { EnterRoomDto } from './dto/enter-room.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatRoomModel.name)
    private readonly chatRoomModel: Model<ChatRoomDocument>,
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

    if (!room.isPublic) {
      if (!enterRoomDto.password) {
        throw new UnauthorizedException(
          'Password is required for private rooms',
        );
      }
      if (enterRoomDto.password !== room.password) {
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
    // 방 참가 메세지 보내기
    return updateRoom;
  }
}
