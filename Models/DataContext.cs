using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace ShopWEB1.Models;

public partial class DataContext : DbContext
{
    public DataContext()
    {
    }

    public DataContext(DbContextOptions<DataContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<OrderDetail> OrderDetails { get; set; }

    public virtual DbSet<OrderDetailView> OrderDetailViews { get; set; }

    public virtual DbSet<OrderHead> OrderHeads { get; set; }

    public virtual DbSet<OrderHeadView> OrderHeadViews { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<Users> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=ConnectionStrings:SqlConnString");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToTable("Category");

            entity.Property(e => e.categoryName).HasMaxLength(250);
        });

        modelBuilder.Entity<OrderDetail>(entity =>
        {
            entity.ToTable("OrderDetail");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.OrderId).HasColumnName("orderId");
            entity.Property(e => e.Qty).HasColumnType("decimal(18, 0)");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderDetails)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_OrderDetail_OrderHead");

            entity.HasOne(d => d.Product).WithMany(p => p.OrderDetails)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_OrderDetail_Product");
        });

        modelBuilder.Entity<OrderDetailView>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("OrderDetailView");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.OrderId).HasColumnName("orderId");
            entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ProductName).HasMaxLength(250);
            entity.Property(e => e.Qty).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.RowSum).HasColumnType("decimal(37, 2)");
        });

        modelBuilder.Entity<OrderHead>((Action<Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<OrderHead>>)(entity =>
        {
            entity.ToTable<OrderHead>("OrderHead");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.OrderData)
                .HasColumnType("date")
                .HasColumnName("orderData");
            entity.Property<string>(e => e.OrderNumber)
                .HasMaxLength(250)
                .HasDefaultValueSql<string>("([dbo].[getNewOrderNumber]())")
                .HasColumnName<string>("orderNumber");
            entity.Property(e => e.UserId).HasColumnName("userId");

            RelationalForeignKeyBuilderExtensions.HasConstraintName<Users, OrderHead>(entity.HasOne<Users>(d => d.User).WithMany(p => p.OrderHeads)
                .HasForeignKey((System.Linq.Expressions.Expression<Func<OrderHead, object?>>)(d => d.UserId))
                .OnDelete(DeleteBehavior.ClientSetNull)
, "FK_OrderHead_Users");
        }));

        modelBuilder.Entity<OrderHeadView>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("OrderHeadView");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.OrderData)
                .HasColumnType("date")
                .HasColumnName("orderData");
            entity.Property(e => e.OrderNumber)
                .HasMaxLength(250)
                .HasColumnName("orderNumber");
            entity.Property(e => e.TotalPrice).HasColumnType("decimal(38, 2)");
            entity.Property(e => e.UserId).HasColumnName("userId");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Goods");

            entity.ToTable("Product");

            entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ProductName)
                .HasMaxLength(250)
                .HasDefaultValueSql("('')");

            entity.HasOne(d => d.category).WithMany(p => p.Products)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Product_Category");
        });

        modelBuilder.Entity<Users>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PK_dbo.Users");

            entity.HasIndex(e => e.Email, "UsersNameUnique").IsUnique();

            entity.Property(e => e.Email).HasMaxLength(250);
            entity.Property(e => e.isAppruved)
                .IsRequired()
                .HasDefaultValueSql("((1))")
                .HasColumnName("isAppruved");
            entity.Property(e => e.Password).HasMaxLength(250);
            entity.Property(e => e.Role).HasMaxLength(250);
            entity.Property(e => e.UsersName).HasMaxLength(250);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
