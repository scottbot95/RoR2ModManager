import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import {
  Package,
  SerializedPackage,
  serializePackage,
  serializePackageList,
  PackageList
} from '../models/package.model';
import { PackageProfile } from '../models/profile.model';

export class Database extends Dexie {
  packages: Dexie.Table<SerializedPackage, string>;

  profiles: Dexie.Table<PackageProfile, string>;

  constructor() {
    super('Database');
    this.version(2).stores({
      packages: '&uuid4,name,owner',
      profiles: '&name'
    });
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

  public savePackage(pkg: Package, overwrite = false): Promise<string> {
    const serialized = serializePackage(pkg);
    if (overwrite) {
      return this.db.packages.put(serialized);
    } else {
      return this.db.packages.add(serialized);
    }
  }

  public savePackages(
    packages: PackageList,
    overwrite = false
  ): Promise<string> {
    const serialized = serializePackageList(packages);
    if (overwrite) {
      return this.db.packages.bulkPut(serialized);
    } else {
      return this.db.packages.bulkAdd(serialized);
    }
  }

  public clearPackages(): Promise<void> {
    return this.db.packages.clear();
  }

  public updatePackage(
    uuid4: string,
    changes: Partial<SerializedPackage>
  ): Promise<number> {
    return this.db.packages.update(uuid4, changes);
  }

  public async bulkUpdatePackages(packages: PackageList): Promise<number> {
    const serialized = serializePackageList(packages);
    const updates = await Promise.all(
      serialized.map(async pkg => {
        if ((await this.db.packages.update(pkg.uuid4, pkg)) === 0) {
          await this.db.packages.add(pkg);
        }
        return 1;
      })
    );
    return updates.reduce((acc, val) => acc + val, 0);
  }

  public get packageTable() {
    return this.db.packages;
  }

  public saveProfile(profile: PackageProfile): Promise<string> {
    return this.db.profiles.add(profile);
  }

  public updateProfile(profile: PackageProfile): Promise<string> {
    return this.db.profiles.put(profile);
  }

  public getProfiles(): Promise<PackageProfile[]> {
    return this.db.profiles.toArray();
  }

  public deleteProfile(profile: string): Promise<void> {
    return this.db.profiles.delete(profile);
  }

  public get profileTable() {
    return this.db.profiles;
  }
}
