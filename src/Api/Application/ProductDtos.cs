namespace MimCrm.Api.Application;

public record ProductDto(Guid Id, string Code, string Name, string Description, decimal BasePrice, bool IsActive);
public record CreateProductRequest(string Code, string Name, string Description, decimal BasePrice, bool IsActive);
public record UpdateProductRequest(string Code, string Name, string Description, decimal BasePrice, bool IsActive);
