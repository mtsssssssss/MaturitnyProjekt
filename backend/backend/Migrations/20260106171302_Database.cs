using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class Database : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "questions");

            migrationBuilder.EnsureSchema(
                name: "subjects");

            migrationBuilder.EnsureSchema(
                name: "tests");

            migrationBuilder.CreateTable(
                name: "subject",
                schema: "subjects",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SubjectName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    SubjectAbbrev = table.Column<string>(type: "char(3)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_subject", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "test",
                schema: "tests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_test", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "question",
                schema: "questions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    QuestionText = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    SubjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    QuestionType = table.Column<int>(type: "integer", nullable: false),
                    Answer = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_question", x => x.Id);
                    table.ForeignKey(
                        name: "FK_question_subject_SubjectId",
                        column: x => x.SubjectId,
                        principalSchema: "subjects",
                        principalTable: "subject",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "abcd_question_answer",
                schema: "questions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Answer = table.Column<string>(type: "text", nullable: false),
                    IsRight = table.Column<bool>(type: "boolean", nullable: false),
                    AbcdQuestionId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_abcd_question_answer", x => x.Id);
                    table.ForeignKey(
                        name: "FK_abcd_question_answer_question_AbcdQuestionId",
                        column: x => x.AbcdQuestionId,
                        principalSchema: "questions",
                        principalTable: "question",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "test_question",
                schema: "tests",
                columns: table => new
                {
                    TestId = table.Column<Guid>(type: "uuid", nullable: false),
                    QuestionId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_test_question", x => new { x.TestId, x.QuestionId });
                    table.ForeignKey(
                        name: "FK_test_question_question_QuestionId",
                        column: x => x.QuestionId,
                        principalSchema: "questions",
                        principalTable: "question",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_test_question_test_TestId",
                        column: x => x.TestId,
                        principalSchema: "tests",
                        principalTable: "test",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_abcd_question_answer_AbcdQuestionId",
                schema: "questions",
                table: "abcd_question_answer",
                column: "AbcdQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_question_SubjectId",
                schema: "questions",
                table: "question",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_test_question_QuestionId",
                schema: "tests",
                table: "test_question",
                column: "QuestionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "abcd_question_answer",
                schema: "questions");

            migrationBuilder.DropTable(
                name: "test_question",
                schema: "tests");

            migrationBuilder.DropTable(
                name: "question",
                schema: "questions");

            migrationBuilder.DropTable(
                name: "test",
                schema: "tests");

            migrationBuilder.DropTable(
                name: "subject",
                schema: "subjects");
        }
    }
}
