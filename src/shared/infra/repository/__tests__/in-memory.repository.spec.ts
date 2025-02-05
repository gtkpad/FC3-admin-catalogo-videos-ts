import { Entity } from "../../../domain/entity";
import { NotFoundError } from "../../../domain/errors/not-found.error";
import { ValueObject } from "../../../domain/value-object";
import { Uuid } from "../../../domain/value-objects/uuid.vo";
import { InMemoryRepository } from "../in-memory.repository";

type StubEntityConstructorProps = {
  entity_id?: Uuid;
  name: string;
  price: number;
};

class StubEntity extends Entity {
  entity_id: Uuid;
  name: string;
  price: number;

  constructor({ name, price, entity_id }: StubEntityConstructorProps) {
    super();
    this.entity_id = entity_id ?? new Uuid();
    this.name = name;
    this.price = price;
  }

  toJSON() {
    return {
      entity_id: this.entity_id.id,
      name: this.name,
      price: this.price,
    };
  }
}

class StubRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }
}

describe("InMemoryRepository Unit Tests", () => {
  let repository: StubRepository;

  beforeEach(() => {
    repository = new StubRepository();
  });

  it("should insert an entity", async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: "Test",
      price: 100,
    });

    await repository.insert(entity);

    expect(repository.items.length).toBe(1);
    expect(repository.items[0]).toBe(entity);
  });

  it("should bulk insert entities", async () => {
    const entities = [
      new StubEntity({
        entity_id: new Uuid(),
        name: "Test",
        price: 100,
      }),
      new StubEntity({
        entity_id: new Uuid(),
        name: "Test 2",
        price: 200,
      }),
    ];

    await repository.bulkInsert(entities);

    expect(repository.items.length).toBe(2);
    expect(repository.items[0]).toBe(entities[0]);
    expect(repository.items[1]).toBe(entities[1]);
  });
  it("should returns all entities", async () => {
    const entity = new StubEntity({ name: "name value", price: 5 });
    await repository.insert(entity);

    const entities = await repository.findAll();

    expect(entities).toStrictEqual([entity]);
  });

  it("should throws error on update when entity not found", async () => {
    const entity = new StubEntity({ name: "name value", price: 5 });
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(entity.entity_id, StubEntity)
    );
  });

  it("should updates an entity", async () => {
    const entity = new StubEntity({ name: "name value", price: 5 });
    await repository.insert(entity);

    const entityUpdated = new StubEntity({
      entity_id: entity.entity_id,
      name: "updated",
      price: 1,
    });

    await repository.update(entityUpdated);

    expect(entityUpdated.toJSON()).toStrictEqual(repository.items[0].toJSON());
  });

  it("should throws error on delete when entity not found", async () => {
    const uuid = new Uuid();
    await expect(repository.delete(uuid)).rejects.toThrow(
      new NotFoundError(uuid.id, StubEntity)
    );

    await expect(
      repository.delete(new Uuid("9366b7dc-2d71-4799-b91c-c64adb205104"))
    ).rejects.toThrow(
      new NotFoundError("9366b7dc-2d71-4799-b91c-c64adb205104", StubEntity)
    );
  });

  it("should deletes an entity", async () => {
    const entity = new StubEntity({ name: "name value", price: 5 });
    await repository.insert(entity);

    await repository.delete(entity.entity_id);
    expect(repository.items).toHaveLength(0);
  });
});
