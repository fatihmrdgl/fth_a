using Microsoft.Extensions.Configuration;

namespace MimCrm.Api.Infrastructure;

public static class JwtConfig
{
    public static string Issuer(IConfiguration cfg) => cfg.GetSection("Jwt")["Issuer"] ?? "mimcrm";
    public static string Audience(IConfiguration cfg) => cfg.GetSection("Jwt")["Audience"] ?? "mimcrm";
    public static string Key(IConfiguration cfg) => cfg.GetSection("Jwt")["Key"] ?? "change_this_dev_key_at_least_32_chars";
}