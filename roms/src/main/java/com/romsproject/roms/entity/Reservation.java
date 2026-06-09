package com.romsproject.roms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.romsproject.roms.entity.Statuses.ReservationStatus;
// import com.romsproject.roms.entity.Statuses.TableStatus;

@Entity
@Table(name = "reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_id")
    private Integer reservationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "table_id", nullable = false, foreignKey = @ForeignKey(name = "fk_res_table"))
    private RestaurantTable table;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "fk_res_user"))
    private User user;

    @Column(name = "customer_name", nullable = false, length = 100)
    private String customerName;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "reservation_time", nullable = false)
    private LocalDateTime reservationTime;

    @Column(name = "finished_time")
    private LocalDateTime finishedTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Statuses.ReservationStatus status;

    // Default constructor
    public Reservation() {
    }

    @PrePersist
    private void prePersist() {
        if (status == null) {
            status = Statuses.ReservationStatus.ACTIVE;
        }
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    // Getters and setters
    public Integer getReservationId() {
        return reservationId;
    }

    public void setReservationId(Integer reservationId) {
        this.reservationId = reservationId;
    }

    public RestaurantTable getTable() {
        return table;
    }

    public void setTable(RestaurantTable table) {
        this.table = table;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getReservationTime() {
        return reservationTime;
    }

    public void setReservationTime(LocalDateTime reservationTime) {
        this.reservationTime = reservationTime;
    }

    public LocalDateTime getFinishedTime() {
        return finishedTime;
    }

    public void setFinishedTime(LocalDateTime finishedTime) {
        this.finishedTime = finishedTime;
    }

    public Statuses.ReservationStatus getStatus() {
        return status;
    }

    public void setStatus(ReservationStatus status2) {
        this.status = status2;
    }

}