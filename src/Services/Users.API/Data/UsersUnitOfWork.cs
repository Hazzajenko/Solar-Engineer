﻿using Infrastructure.Data;
using Users.API.Repositories.UserLinks;

namespace Users.API.Data;

public class UsersUnitOfWork : UnitOfWorkFactory<UsersContext>, IUsersUnitOfWork
{
    public UsersUnitOfWork(UsersContext context)
        : base(context) { }

    // public IUsersRepository UsersRepository => new UsersRepository(Context);
    public IUserLinksRepository UserLinksRepository => new UserLinksRepository(Context);
}
