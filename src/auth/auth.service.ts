import { BadRequestException, Injectable } from "@nestjs/common";
import { TeamService } from "src/team/team.service";
import { LoginInput } from "./dto/input";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private userService: TeamService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOneByUsername(username);

    if (user && user.password === password) {
      const { password, ...rest } = user;
      return rest;
    }

    return null;
  }

  public async login(input: LoginInput) {
    const user = await this.validateUser(input.username, input.password);
    if (!user) throw new BadRequestException("Username or password wrong!");
    return {
      access_token: this.jwtService.sign({
        username: user.username,
        sub: user.idTeamMember,
      }),
      user,
    };
  }
}
