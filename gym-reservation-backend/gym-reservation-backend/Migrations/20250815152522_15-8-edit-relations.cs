using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gym_reservation_backend.Migrations
{
    /// <inheritdoc />
    public partial class _158editrelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Trainers_TrainerId",
                table: "Reservations");

            migrationBuilder.DropForeignKey(
                name: "FK_Trainers_Classes_ClassId",
                table: "Trainers");

            migrationBuilder.DropIndex(
                name: "IX_Trainers_ClassId",
                table: "Trainers");

            migrationBuilder.DropColumn(
                name: "ClassId",
                table: "Trainers");

            migrationBuilder.AddColumn<bool>(
                name: "IsGeneralTrainer",
                table: "Trainers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsCancelled",
                table: "Classes",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "TrainerId",
                table: "Classes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Classes_TrainerId",
                table: "Classes",
                column: "TrainerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Classes_Trainers_TrainerId",
                table: "Classes",
                column: "TrainerId",
                principalTable: "Trainers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Trainers_TrainerId",
                table: "Reservations",
                column: "TrainerId",
                principalTable: "Trainers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Classes_Trainers_TrainerId",
                table: "Classes");

            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Trainers_TrainerId",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Classes_TrainerId",
                table: "Classes");

            migrationBuilder.DropColumn(
                name: "IsGeneralTrainer",
                table: "Trainers");

            migrationBuilder.DropColumn(
                name: "IsCancelled",
                table: "Classes");

            migrationBuilder.DropColumn(
                name: "TrainerId",
                table: "Classes");

            migrationBuilder.AddColumn<int>(
                name: "ClassId",
                table: "Trainers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Trainers_ClassId",
                table: "Trainers",
                column: "ClassId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Trainers_TrainerId",
                table: "Reservations",
                column: "TrainerId",
                principalTable: "Trainers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Trainers_Classes_ClassId",
                table: "Trainers",
                column: "ClassId",
                principalTable: "Classes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
