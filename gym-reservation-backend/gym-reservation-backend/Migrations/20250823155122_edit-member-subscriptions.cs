using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gym_reservation_backend.Migrations
{
    /// <inheritdoc />
    public partial class editmembersubscriptions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OfferId",
                table: "MemberSubscriptions",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MemberSubscriptions_OfferId",
                table: "MemberSubscriptions",
                column: "OfferId");

            migrationBuilder.AddForeignKey(
                name: "FK_MemberSubscriptions_Offers_OfferId",
                table: "MemberSubscriptions",
                column: "OfferId",
                principalTable: "Offers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MemberSubscriptions_Offers_OfferId",
                table: "MemberSubscriptions");

            migrationBuilder.DropIndex(
                name: "IX_MemberSubscriptions_OfferId",
                table: "MemberSubscriptions");

            migrationBuilder.DropColumn(
                name: "OfferId",
                table: "MemberSubscriptions");
        }
    }
}
