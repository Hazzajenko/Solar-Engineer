using dotnetapi.Features.Images.Entities;

namespace dotnetapi.Features.Images.Endpoints.GetDefaultIcons;

public class Contracts
{
    public class GetDefaultIconsResponse
    {
        public IEnumerable<S3ImageDto> Images { get; set; } = new List<S3ImageDto>();
    }
}