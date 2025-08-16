using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gym_reservation_backend.Migrations
{
    /// <inheritdoc />
    public partial class editclasaddClassDay : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ClassDate",
                table: "Classes",
                newName: "ClassDay");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ClassDay",
                table: "Classes",
                newName: "ClassDate");
        }
    }
}
