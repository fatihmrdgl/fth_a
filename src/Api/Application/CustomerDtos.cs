namespace MimCrm.Api.Application;

public record CustomerDto(Guid Id, string FirstName, string LastName, string Email, string Phone, string NationalId, string Address, DateTime CreatedAt);
public record CreateCustomerRequest(string FirstName, string LastName, string Email, string Phone, string NationalId, string Address);
public record UpdateCustomerRequest(string FirstName, string LastName, string Email, string Phone, string NationalId, string Address);
