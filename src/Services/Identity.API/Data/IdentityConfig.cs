using Duende.IdentityServer;
using Duende.IdentityServer.Models;
using Infrastructure.Authentication;

namespace Identity.API.Data;

public static class IdentityConfig
{
    public static IEnumerable<IdentityResource> IdentityResources =>
        new List<IdentityResource>
        {
            new IdentityResources.OpenId(),
            new IdentityResources.Profile(),
            new IdentityResources.Email(),
            new IdentityResources.Phone(),
            new IdentityResources.Address(),
            new(Constants.StandardScopes.Roles, new List<string> { "role" })
        };


    public static IEnumerable<ApiScope> ApiScopes =>
        new List<ApiScope>
        {
            new(Constants.StandardScopes.UsersApi),
            new(Constants.StandardScopes.MessagesApi)
        };


    public static IList<ApiResource> ApiResources =>
        new List<ApiResource>
        {
            new(Constants.StandardScopes.UsersApi),
            new(Constants.StandardScopes.MessagesApi)
        };

    public static IEnumerable<Client> Clients =>
        new List<Client>
        {
            new()
            {
                ClientId = "m2m.client",
                ClientName = "Client Credentials Client",

                AllowedGrantTypes = GrantTypes.ClientCredentials,
                ClientSecrets = { new Secret("secret".Sha256()) },
                RequireConsent = false,
                AllowedScopes = { "users-api", "users-api.read", "users-api.write" }
            },
            new()
            {
                ClientId = "interactive",
                ClientSecrets = { new Secret("secret".Sha256()) },

                AllowedGrantTypes = GrantTypes.Code,

                RedirectUris = { "https://localhost:6004/signin-oidc" },
                FrontChannelLogoutUri = "https://localhost:6004/signout-oidc",
                PostLogoutRedirectUris = { "https://localhost:6004/signout-callback-oidc" },

                AllowOfflineAccess = true,
                AllowedScopes = { "openid", "profile", "users-api", "users-api.read", "users-api.write" },
                RequirePkce = true,
                RequireConsent = false,
                AllowPlainTextPkce = false
            },
            new()
            {
                ClientId = "client",
                ClientSecrets = { new Secret("secret".Sha256()) },

                AllowedGrantTypes = GrantTypes.ClientCredentials,

                RedirectUris =
                {
                    "https://localhost:4200/signin-oidc",
                    "https://localhost:6006/signin-oidc",
                    "https://localhost:6005/signin-oidc",
                    "https://localhost:6004/signin-oidc",
                    "https://localhost:6003/signin-oidc"
                },

                PostLogoutRedirectUris =
                {
                    "https://localhost:4200/signout-callback-oidc",
                    "https://localhost:6006/signout-callback-oidc",
                    "https://localhost:6005/signout-callback-oidc",
                    "https://localhost:6004/signout-callback-oidc",
                    "https://localhost:6003/signout-callback-oidc"
                },

                AllowedScopes =
                {
                    IdentityServerConstants.StandardScopes.OpenId,
                    IdentityServerConstants.StandardScopes.Profile,
                    Constants.StandardScopes.UsersApi,
                    Constants.StandardScopes.MessagesApi
                }
            },
            new()
            {
                ClientId = "web",
                ClientSecrets = { new Secret("secret".Sha256()) },

                AllowedGrantTypes = GrantTypes.Code,

                RedirectUris = { "https://localhost:5002/signin-oidc" },

                PostLogoutRedirectUris = { "https://localhost:5002/signout-callback-oidc" },

                AllowOfflineAccess = true,

                AllowedScopes = new List<string>
                {
                    IdentityServerConstants.StandardScopes.OpenId,
                    IdentityServerConstants.StandardScopes.Profile,
                    Constants.StandardScopes.UsersApi,
                    Constants.StandardScopes.MessagesApi
                }
            }
        };
}