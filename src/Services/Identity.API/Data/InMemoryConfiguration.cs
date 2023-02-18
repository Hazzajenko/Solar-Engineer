using Duende.IdentityServer;
using Duende.IdentityServer.Models;
using Infrastructure.Authentication;

namespace Identity.API.Data;

public static class InMemoryConfiguration
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
            // machine-to-machine client (from quickstart 1)
            new()
            {
                ClientId = "client",
                ClientSecrets = { new Secret("secret".Sha256()) },

                AllowedGrantTypes = GrantTypes.ClientCredentials,
                // scopes that client has access to
                AllowedScopes =
                {
                    IdentityServerConstants.StandardScopes.OpenId,
                    IdentityServerConstants.StandardScopes.Profile,
                    Constants.StandardScopes.UsersApi,
                    Constants.StandardScopes.MessagesApi
                }
            },
            // interactive ASP.NET Core Web App
            new()
            {
                ClientId = "web",
                ClientSecrets = { new Secret("secret".Sha256()) },

                AllowedGrantTypes = GrantTypes.Code,

                // where to redirect after login
                RedirectUris = { "https://localhost:5002/signin-oidc" },

                // where to redirect after logout
                PostLogoutRedirectUris = { "https://localhost:5002/signout-callback-oidc" },

                AllowOfflineAccess = true,

                AllowedScopes = new List<string>
                {
                    IdentityServerConstants.StandardScopes.OpenId,
                    IdentityServerConstants.StandardScopes.Profile,
                    Constants.StandardScopes.UsersApi,
                    Constants.StandardScopes.MessagesApi
                }
            },
            new()
            {
                ClientId = "client2",

                AllowedGrantTypes = { GrantType.ResourceOwnerPassword },

                ClientSecrets =
                {
                    new Secret("secret".Sha256())
                },

                AllowedScopes =
                {
                    IdentityServerConstants.StandardScopes.OpenId,
                    IdentityServerConstants.StandardScopes.Profile,
                    Constants.StandardScopes.UsersApi,
                    Constants.StandardScopes.MessagesApi
                }
            }
        };
}