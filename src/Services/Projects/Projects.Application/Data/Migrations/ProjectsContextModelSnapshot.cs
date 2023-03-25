﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using Projects.Application.Data;

#nullable disable

namespace Projects.API.Data.Migrations
{
    [DbContext(typeof(ProjectsContext))]
    partial class ProjectsContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Projects.Domain.Entities.AppUserProject", b =>
                {
                    b.Property<Guid>("ProjectUserId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("ProjectId")
                        .HasColumnType("uuid");

                    b.Property<bool>("CanCreate")
                        .HasColumnType("boolean");

                    b.Property<bool>("CanDelete")
                        .HasColumnType("boolean");

                    b.Property<bool>("CanInvite")
                        .HasColumnType("boolean");

                    b.Property<bool>("CanKick")
                        .HasColumnType("boolean");

                    b.Property<DateTime>("CreatedTime")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasDefaultValueSql("now()");

                    b.Property<DateTime>("LastModifiedTime")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp with time zone")
                        .HasDefaultValueSql("now()");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("ProjectUserId", "ProjectId");

                    b.HasIndex("ProjectId");

                    b.ToTable("AppUserProjects");
                });

            modelBuilder.Entity("Projects.Domain.Entities.Panel", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasDefaultValueSql("uuid_generate_v4()");

                    b.Property<Guid>("ProjectId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("CreatedById")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedTime")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("LastModifiedTime")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid?>("LinkNegativeToId")
                        .HasColumnType("uuid");

                    b.Property<Guid?>("LinkPositiveToId")
                        .HasColumnType("uuid");

                    b.Property<string>("Location")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("PanelConfigId")
                        .HasColumnType("uuid");

                    b.Property<int>("Rotation")
                        .HasColumnType("integer");

                    b.Property<Guid>("StringId")
                        .HasColumnType("uuid");

                    b.HasKey("Id", "ProjectId");

                    b.HasIndex("LinkNegativeToId")
                        .IsUnique();

                    b.HasIndex("LinkPositiveToId")
                        .IsUnique();

                    b.HasIndex("PanelConfigId");

                    b.HasIndex("ProjectId");

                    b.HasIndex("StringId");

                    b.ToTable("Panels");
                });

            modelBuilder.Entity("Projects.Domain.Entities.PanelConfig", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasDefaultValueSql("uuid_generate_v4()");

                    b.Property<string>("Brand")
                        .HasColumnType("text");

                    b.Property<Guid?>("CreatedById")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedTime")
                        .HasColumnType("timestamp with time zone");

                    b.Property<double>("CurrentAtMaximumPower")
                        .HasColumnType("double precision");

                    b.Property<bool>("Default")
                        .HasColumnType("boolean");

                    b.Property<DateTime>("LastModifiedTime")
                        .HasColumnType("timestamp with time zone");

                    b.Property<double>("Length")
                        .HasColumnType("double precision");

                    b.Property<double>("MaximumPower")
                        .HasColumnType("double precision");

                    b.Property<double>("MaximumPowerTemp")
                        .HasColumnType("double precision");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<double>("OpenCircuitVoltage")
                        .HasColumnType("double precision");

                    b.Property<double>("OpenCircuitVoltageTemp")
                        .HasColumnType("double precision");

                    b.Property<double>("ShortCircuitCurrent")
                        .HasColumnType("double precision");

                    b.Property<double>("ShortCircuitCurrentTemp")
                        .HasColumnType("double precision");

                    b.Property<double>("VoltageAtMaximumPower")
                        .HasColumnType("double precision");

                    b.Property<double>("Weight")
                        .HasColumnType("double precision");

                    b.Property<double>("Width")
                        .HasColumnType("double precision");

                    b.HasKey("Id");

                    b.ToTable("PanelConfigs");
                });

            modelBuilder.Entity("Projects.Domain.Entities.PanelLink", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasDefaultValueSql("uuid_generate_v4()");

                    b.Property<Guid>("ProjectId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("CreatedById")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedTime")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("LastModifiedTime")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("PanelNegativeToId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("PanelPositiveToId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("StringId")
                        .HasColumnType("uuid");

                    b.HasKey("Id", "ProjectId");

                    b.HasIndex("ProjectId");

                    b.HasIndex("StringId");

                    b.ToTable("PanelLinks");
                });

            modelBuilder.Entity("Projects.Domain.Entities.Project", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasDefaultValueSql("uuid_generate_v4()");

                    b.Property<Guid>("CreatedById")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedTime")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("LastModifiedTime")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Projects");
                });

            modelBuilder.Entity("Projects.Domain.Entities.ProjectUser", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasDefaultValueSql("uuid_generate_v4()");

                    b.Property<DateTime>("CreatedTime")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("DisplayName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("LastModifiedTime")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("PhotoUrl")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("ProjectUsers");
                });

            modelBuilder.Entity("Projects.Domain.Entities.String", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasDefaultValueSql("uuid_generate_v4()");

                    b.Property<Guid>("ProjectId")
                        .HasColumnType("uuid");

                    b.Property<string>("Color")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("CreatedById")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedTime")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("LastModifiedTime")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("Parallel")
                        .HasColumnType("boolean");

                    b.HasKey("Id", "ProjectId");

                    b.HasIndex("ProjectId");

                    b.ToTable("Strings");
                });

            modelBuilder.Entity("Projects.Domain.Entities.AppUserProject", b =>
                {
                    b.HasOne("Projects.Domain.Entities.Project", "Project")
                        .WithMany("AppUserProjects")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Projects.Domain.Entities.ProjectUser", "ProjectUser")
                        .WithMany("AppUserProjects")
                        .HasForeignKey("ProjectUserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Project");

                    b.Navigation("ProjectUser");
                });

            modelBuilder.Entity("Projects.Domain.Entities.Panel", b =>
                {
                    b.HasOne("Projects.Domain.Entities.PanelLink", "LinkNegativeTo")
                        .WithOne("PanelPositiveTo")
                        .HasForeignKey("Projects.Domain.Entities.Panel", "LinkNegativeToId")
                        .HasPrincipalKey("Projects.Domain.Entities.PanelLink", "Id")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("Projects.Domain.Entities.PanelLink", "LinkPositiveTo")
                        .WithOne("PanelNegativeTo")
                        .HasForeignKey("Projects.Domain.Entities.Panel", "LinkPositiveToId")
                        .HasPrincipalKey("Projects.Domain.Entities.PanelLink", "Id")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("Projects.Domain.Entities.PanelConfig", "PanelConfig")
                        .WithMany("Panels")
                        .HasForeignKey("PanelConfigId")
                        .OnDelete(DeleteBehavior.SetNull)
                        .IsRequired();

                    b.HasOne("Projects.Domain.Entities.Project", "Project")
                        .WithMany("Panels")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Projects.Domain.Entities.String", "String")
                        .WithMany("Panels")
                        .HasForeignKey("StringId")
                        .HasPrincipalKey("Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("LinkNegativeTo");

                    b.Navigation("LinkPositiveTo");

                    b.Navigation("PanelConfig");

                    b.Navigation("Project");

                    b.Navigation("String");
                });

            modelBuilder.Entity("Projects.Domain.Entities.PanelLink", b =>
                {
                    b.HasOne("Projects.Domain.Entities.Project", "Project")
                        .WithMany("PanelLinks")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Projects.Domain.Entities.String", "String")
                        .WithMany("PanelLinks")
                        .HasForeignKey("StringId")
                        .HasPrincipalKey("Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Project");

                    b.Navigation("String");
                });

            modelBuilder.Entity("Projects.Domain.Entities.String", b =>
                {
                    b.HasOne("Projects.Domain.Entities.Project", "Project")
                        .WithMany("Strings")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Project");
                });

            modelBuilder.Entity("Projects.Domain.Entities.PanelConfig", b =>
                {
                    b.Navigation("Panels");
                });

            modelBuilder.Entity("Projects.Domain.Entities.PanelLink", b =>
                {
                    b.Navigation("PanelNegativeTo")
                        .IsRequired();

                    b.Navigation("PanelPositiveTo")
                        .IsRequired();
                });

            modelBuilder.Entity("Projects.Domain.Entities.Project", b =>
                {
                    b.Navigation("AppUserProjects");

                    b.Navigation("PanelLinks");

                    b.Navigation("Panels");

                    b.Navigation("Strings");
                });

            modelBuilder.Entity("Projects.Domain.Entities.ProjectUser", b =>
                {
                    b.Navigation("AppUserProjects");
                });

            modelBuilder.Entity("Projects.Domain.Entities.String", b =>
                {
                    b.Navigation("PanelLinks");

                    b.Navigation("Panels");
                });
#pragma warning restore 612, 618
        }
    }
}
