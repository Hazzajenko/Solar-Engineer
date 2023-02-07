namespace dotnetapi.Features.Users.Entities;

public class Auth0UserDto
{
    public DateTime created_at { get; set; }
    public string email { get; set; }
    public bool email_verified { get; set; }
    public string family_name { get; set; }
    public string given_name { get; set; }
    public List<IdentityDto> identities { get; set; }
    public string locale { get; set; }
    public string name { get; set; }
    public string nickname { get; set; }
    public string picture { get; set; }
    public DateTime updated_at { get; set; }
    public string user_id { get; set; }
    public string last_ip { get; set; }
    public DateTime last_login { get; set; }
    public int logins_count { get; set; }
}

public class IdentityDto
{
    public string provider { get; set; }
    public string access_token { get; set; }
    public int expires_in { get; set; }
    public string user_id { get; set; }
    public string connection { get; set; }
    public bool isSocial { get; set; }
}