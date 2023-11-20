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

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<Users> Users { get; set; }

    public virtual DbSet<OrderHead> OrderHeads { get; set; }

    public virtual DbSet<OrderDetail> OrderDetails { get; set; }


    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer(Ut.GetConnetString());

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Goods");

            entity.Property(e => e.productName).HasDefaultValueSql("('')");

            entity.HasOne(d => d.category).WithMany(p => p.Products)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Product_Category");

            //entity.HasOne(o => o.OrderDetail).WithOne(p => p.product)
            //.HasConstraintName("FK_OrderDetail_Product");

        });


        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasMany(c => c.Products).WithOne(c => c.category);
        });

        modelBuilder.Entity<Users>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PK_dbo.Users");

            entity.HasMany(c => c.OrderHeads).WithOne(c => c.User);

            //  entity.Property(e => e.isAppruved).HasDefaultValueSql("((1))");
        });

        modelBuilder.Entity<OrderHead>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PK_OrderHead");

            entity.HasOne(d => d.User).WithMany(d => d.OrderHeads)
            .OnDelete(DeleteBehavior.ClientSetNull)
            .HasConstraintName("FK_OrderHead_Users");


            //entity.HasMany(d => d.OrderDetails).WithOne(d => d.orderHead)
            //.OnDelete(DeleteBehavior.ClientSetNull)
            //.HasConstraintName("FK_OrderDetail_OrderHead");

        });


        modelBuilder.Entity<OrderDetail>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_OrderDetail");

            //entity.HasOne(d => d.orderHead).WithMany(d => d.OrderDetails)
            //.OnDelete(DeleteBehavior.ClientSetNull)
            //.HasConstraintName("FK_OrderDetail_OrderHead");


            //entity.HasOne(d => d.product).WithOne(d => d.OrderDetail)
            //.HasConstraintName("FK_OrderDetail_Product");

        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
