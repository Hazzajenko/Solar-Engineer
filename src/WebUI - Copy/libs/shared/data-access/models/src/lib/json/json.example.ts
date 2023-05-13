/*
class User {
  constructor(
    private readonly id: string,
    private readonly email: Email
  ) {
    if (!this.id) {
      throw new Error("User ID cannot be empty!");
    }
  }

  private toObject() {
    return {
      id: this.id,
      email: this.email.asString(),
    }
  }

  serialize() {
    return JSON.stringify(this.toObject());
  }

  static fromSerialized(serialized: string) {
    const user: ReturnType<User["toObject"]> = JSON.parse(serialized);

    return new User(
      user.id,
      new Email(user.email)
    );
  }
}*/
