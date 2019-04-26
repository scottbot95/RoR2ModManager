import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import {
  Package,
  SerializedPackage,
  serializePackage,
  serializePackageList,
  PackageList
} from '../models/package.model';

export class Database extends Dexie {
  packages: Dexie.Table<SerializedPackage, string>;

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

  public savePackage(pkg: Package, overwrite = false) {
    const serialized = serializePackage(pkg);
    if (overwrite) {
      this.db.packages.put(serialized);
    } else {
      this.db.packages.add(serialized);
    }
  }

  public savePackages(packages: PackageList, overwrite = false) {
    const serialized = serializePackageList(packages);
    if (overwrite) {
      this.db.packages.bulkPut(serialized);
    } else {
      this.db.packages.bulkAdd(serialized);
    }
  }

  public clearPackages() {
    this.db.packages.clear();
  }

  public get packageTable() {
    return this.db.packages;
  }
}
