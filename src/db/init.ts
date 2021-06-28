import {MikroORM} from '@mikro-orm/core';

import dbConfig from '../mikro-orm.config';


export const connectToDb = async () => MikroORM.init(dbConfig);