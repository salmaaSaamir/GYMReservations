using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gym_reservation_backend.Migrations
{
    /// <inheritdoc />
    public partial class editesubscriptionaddMonthsNo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MemberSubscriptions_Subscriptions_SubscriptionId",
                table: "MemberSubscriptions");

            migrationBuilder.DropIndex(
                name: "IX_MemberSubscriptions_SubscriptionId",
                table: "MemberSubscriptions");

            migrationBuilder.AddColumn<int>(
                name: "MonthsNo",
                table: "Subscriptions",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MonthsNo",
                table: "Subscriptions");

            migrationBuilder.CreateIndex(
                name: "IX_MemberSubscriptions_SubscriptionId",
                table: "MemberSubscriptions",
                column: "SubscriptionId");

            migrationBuilder.AddForeignKey(
                name: "FK_MemberSubscriptions_Subscriptions_SubscriptionId",
                table: "MemberSubscriptions",
                column: "SubscriptionId",
                principalTable: "Subscriptions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
