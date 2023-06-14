namespace Identity.Application.Services.Jwt;

public interface IJwtTokenGenerator
{
    string GenerateToken(string id, string userName);
    string GenerateToken(Guid id, string userName);
}
