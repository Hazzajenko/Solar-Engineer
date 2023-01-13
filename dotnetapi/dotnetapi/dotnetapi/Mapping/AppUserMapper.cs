﻿using dotnetapi.Contracts.Requests;
using dotnetapi.Contracts.Requests.Auth;
using dotnetapi.Controllers;
using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;

namespace dotnetapi.Mapping;

public static class AppUserMapper
{
    public static AppUserDto ToDto(this AppUser request)
    {
        return new AppUserDto
        {
            Username = request.UserName!,
            FirstName = request.FirstName,
            LastActive = request.LastActive
        };
    }

    public static AppUser ToEntity(this SignupRequest request)
    {
        return new AppUser
        {
            Email = request.Email,
            UserName = request.Username,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhotoUrl = ""
        };
    }

    public static AppUser ToEntityV2(this SignupRequestV2 request)
    {
        return new AppUser
        {
            Email = "",
            UserName = request.Username,
            FirstName = "",
            LastName = "",
            PhotoUrl = ""
        };
    }

    public static AppUser ToEntityV3(this AuthRequest request)
    {
        return new AppUser
        {
            Email = "",
            UserName = request.Username,
            FirstName = "",
            LastName = "",
            PhotoUrl = ""
        };
    }

    public static AppUserProject ToAppUserProject(this CreateProjectRequest request, AppUser user)
    {
        return new AppUserProject
        {
            AppUserId = user.Id,
            AppUser = user,
            JoinedAt = DateTime.Now,
            Role = "Admin",
            CanCreate = true,
            CanDelete = true,
            CanInvite = true,
            CanKick = true,
            Project = request.ToEntity(user)
        };
    }
}