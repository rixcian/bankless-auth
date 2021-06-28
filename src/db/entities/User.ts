import {Entity, Property, PrimaryKey, Unique, wrap} from "@mikro-orm/core";

import {BaseEntity} from "./BaseEntity";


@Entity()
export class User extends BaseEntity {
  constructor(email: string, password: string, role: UserRole) {
    super();
    this.email = email;
    this.password = password;
    this.role = role;
  }

  @PrimaryKey()
  id!: number;

  @Property()
  @Unique()
  email?: string;

  @Property()
  password?: string;

  @Property()
  role!: UserRole;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}