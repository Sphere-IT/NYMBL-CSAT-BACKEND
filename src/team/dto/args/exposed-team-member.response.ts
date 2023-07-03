import { ObjectType, PickType } from "@nestjs/graphql";
import { TeamEntity } from "src/team/entities";

@ObjectType()
export class ExposedTeamMember extends PickType(TeamEntity, [
  "userType",
  "username",
  "idTeamMember",
  "email",
  "contact",
  "createdAt",
  "createdBy",
  "isActive",
]) {}
