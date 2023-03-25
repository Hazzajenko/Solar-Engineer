namespace Identity.Application.Services.Jwt;

public interface IJwtTokenGenerator
{
    string GenerateToken(string id, string userName);
}