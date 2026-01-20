using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class DatabaseUpdate5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TestDescription",
                schema: "tests",
                table: "test",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "TestFinished",
                schema: "tests",
                table: "test",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TestName",
                schema: "tests",
                table: "test",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "TestStarted",
                schema: "tests",
                table: "test",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TestStatus",
                schema: "tests",
                table: "test",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TestDescription",
                schema: "tests",
                table: "test");

            migrationBuilder.DropColumn(
                name: "TestFinished",
                schema: "tests",
                table: "test");

            migrationBuilder.DropColumn(
                name: "TestName",
                schema: "tests",
                table: "test");

            migrationBuilder.DropColumn(
                name: "TestStarted",
                schema: "tests",
                table: "test");

            migrationBuilder.DropColumn(
                name: "TestStatus",
                schema: "tests",
                table: "test");
        }
    }
}
