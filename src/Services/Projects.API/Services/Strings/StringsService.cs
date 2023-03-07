using Projects.API.Data;

namespace Projects.API.Services.Strings;

public class StringsService : IStringsService
{
    private readonly IProjectsUnitOfWork _unitOfWork;

    public StringsService(IProjectsUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    /*public async Task<String> GetOrCreateUndefinedStringAsync(Guid projectId)
    {
        var undefinedString = await _unitOfWork.StringsRepository.GetStringByNameAsync("undefined");
        if (undefinedString is not null) return undefinedString;

        undefinedString = new String
        {
            Name = "undefined",
            Color = "#808080",
            Parallel = false,
            ProjectId = projectId,
            CreatedById = projectId
        };

        await _unitOfWork.StringsRepository.AddAsync(undefinedString);
        await _unitOfWork.SaveChangesAsync();

        return undefinedString;
    }*/
}