package com.romsproject.roms.repository;

import com.romsproject.roms.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Integer> {

        // ==========================================================
        // 1️⃣ CURRENT reservations
        // ==========================================================
        List<Reservation> findByUser_EmailAndReservationTimeBeforeAndFinishedTimeAfter(
                        String email,
                        LocalDateTime now1,
                        LocalDateTime now2);

        // ==========================================================
        // 2️⃣ FUTURE reservations
        // ==========================================================
        List<Reservation> findByUser_EmailAndStatusAndReservationTimeAfter(
                        String email,
                        Statuses.ReservationStatus status,
                        LocalDateTime now);

        List<Reservation> findByUser_EmailAndStatus(
                        String email,
                        Statuses.ReservationStatus status);

        // ==========================================================
        // 3️⃣ SIMPLE CONFLICT CHECK (FOR NOW RESERVATION)
        // ==========================================================
        boolean existsByTableAndStatusAndFinishedTimeAfter(
                        RestaurantTable table,
                        Statuses.ReservationStatus status,
                        LocalDateTime time);

        // ==========================================================
        // 4️⃣ 🔥 TIME RANGE OVERLAP CHECK (FOR FUTURE RESERVATION)
        // ==========================================================
        boolean existsByTableAndStatusAndReservationTimeLessThanEqualAndFinishedTimeGreaterThanEqual(
                        RestaurantTable table,
                        Statuses.ReservationStatus status,
                        LocalDateTime endTime,
                        LocalDateTime startTime);

        // ==========================================================
        // 5️⃣ AUTO COMPLETE (Derived)
        // ==========================================================
        List<Reservation> findByFinishedTimeBeforeAndStatus(
                        LocalDateTime time,
                        Statuses.ReservationStatus status);

        // ==========================================================
        // 6️⃣ AUTO COMPLETE (Custom Query - Cleaner)
        // ==========================================================

        @Query("""
        SELECT r FROM Reservation r
        WHERE r.table.tableId = :tableId
        AND r.status = 'ACTIVE'
        AND (:start < r.finishedTime AND :end > r.reservationTime)
        """)
  
        List<Reservation> findConflictingReservations(
                        @Param("tableId") Integer tableId,
                        @Param("start") LocalDateTime start,
                        @Param("end") LocalDateTime end);

        // Added by ShweHtet Order
        List<Reservation> findByUser_EmailAndStatusAndReservationTimeBeforeAndFinishedTimeAfter(
                        String email,
                        Statuses.ReservationStatus status,
                        LocalDateTime now1,
                        LocalDateTime now2);

  

}