import bcrypt from "bcrypt";
import {Entity, Property, PrimaryKey, Unique} from "@mikro-orm/core";

import {BaseEntity} from "./BaseEntity";


@Entity()
export class User extends BaseEntity {

  @PrimaryKey()
  id!: number;

  @Property()
  @Unique()
  username?: string;

  @Property()
  @Unique()
  email?: string;

  @Property()
  password?: string;

  @Property()
  role!: UserRole;

  @Property()
  @Unique()
  web3Address?: string;

  constructor(username: string, email: string, password: string, role: UserRole, web3Address: string) {
    super();
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
    this.web3Address = web3Address;
  }

  public toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      web3Address: this.web3Address
    }
  }

  public comparePasswords(passwordToCompare: string): Promise<boolean> {
      return bcrypt.compare(passwordToCompare, this.password)
        .then(isMatch => isMatch)
        .catch(() => false)
  }

}



export interface UserPassport {
  id: number,
  username: string,
  email: string,
  web3Address: string
}



export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}