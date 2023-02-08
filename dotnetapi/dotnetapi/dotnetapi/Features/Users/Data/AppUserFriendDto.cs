﻿namespace dotnetapi.Features.Users.Data;

public class RecipientUserFriendDto
{
    public int Id { get; set; } = default!;
    public string UserName { get; set; } = default!;
    public string PhotoUrl { get; set; } = default!;
    public DateTime LastActive { get; set; }
}