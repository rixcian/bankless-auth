import { Migration } from '@mikro-orm/migrations';

export class Migration20210628122515 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "username" varchar(255) null, add column "web3address" varchar(255) null;');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
    this.addSql('alter table "user" add constraint "user_web3address_unique" unique ("web3address");');
  }

}
