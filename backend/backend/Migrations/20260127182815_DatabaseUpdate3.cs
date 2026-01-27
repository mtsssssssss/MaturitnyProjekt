using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class DatabaseUpdate3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_test_user_UserId",
                schema: "tests",
                table: "test");

            migrationBuilder.DropIndex(
                name: "IX_test_UserId",
                schema: "tests",
                table: "test");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "tests",
                table: "test");

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedByUserId",
                schema: "tests",
                table: "test",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "test_assignment",
                schema: "tests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TestId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    AssignedByUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    AssignedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_test_assignment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_test_assignment_test_TestId",
                        column: x => x.TestId,
                        principalSchema: "tests",
                        principalTable: "test",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_test_assignment_user_AssignedByUserId",
                        column: x => x.AssignedByUserId,
                        principalSchema: "auth",
                        principalTable: "user",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_test_assignment_user_UserId",
                        column: x => x.UserId,
                        principalSchema: "auth",
                        principalTable: "user",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_test_CreatedByUserId",
                schema: "tests",
                table: "test",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_test_assignment_AssignedByUserId",
                schema: "tests",
                table: "test_assignment",
                column: "AssignedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_test_assignment_TestId_UserId",
                schema: "tests",
                table: "test_assignment",
                columns: new[] { "TestId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_test_assignment_UserId",
                schema: "tests",
                table: "test_assignment",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_test_user_CreatedByUserId",
                schema: "tests",
                table: "test",
                column: "CreatedByUserId",
                principalSchema: "auth",
                principalTable: "user",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_test_user_CreatedByUserId",
                schema: "tests",
                table: "test");

            migrationBuilder.DropTable(
                name: "test_assignment",
                schema: "tests");

            migrationBuilder.DropIndex(
                name: "IX_test_CreatedByUserId",
                schema: "tests",
                table: "test");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "tests",
                table: "test");

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                schema: "tests",
                table: "test",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_test_UserId",
                schema: "tests",
                table: "test",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_test_user_UserId",
                schema: "tests",
                table: "test",
                column: "UserId",
                principalSchema: "auth",
                principalTable: "user",
                principalColumn: "Id");
        }
    }
}
