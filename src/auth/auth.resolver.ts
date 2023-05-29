import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/args';
import { LoginInput } from './dto/input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponse)
  public async login(@Args('input') input: LoginInput) {
    return await this.authService.login(input);
  }
}
