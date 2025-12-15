using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class CreateDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "questions");

            migrationBuilder.CreateTable(
                name: "subject",
                schema: "questions",
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
                name: "abcd_question",
                schema: "questions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    QuestionText = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    SubjectId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_abcd_question", x => x.Id);
                    table.ForeignKey(
                        name: "FK_abcd_question_subject_SubjectId",
                        column: x => x.SubjectId,
                        principalSchema: "questions",
                        principalTable: "subject",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "writing_question",
                schema: "questions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    QuestionText = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    SubjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    Answer = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_writing_question", x => x.Id);
                    table.ForeignKey(
                        name: "FK_writing_question_subject_SubjectId",
                        column: x => x.SubjectId,
                        principalSchema: "questions",
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
                        name: "FK_abcd_question_answer_abcd_question_AbcdQuestionId",
                        column: x => x.AbcdQuestionId,
                        principalSchema: "questions",
                        principalTable: "abcd_question",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_abcd_question_SubjectId",
                schema: "questions",
                table: "abcd_question",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_abcd_question_answer_AbcdQuestionId",
                schema: "questions",
                table: "abcd_question_answer",
                column: "AbcdQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_writing_question_SubjectId",
                schema: "questions",
                table: "writing_question",
                column: "SubjectId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "abcd_question_answer",
                schema: "questions");

            migrationBuilder.DropTable(
                name: "writing_question",
                schema: "questions");

            migrationBuilder.DropTable(
                name: "abcd_question",
                schema: "questions");

            migrationBuilder.DropTable(
                name: "subject",
                schema: "questions");
        }
    }
}
