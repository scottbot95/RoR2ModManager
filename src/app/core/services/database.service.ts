import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import {
  Package,
  SerializablePackageList,
  SerializablePackage
} from '../models/package.model';

export class Database extends Dexie {
  packages: Dexie.Table<SerializablePackage, string>;

  constructor() {
    super('Database');
    this.version(1).stores({
      packages: '&uuid4,name,owner'
    });
    this.packages.mapToClass(Package);
  }
}

@Injectable()
export class DatabaseService {
  private db: Database = new Database();

  constructor() {}

  public savePackage(pkg: SerializablePackage) {
    this.db.packages.add(pkg);
  }

  public savePackages(packages: SerializablePackageList) {
    this.db.packages.bulkAdd(packages);
  }

  public clearPackages() {
    this.db.packages.clear();
  }

  public get packageTable() {
    return this.db.packages;
  }
}
