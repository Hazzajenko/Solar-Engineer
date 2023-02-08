﻿using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Features.Messages.Entities;
using dotnetapi.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Path = dotnetapi.Models.Entities.Path;
using String = dotnetapi.Models.Entities.String;

namespace dotnetapi.Data;

public interface IDataContext
{
    DbSet<Auth0User> Auth0Users { get; set; }
    DbSet<AppUserIdentity> AppUserIdentities { get; set; }
    DbSet<AppUser> Users { get; set; }
    DbSet<AppUserGroupChat> AppUserGroupChats { get; set; }
    DbSet<Project> Projects { get; set; }
    DbSet<String> Strings { get; set; }
    DbSet<Panel> Panels { get; set; }
    DbSet<PanelLink> PanelLinks { get; set; }
    DbSet<Path> Paths { get; set; }

    DbSet<AppUserProject> AppUserProjects { get; set; }

    // DbSet<AppUserFriend> AppUserFriends { get; set; }
    DbSet<Group> Groups { get; set; }
    DbSet<GroupChat> GroupChats { get; set; }
    DbSet<Message> Messages { get; set; }
    DbSet<GroupChatMessage> GroupChatMessages { get; set; }
    DbSet<GroupChatServerMessage> GroupChatServerMessages { get; set; }
    DbSet<GroupChatReadTime> GroupChatReadTimes { get; set; }
    DbSet<AppUserLink> AppUserLinks { get; set; }
    DbSet<Notification> Notifications { get; set; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    int SaveChanges();
}