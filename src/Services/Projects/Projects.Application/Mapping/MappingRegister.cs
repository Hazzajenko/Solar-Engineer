/*using System.Reflection;
using Mapster;
using MessagePack;
using Projects.API.Entities;

namespace Projects.API.Mapping;

public class MappingRegister : ICodeGenerationRegister
{
    public void Register(CodeGenerationConfig config)
    {
        config
            .AdaptTo("[name]Dto", MapType.Map | MapType.MapToTarget | MapType.Projection)
            .ApplyDefaultRule()
            .AlterType<Panel, String>();

        config.AdaptFrom("[name]Add", MapType.Map).ApplyDefaultRule().IgnoreNoModifyProperties();

        config
            .AdaptFrom("[name]Update", MapType.MapToTarget)
            .ApplyDefaultRule()
            .IgnoreAttributes(typeof(KeyAttribute))
            .IgnoreNoModifyProperties();

        config
            .AdaptFrom("[name]Merge", MapType.MapToTarget)
            .ApplyDefaultRule()
            .IgnoreAttributes(typeof(KeyAttribute))
            .IgnoreNoModifyProperties()
            .IgnoreNullValues(true);

        config.GenerateMapper("[name]Mapper").ForType<Panel>().ForType<String>();

        /*config.AdaptTo("[name]CustomDto")
            .ForAllTypesInNamespace(Assembly.GetExecutingAssembly(), "Projects.API.Entities");

        config.GenerateMapper("[name]Mapper")
            .ForType<Panel>()
            .ForType<String>();#1#
    }
}

internal static class RegisterExtensions
{
    public static AdaptAttributeBuilder ApplyDefaultRule(this AdaptAttributeBuilder builder)
    {
        return builder
            .ForAllTypesInNamespace(Assembly.GetExecutingAssembly(), "Sample.CodeGen.Domains")
            // .ExcludeTypes(typeof(SchoolContext))
            .ExcludeTypes(type => type.IsEnum)
            .AlterType(
                type => type.IsEnum || Nullable.GetUnderlyingType(type)?.IsEnum == true,
                typeof(string)
            )
            .ShallowCopyForSameType(true);
        // .ForType<Enrollment>(cfg => cfg.Ignore(it => it.Course))
        // .ForType<Student>(cfg => cfg.Ignore(it => it.Enrollments));
    }

    public static AdaptAttributeBuilder IgnoreNoModifyProperties(this AdaptAttributeBuilder builder)
    {
        return builder;
        /*return builder
            .ForType<Enrollment>(cfg => cfg.Ignore(it => it.Student));#1#
    }
}*/

