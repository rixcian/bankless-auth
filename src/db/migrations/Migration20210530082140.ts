import { Migration } from '@mikro-orm/migrations';

export class Migration20210530082140 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "email" varchar(255) null, "password" varchar(255) null, "role" text check ("role" in (\'admin\', \'user\')) not null);');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
  }

}
