using Identity.API.Auth;

namespace Identity.API.Extensions;

public static class AuthorizationExtensions
{
    public static IServiceCollection InitAuthorization(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        services.AddAuthorization(options =>
        {
            options.AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"));
            options.AddPolicy("RequireModeratorRole", policy => policy.RequireRole("Moderator"));
            options.AddPolicy(
                "RequireAdminOrModeratorRole",
                policy => policy.RequireRole("Admin", "Moderator")
            );

            options.AddPolicy(
                AuthConstants.AdminUserPolicyName,
                p => p.AddRequirements(new AdminAuthRequirement(config["ApiKey"]!))
            );

            options.AddPolicy(
                AuthConstants.TrustedMemberPolicyName,
                p =>
                    p.RequireAssertion(
                        c =>
                            c.User.HasClaim(
                                m => m is { Type: AuthConstants.AdminUserClaimName, Value: "true" }
                            )
                            || c.User.HasClaim(
                                m =>
                                    m
                                        is
                                        {
                                            Type: AuthConstants.TrustedMemberClaimName,
                                            Value: "true"
                                        }
                            )
                    )
            );
        });

        return services;
    }
}