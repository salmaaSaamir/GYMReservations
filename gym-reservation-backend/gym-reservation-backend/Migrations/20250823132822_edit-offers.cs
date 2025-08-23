using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gym_reservation_backend.Migrations
{
    /// <inheritdoc />
    public partial class editoffers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "SubscriptionId",
                table: "Offers",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_Offers_SubscriptionId",
                table: "Offers",
                column: "SubscriptionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Offers_Subscriptions_SubscriptionId",
                table: "Offers",
                column: "SubscriptionId",
                principalTable: "Subscriptions",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Offers_Subscriptions_SubscriptionId",
                table: "Offers");

            migrationBuilder.DropIndex(
                name: "IX_Offers_SubscriptionId",
                table: "Offers");

            migrationBuilder.AlterColumn<int>(
                name: "SubscriptionId",
                table: "Offers",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }
    }
}
