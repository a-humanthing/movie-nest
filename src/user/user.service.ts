import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    try {
      return await this.userModel.findOne({ email }).exec();
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  async findById(id: string): Promise<UserDocument | null> {
    try {
      return await this.userModel.findById(id).exec();
    } catch (error) {
      throw new Error(`Error finding user by ID: ${error.message}`);
    }
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    try {
      const result = await this.userModel.updateOne(
        { _id: id },
        {
          $set: {
            refreshToken,
            updatedAt: new Date(),
          },
        },
      ).exec();

      if (result.matchedCount === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error updating refresh token: ${error.message}`);
    }
  }

  async updateLastLogin(id: string): Promise<void> {
    try {
      const result = await this.userModel.updateOne(
        { _id: id },
        {
          $set: {
            lastLogin: new Date(),
            updatedAt: new Date(),
          },
        },
      ).exec();

      if (result.matchedCount === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error updating last login: ${error.message}`);
    }
  }

  async createUser(userData: {
    email: string;
    name: string;
    password: string;
    isActive?: boolean;
  }): Promise<UserDocument> {
    try {
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      const user = new this.userModel({
        ...userData,
        password: hashedPassword,
      });

      return await user.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('User with this email already exists');
      }
      throw new Error(`Error creating user: ${error.message}`);
    }
  }
}