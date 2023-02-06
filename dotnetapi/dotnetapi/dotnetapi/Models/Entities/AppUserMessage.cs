﻿namespace dotnetapi.Models.Entities;

public class AppUserMessage : BaseEntity
{
    public AppUserLink AppUserLink { get; set; } = default!;
    public int AppUserToAppUserId { get; set; }
    public int SenderId { get; set; }
    public string SenderUserName { get; set; } = default!;
    public AppUser Sender { get; set; } = default!;
    public int RecipientId { get; set; }
    public string RecipientUserName { get; set; } = default!;
    public AppUser Recipient { get; set; } = default!;
    public string Content { get; set; } = default!;
    public DateTime? MessageReadTime { get; set; }
    public DateTime MessageSentTime { get; set; } = DateTime.UtcNow;
    public bool SenderDeleted { get; set; }
    public bool RecipientDeleted { get; set; }
}