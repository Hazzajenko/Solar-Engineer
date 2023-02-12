namespace Auth.API.Grpc;

/*
public class GrpcPlatformService : GrpcPlatform.GrpcPlatformBase
{
    public override Task<PlatformResponse> GetAllPlatforms(GetAllRequest request, ServerCallContext context)
    {
        // var response = new PlatformResponse();
        /*
        var platforms = _repository.GetAllPlatforms();

        foreach(var plat in platforms)
        {
            response.Platform.Add(_mapper.Map<GrpcPlatformModel>(plat));
        }
        #1#

        var res = new PlatformResponse
        {
            Platform =
            {
                new GrpcPlatformModel
                {
                    Name = "hi",
                    Publisher = "dsa",
                    PlatformId = 1
                }
            }
        };

        return Task.FromResult(res);
    }
}*/