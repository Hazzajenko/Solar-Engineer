using Mediator;
using SkiaSharp;
using Users.API.Contracts.Responses.Images;

namespace Users.API.Handlers.Images.CreateDpImage;

public class CreateDpImageHandler : ICommandHandler<CreateDpImageCommand, CreateDpImageResponse>
{
    private readonly ILogger<CreateDpImageHandler> _logger;

    public CreateDpImageHandler(ILogger<CreateDpImageHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<CreateDpImageResponse> Handle(
        CreateDpImageCommand command,
        CancellationToken cT
    )
    {
        var size = 30;
        var bitmap = new SKBitmap(size, size, SKColorType.Rgba8888, SKAlphaType.Premul);

        using (var canvas = new SKCanvas(bitmap))
        {
            canvas.Clear(SKColors.LightGray);

            using (var paint = new SKPaint())
            {
                paint.Typeface = SKTypeface.FromFamilyName(
                    "Arial",
                    SKFontStyleWeight.Normal,
                    SKFontStyleWidth.Normal,
                    SKFontStyleSlant.Upright
                );
                paint.TextSize = size / 2;
                paint.Color = SKColors.White;
                paint.IsAntialias = true;

                var textBounds = new SKRect();
                paint.MeasureText(command.Initials, ref textBounds);
                var x = (size - textBounds.Width) / 2;
                var y = (size + textBounds.Height) / 2;

                canvas.DrawText(command.Initials, x, y, paint);
            }
        }

        var result = await Task.Run(
            () =>
            {
                using var image = SKImage.FromBitmap(bitmap);
                using var data = image.Encode(SKEncodedImageFormat.Png, 100);
                return data.ToArray();
            },
            cT
        );

        _logger.LogInformation("Image generated for initials: {Initials}", command.Initials);
        return new CreateDpImageResponse
        {
            ImageUrl = $"data:image/png;base64,{Convert.ToBase64String(result)}"
        };
    }
}