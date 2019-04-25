import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Package } from '../models/package.model';

export class Database extends Dexie {
  packages: Dexie.Table<Package, string>;

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

  public savePackage(pkg: Package) {
    this.db.packages.add(pkg);
  }

  public clearPackages() {
    this.db.packages.clear();
  }

  public get packageTable() {
    return this.db.packages;
  }
}
