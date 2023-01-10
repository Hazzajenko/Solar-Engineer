using Microsoft.AspNetCore.Mvc.ApplicationModels;

namespace dotnetapi;

public class GroupingByNamespaceConvention : IControllerModelConvention
{
    public void Apply(ControllerModel controller)
    {
        var controllerNamespace = controller.ControllerType.Namespace;
        var apiVersion = controllerNamespace.Split(".").Last().ToLower();
        if (!apiVersion.StartsWith("v")) apiVersion = "v1";
        controller.ApiExplorer.GroupName = apiVersion;
    }
}