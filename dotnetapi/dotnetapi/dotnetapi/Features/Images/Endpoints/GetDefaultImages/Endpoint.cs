using Amazon.S3;
using CloudinaryDotNet;
using dotnetapi.Features.Images.Entities;
using dotnetapi.Features.Images.Mapping;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Images.Endpoints.GetDefaultImages;

[Authorize]
public class GetDefaultImagesEndpoint : EndpointWithoutRequest<IEnumerable<ImageDto>>
{
    private readonly Cloudinary _cloudinary;

    private readonly ILogger<GetDefaultImagesEndpoint> _logger;
    private readonly IMediator _mediator;
    private readonly IAmazonS3 _s3Client;
    private readonly UserManager<AppUser> _userManager;

    public GetDefaultImagesEndpoint(
        ILogger<GetDefaultImagesEndpoint> logger,
        UserManager<AppUser> userManager,
        Cloudinary cloudinary,
        IAmazonS3 s3Client,
        IMediator mediator)
    {
        _logger = logger;
        _userManager = userManager;
        _cloudinary = cloudinary;
        _s3Client = s3Client;
        _mediator = mediator;
    }

    // public IHubContext<NotificationHub> HubContext { get; }

    public override void Configure()
    {
        Get("images/deprecated");
        Policies("BeAuthenticated");
        AllowFileUploads();
        // Description(b => b
        // .Accepts<string>("application/json"));
        // Authenticate
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("UserName is invalid");
        }


        /*var list = _cloudinary.ListResources(); // var publiscIds = list.Resources.Select(x => x.PublicId);
        var publicIds = list.Resources.Select(x => x.PublicId);
        var urls = list.Resources.Select(x => x.Url.AbsolutePath);
        var res = list.Resources.Select(x => new Contracts.GetImage
        {
            PublicId = x.PublicId,
            AbsolutePath = x.Url.AbsolutePath
        });*/
        // _cloudinary.
        // var list2 = _cloudinary.ListResources("default-dps");  
        // var folders = _cloudinary.RootFolders();
        // var selecFolder = folders.Folders.Find(x => x.Name == "default-dps");
        // var yoso = await _cloudinary.ListResourcesByAssetFolder("default-dps").;
        var yoo = await _cloudinary.ListResourcesByPrefixAsync("default-dps");
        // tags=kitten AND uploaded_at>1d AND bytes>1m
        var result = await _cloudinary.Search()
            .Expression("resource_type:image AND public_id:default-dps*")
            .SortBy("public_id", "desc")
            .MaxResults(30)
            .ExecuteAsync();
        // .Execute();

        var ress = result.Resources.Select(x => x.ToImageDto());
        /*cloudinary.v2.api.resources({
            type: 'upload',
            prefix: 'xx' // add your folder
        },
        function(error, result) { console.log(result, error) });*/
        // var list2 = _cloudinary.ListResourcesByAssetFolder(selecFolder!.Name);  
        // var foldsers = await _cloudinary.ListResourceByAssetFolderAsync("/default-dps", false, false, false, cT);
        /*var list2 = _cloudinary.ListResourcesByAssetFolder("default-dps");
        var res2 = list2.Resources.Select(x => new Contracts.GetImage
        {
            PublicId = x.PublicId,
            AbsolutePath = x.Url.AbsolutePath
        });*/

        Console.WriteLine(ress);
        // Console.WriteLine(foldsers);
        // var

        /*var res = new
        {
            publicIds,
            urls
        };*/

        Response = ress;

        // _logger.LogInformation("{UserName} uploaded an image", user.UserName);

        /*await SendStreamAsync(
            stream: request.File.OpenReadStream(),
            fileName: "test.png",
            fileLengthBytes: request.File.Length,
            contentType: "image/png", cancellation: cT);*/
        await SendOkAsync(Response, cT);
    }
}