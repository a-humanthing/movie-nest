import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { User, UserSchema } from "./schema/user.schema";
import { UsersSeedService } from "./seeduser.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule,
  ],
  providers: [UserService,UsersSeedService],
  exports: [UserService],
})
export class UserModule {}
