using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gym_reservation_backend.Migrations
{
    /// <inheritdoc />
    public partial class editmodels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "FreezeEndDate",
                table: "MemberSubscriptions",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FreezeStartDate",
                table: "MemberSubscriptions",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RemainingFreezeDays",
                table: "MemberSubscriptions",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FreezeEndDate",
                table: "MemberSubscriptions");

            migrationBuilder.DropColumn(
                name: "FreezeStartDate",
                table: "MemberSubscriptions");

            migrationBuilder.DropColumn(
                name: "RemainingFreezeDays",
                table: "MemberSubscriptions");
        }
    }
}
