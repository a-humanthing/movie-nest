import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersSeedService implements OnModuleInit {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    if (this.configService.get('NODE_ENV') === 'development') {
      await this.seedUsers();
    }
  }

  private async seedUsers() {
    try {
      const existingUser = await this.userService.findByEmail('user@example.com');
      
      if (!existingUser) {
        // Create default user for development
        await this.userService.createUser({
          email: 'user@example.com',
          name: 'John Doe',
          password: 'password123', 
          isActive: true,
        });
        console.log('Development users seeded successfully');
      }
    } catch (error) {
      console.error('Error seeding users:', error.message);
    }
  }
}