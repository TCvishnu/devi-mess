import { UserRole } from "@prisma/client";

export type JwtPayload = {
  id: string;
  role: UserRole;
};
