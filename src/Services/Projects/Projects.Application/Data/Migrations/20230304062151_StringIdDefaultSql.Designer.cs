﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using Projects.API.Data;
using Projects.Application.Data;

#nullable disable

namespace Projects.API.Data.Migrations
{
    [DbContext(typeof(ProjectsContext))]
    [Migration("20230304062151_StringIdDefaultSql")]
    partial class StringIdDefaultSql
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Projects.API.Entities.AppUserProject", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("AppUserId")
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
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("LastModifiedTime")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("ProjectId")
                        .HasColumnType("uuid");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("ProjectId");

                    b.ToTable("AppUserProjects");
                });

            modelBuilder.Entity("Projects.API.Entities.Panel", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("CreatedById")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedTime")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("LastModifiedTime")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("PanelConfigId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("ProjectId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("StringId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasDefaultValueSql("uuid_generate_v4()");

                    b.HasKey("Id");

                    b.HasIndex("PanelConfigId");

                    b.HasIndex("ProjectId");

                    b.HasIndex("StringId");

                    b.ToTable("Panels");
                });

            modelBuilder.Entity("Projects.API.Entities.PanelConfig", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

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

            modelBuilder.Entity("Projects.API.Entities.PanelLink", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("CreatedById")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedTime")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("LastModifiedTime")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("NegativeToId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("PositiveToId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("ProjectId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("NegativeToId");

                    b.HasIndex("PositiveToId");

                    b.HasIndex("ProjectId");

                    b.ToTable("PanelLinks");
                });

            modelBuilder.Entity("Projects.API.Entities.Project", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

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

            modelBuilder.Entity("Projects.API.Entities.String", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
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

                    b.Property<Guid>("ProjectId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("ProjectId");

                    b.ToTable("Strings");
                });

            modelBuilder.Entity("Projects.API.Entities.AppUserProject", b =>
                {
                    b.HasOne("Projects.API.Entities.Project", "Project")
                        .WithMany("AppUserProjects")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Project");
                });

            modelBuilder.Entity("Projects.API.Entities.Panel", b =>
                {
                    b.HasOne("Projects.API.Entities.PanelConfig", "PanelConfig")
                        .WithMany("Panels")
                        .HasForeignKey("PanelConfigId")
                        .OnDelete(DeleteBehavior.SetNull)
                        .IsRequired();

                    b.HasOne("Projects.API.Entities.Project", "Project")
                        .WithMany("Panels")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Projects.API.Entities.String", "String")
                        .WithMany("Panels")
                        .HasForeignKey("StringId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.Navigation("PanelConfig");

                    b.Navigation("Project");

                    b.Navigation("String");
                });

            modelBuilder.Entity("Projects.API.Entities.PanelLink", b =>
                {
                    b.HasOne("Projects.API.Entities.Panel", "NegativeTo")
                        .WithMany()
                        .HasForeignKey("NegativeToId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Projects.API.Entities.Panel", "PositiveTo")
                        .WithMany()
                        .HasForeignKey("PositiveToId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Projects.API.Entities.Project", "Project")
                        .WithMany("PanelLinks")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("NegativeTo");

                    b.Navigation("PositiveTo");

                    b.Navigation("Project");
                });

            modelBuilder.Entity("Projects.API.Entities.String", b =>
                {
                    b.HasOne("Projects.API.Entities.Project", "Project")
                        .WithMany("Strings")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Project");
                });

            modelBuilder.Entity("Projects.API.Entities.PanelConfig", b =>
                {
                    b.Navigation("Panels");
                });

            modelBuilder.Entity("Projects.API.Entities.Project", b =>
                {
                    b.Navigation("AppUserProjects");

                    b.Navigation("PanelLinks");

                    b.Navigation("Panels");

                    b.Navigation("Strings");
                });

            modelBuilder.Entity("Projects.API.Entities.String", b =>
                {
                    b.Navigation("Panels");
                });
#pragma warning restore 612, 618
        }
    }
}
