using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Identity.Application.Extensions;
using Identity.Application.Settings;
using Identity.Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SkiaSharp;

namespace Identity.Application.Services.Images;

public class ImagesService : IImagesService
{
    private readonly ILogger<ImagesService> _logger;

    public ImagesService(ILogger<ImagesService> logger)
    {
        _logger = logger;
    }

    public byte[] CreateDpImageToByteArray(AppUser appUser)
    {
        var initials = appUser.GetInitials();
        var bitmap = GenerateBitmap(initials);

        // var result = await Task.Run(() => ConvertBitmapToPng(bitmap), cT);
        var result = ConvertBitmapToPng(bitmap);
        _logger.LogInformation(
            "Image Dp generated for User: {User} initials: {Initials}",
            appUser.ToAppUserLog(),
            initials
        );
        return result;
    }

    public byte[] CreateDpImageFromInitialsToByteArray(string initials)
    {
        var bitmap = GenerateBitmap(initials);

        // var result = await Task.Run(() => ConvertBitmapToPng(bitmap), cT);
        var result = ConvertBitmapToPng(bitmap);
        _logger.LogInformation("Image Dp generated for Initials: {Initials}", initials);
        return result;
    }

    private SKBitmap GenerateBitmap(string initials)
    {
        var size = 100;
        var bitmap = new SKBitmap(size, size, SKColorType.Rgba8888, SKAlphaType.Premul);

        using var canvas = new SKCanvas(bitmap);
        canvas.Clear(SKColors.Green);
        // canvas.Clear(SKColors.Crimson);

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

        var textPath = paint.GetTextPath(initials, 0, 0);
        var textBounds = textPath.TightBounds;
        var x = (size - textBounds.Width) / 2 - textBounds.Left;
        var y = (size - textBounds.Height) / 2 - textBounds.Top;

        /*var textBounds = new SKRect();
        paint.MeasureText(initials, ref textBounds);
        var x = (size - textBounds.Width) / 2;
        var y = (size + textBounds.Height) / 2;*/

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
