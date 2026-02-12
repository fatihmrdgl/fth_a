namespace MimCrm.Api.Application;

public record PolicyDto(Guid Id, string PolicyNumber, Guid CustomerId, Guid ProductId, DateTime StartDate, DateTime EndDate, decimal Premium, string Status);
public record CreatePolicyRequest(Guid CustomerId, Guid ProductId, DateTime StartDate, DateTime EndDate, decimal Premium, string Status);
public record UpdatePolicyRequest(Guid CustomerId, Guid ProductId, DateTime StartDate, DateTime EndDate, decimal Premium, string Status);
