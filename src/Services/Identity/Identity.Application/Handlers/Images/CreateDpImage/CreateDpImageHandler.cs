using Mediator;
using Microsoft.Extensions.Logging;
using SkiaSharp;

namespace Identity.Application.Handlers.Images.CreateDpImage;

public class CreateDpImageHandler : ICommandHandler<CreateDpImageCommand, CreateDpImageResponse>
{
    private readonly ILogger<CreateDpImageHandler> _logger;

    public CreateDpImageHandler(ILogger<CreateDpImageHandler> logger)
    {
        _logger = logger;
    }

    public ValueTask<CreateDpImageResponse> Handle(
        CreateDpImageCommand command,
        CancellationToken cT
    )
    {
        var bitmap = GenerateBitmap(command.Initials);

        // var result = await Task.Run(() => ConvertBitmapToPng(bitmap), cT);
        var result = ConvertBitmapToPng(bitmap);


        _logger.LogInformation("Image generated for initials: {Initials}", command.Initials);
        return ValueTask.FromResult(new CreateDpImageResponse
        {
            ImageUrl = $"data:image/png;base64,{Convert.ToBase64String(result)}"
        });
    }
    
    private SKBitmap GenerateBitmap(string initials)
    {
        var size = 100;
        var bitmap = new SKBitmap(size, size, SKColorType.Rgba8888, SKAlphaType.Premul);

        using var canvas = new SKCanvas(bitmap);
        canvas.Clear(SKColors.Crimson);

        using var paint = new SKPaint();
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
        paint.MeasureText(initials, ref textBounds);
        var x = (size - textBounds.Width) / 2;
        var y = (size + textBounds.Height) / 2;

        canvas.DrawText(initials, x, y, paint);

        return bitmap;
    }

    private byte[] ConvertBitmapToPng(SKBitmap bitmap)
    {
        using var image = SKImage.FromBitmap(bitmap);
        using var data = image.Encode(SKEncodedImageFormat.Png, 100);
        return data.ToArray();
    }
}
