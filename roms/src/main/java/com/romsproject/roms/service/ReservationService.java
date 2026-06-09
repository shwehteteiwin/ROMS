package com.romsproject.roms.service;

import com.romsproject.roms.entity.*;
import com.romsproject.roms.entity.Statuses.ReservationStatus;
import com.romsproject.roms.entity.Statuses.TableStatus;
import com.romsproject.roms.repository.ReservationRepository;
import com.romsproject.roms.repository.TableRepository;
import com.romsproject.roms.repository.UserRepository;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReservationService {
        private final ReservationRepository reservationRepository;
        private final TableRepository tableRepository;
        private final UserRepository userRepository;

        public ReservationService(ReservationRepository reservationRepository,
                        TableRepository tableRepository,
                        UserRepository userRepository) {
                this.reservationRepository = reservationRepository;
                this.tableRepository = tableRepository;
                this.userRepository = userRepository;
        }

        // GET CURRENT RESERVATIONS
        // public List<Reservation> getCurrentReservations(String email) {

        // return reservationRepository
        // .findByUser_EmailAndReservationTimeBeforeAndFinishedTimeAfter(
        // email,
        // LocalDateTime.now(),
        // LocalDateTime.now());
        // }
        // shwehtet
        public List<Reservation> getCurrentReservations(String email) {
                LocalDateTime now = LocalDateTime.now();
                return reservationRepository
                                .findByUser_EmailAndReservationTimeBeforeAndFinishedTimeAfter(
                                                email,
                                                now,
                                                now);
        }

        // GET FUTURE RESERVATIONS
        public List<Reservation> getFutureReservations(String email) {

                return reservationRepository
                                .findByUser_EmailAndStatus(
                                                email,
                                                Statuses.ReservationStatus.ACTIVE);
        }

        public List<Reservation> getActiveFutureReservations(String email) {

                // return reservationRepository
                // .findByUser_EmailAndReservationTimeAfter(
                // email,
                // Statuses.ReservationStatus.ACTIVE,
                // LocalDateTime.now());
                return reservationRepository
                                .findByUser_EmailAndStatusAndReservationTimeAfter(
                                                email,
                                                Statuses.ReservationStatus.ACTIVE,
                                                LocalDateTime.now());
        }

        // shwe htet handled also for guest
        @Transactional
        public void createReservation(String email,
                        Integer tableId,
                        LocalDateTime startTime,
                        LocalDateTime endTime,
                        String customerName) { // added customerName param

                RestaurantTable table = tableRepository.findById(tableId)
                                .orElseThrow(() -> new IllegalArgumentException("Table not found"));

                if (hasConflict(tableId, startTime, endTime)) {
                        throw new IllegalStateException(
                                        "Selected duration conflicts with existing reservation!");
                }

                Reservation reservation = new Reservation();
                reservation.setCreatedAt(LocalDateTime.now());
                reservation.setTable(table);
                reservation.setReservationTime(startTime);
                reservation.setFinishedTime(endTime);
                reservation.setStatus(ReservationStatus.ACTIVE);

                if (email != null) {
                        User user = userRepository.findByEmail(email)
                                        .orElseThrow(() -> new IllegalArgumentException("User not found"));
                        reservation.setUser(user);
                        reservation.setCustomerName(user.getName());

                        // } else {
                        // // Guest
                        // reservation.setUser(null);
                        // reservation.setCustomerName(customerName != null ? customerName : "Guest");
                        // }
                } else {
                        reservation.setUser(null);

                        if (customerName == null || customerName.trim().isEmpty()) {
                                throw new IllegalArgumentException("Customer name is required");
                        }

                        reservation.setCustomerName(customerName);
                }
                reservationRepository.save(reservation);

                table.setStatus(TableStatus.OCCUPIED);
                tableRepository.save(table);
        }

        // // CREATE RESERVATION (FROM DASHBOARD - BOOK NOW) can't handle for guest/
        // // resgistered only
        // @Transactional
        // public void createReservation(String email,
        // Integer tableId,
        // LocalDateTime startTime,
        // LocalDateTime endTime) {

        // RestaurantTable table = tableRepository.findById(tableId)
        // .orElseThrow(() -> new IllegalArgumentException("Table not found"));

        // if (hasConflict(tableId, startTime, endTime)) {
        // throw new IllegalStateException(
        // "Selected duration conflicts with existing reservation!");
        // }

        // User user = userRepository.findByEmail(email)
        // .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Reservation reservation = new Reservation();
        // reservation.setCreatedAt(LocalDateTime.now());
        // reservation.setCustomerName(user.getName());
        // reservation.setUser(user);
        // reservation.setTable(table);
        // reservation.setReservationTime(startTime);
        // reservation.setFinishedTime(endTime);
        // reservation.setStatus(ReservationStatus.ACTIVE);

        // reservationRepository.save(reservation);

        // table.setStatus(TableStatus.OCCUPIED);
        // tableRepository.save(table);
        // }
        // UPDATE RESERVATION STATUS
        // @Scheduled(fixedRate = 60000) // every 1 minute
        // @Transactional
        // public void updateReservationStatuses() {

        // LocalDateTime now = LocalDateTime.now();

        // List<Reservation> reservations = reservationRepository.findAll();

        // for (Reservation reservation : reservations) {

        // RestaurantTable table = reservation.getTable();

        // // When start time arrives
        // if (reservation.getStatus() == ReservationStatus.ACTIVE &&
        // reservation.getReservationTime().isBefore(now) &&
        // reservation.getFinishedTime().isAfter(now)) {

        // table.setStatus(TableStatus.OCCUPIED);
        // }

        // // When finished time passes
        // if (reservation.getStatus() == ReservationStatus.ACTIVE &&
        // reservation.getFinishedTime().isBefore(now)) {

        // reservation.setStatus(ReservationStatus.COMPLETED);
        // table.setStatus(TableStatus.AVAILABLE);
        // }
        // }
        // }
        // Shwe htet because if there is no data in database it return 500 white page
        // error
       
        @Scheduled(fixedRate = 60000)
        @Transactional
        public void updateReservationStatuses() {
                LocalDateTime now = LocalDateTime.now();
                // List<Reservation> reservations = reservationRepository.findAll();

                List<Reservation> expiredReservations = reservationRepository.findByFinishedTimeBeforeAndStatus(
                                LocalDateTime.now(),
                                Statuses.ReservationStatus.ACTIVE);

                for (Reservation r : expiredReservations) {
                        r.setStatus(ReservationStatus.COMPLETED);

                        RestaurantTable table = r.getTable();
                        table.setStatus(TableStatus.AVAILABLE);
                        tableRepository.save(table);

                        reservationRepository.save(r);
                }

        }

        @Transactional
        public void updateStatus(Integer id, ReservationStatus status) {

                Reservation reservation = reservationRepository.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));

                reservation.setStatus(status);

                RestaurantTable table = reservation.getTable();

                if (status == ReservationStatus.CANCELLED ||
                                status == ReservationStatus.COMPLETED) {

                        table.setStatus(TableStatus.AVAILABLE);
                }
                if (status == ReservationStatus.ACTIVE) {
                        table.setStatus(TableStatus.RESERVED);
                }
                reservationRepository.save(reservation);
                tableRepository.save(table);
        }

        // CANCEL FUTURE RESERVATION (24H RULE)
        @Transactional
        public void cancelFutureReservation(Integer reservationId) {

                Reservation reservation = reservationRepository
                                .findById(reservationId)
                                .orElseThrow(() -> new RuntimeException("Reservation not found"));
                // Only ACTIVE reservations can be cancelled
                if (reservation.getStatus() != ReservationStatus.ACTIVE) {
                        throw new IllegalStateException("Only active reservations can be cancelled.");
                }
                LocalDateTime now = LocalDateTime.now();
                LocalDateTime bookingTime = reservation.getCreatedAt();
                // 24 hour cancellation rule
                if (now.isAfter(bookingTime.plusHours(24))) {
                        throw new IllegalStateException(
                                        "Cancellation allowed only within 24 hours of booking time.");
                }

                reservation.setStatus(ReservationStatus.CANCELLED);
                RestaurantTable table = reservation.getTable();
                table.setStatus(TableStatus.AVAILABLE);

                reservationRepository.save(reservation);
                tableRepository.save(table);
        }

        // MAKE "NOW" RESERVATION (MAX 3 HOURS RULE)
        public boolean hasConflict(Integer tableId,
                        LocalDateTime newStart,
                        LocalDateTime newEnd) {

                List<Reservation> conflicts = reservationRepository.findConflictingReservations(
                                tableId,
                                newStart,
                                newEnd);

                return !conflicts.isEmpty();
        }

        // Find available tables for period
        public List<RestaurantTable> findAvailableTablesForPeriod(
                        LocalDateTime start,
                        LocalDateTime end) {

                return tableRepository.findAll().stream()
                                .filter(table -> !reservationRepository
                                                .existsByTableAndStatusAndReservationTimeLessThanEqualAndFinishedTimeGreaterThanEqual(
                                                                table,
                                                                ReservationStatus.ACTIVE,
                                                                end,
                                                                start))
                                .toList();
        }

        // create future reservation
        public void createFutureReservation(String email,
                        Integer tableId,
                        LocalDateTime start,
                        LocalDateTime end) {

                RestaurantTable table = tableRepository.findById(tableId)
                                .orElseThrow(() -> new IllegalArgumentException("Table not found"));

                boolean conflict = reservationRepository
                                .existsByTableAndStatusAndReservationTimeLessThanEqualAndFinishedTimeGreaterThanEqual(
                                                table,
                                                Statuses.ReservationStatus.ACTIVE,
                                                end,
                                                start);

                if (conflict) {
                        throw new IllegalStateException("Table unavailable.");
                }

                User user = userRepository.findByEmail(email)
                                .orElseThrow();

                Reservation reservation = new Reservation();
                reservation.setCreatedAt(LocalDateTime.now());
                reservation.setUser(user);
                reservation.setCustomerName(user.getName());
                reservation.setTable(table);
                reservation.setReservationTime(start);
                reservation.setFinishedTime(end);
                reservation.setStatus(Statuses.ReservationStatus.ACTIVE);

                reservationRepository.save(reservation);

                table.setStatus(TableStatus.RESERVED);
                tableRepository.save(table);
        }

        // Added by ShweHtet Order
        public List<RestaurantTable> findTablesForCurrentUser(String email) {
                LocalDateTime now = LocalDateTime.now();

                // Call repository method with 'now' as before
                List<Reservation> reservations = reservationRepository
                                .findByUser_EmailAndStatusAndReservationTimeBeforeAndFinishedTimeAfter(
                                                email,
                                                ReservationStatus.ACTIVE,
                                                now,
                                                now);

                // Filter manually for null finishedTime or slightly past now
                return reservations.stream()
                                .filter(r -> r.getFinishedTime() == null || r.getFinishedTime().isAfter(now))
                                .map(Reservation::getTable)
                                .toList();
        }


        public RestaurantTable getById(Integer tableId) {
                return tableRepository.findById(tableId)
                                .orElseThrow(() -> new IllegalArgumentException("Table not found with ID: " + tableId));
        }

}
