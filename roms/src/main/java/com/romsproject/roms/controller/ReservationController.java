package com.romsproject.roms.controller;

import com.romsproject.roms.entity.Reservation;
import com.romsproject.roms.entity.RestaurantTable;
import com.romsproject.roms.entity.User;
import com.romsproject.roms.repository.UserRepository;
import com.romsproject.roms.service.ReservationService;
import com.romsproject.roms.service.UserService;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@Controller
@RequestMapping("/reservations")
public class ReservationController {
    private final ReservationService reservationService;
    private final UserService userService;
    private final UserRepository userRepository;

    public ReservationController(ReservationService reservationService,
            UserService userService, UserRepository userRepository) {
        this.reservationService = reservationService;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    // CURRENT RESERVATIONS
    @GetMapping("/current")
    public String currentReservations(Model model, Principal principal) {

        if (principal == null) {
            return "redirect:/login";
        }

        List<Reservation> current = reservationService.getCurrentReservations(principal.getName());

        model.addAttribute("reservations", current);

        return "currentRS";
    }

    @GetMapping("/book-now")
    public String showBookNowForm(@RequestParam Integer tableId,
            Model model,
            Principal principal) {

        model.addAttribute("tableId", tableId);

        if (principal != null) {
            User user = userRepository.findByEmail(principal.getName()).orElse(null);
            if (user != null) {
                model.addAttribute("customerName", user.getName());
            }
        }

        return "currentRS";
    }

    // handled guest but crash the login
    @PostMapping("/book-now")
    public String bookNow(@RequestParam Integer tableId,
            @RequestParam(required = false) Integer hour,
            @RequestParam(required = false) Integer minute,
            @RequestParam String customerName,
            Model model,
            RedirectAttributes redirectAttributes,
            Principal principal) {

        if (hour == null || minute == null) {
            redirectAttributes.addFlashAttribute("errorMessage",
                    "Please choose reservation duration.");
            return "redirect:/reservations/book-now?tableId=" + tableId;
        }

        int totalMinutes = hour * 60 + minute;

        if (totalMinutes <= 0 || totalMinutes > 180) {
            model.addAttribute("errorMessage",
                    "Maximum duration for Now reservation is 3 hours.");
            model.addAttribute("tableId", tableId);
            return "currentRS";
        }

        LocalDateTime startTime = LocalDateTime.now();
        LocalDateTime endTime = startTime.plusMinutes(totalMinutes);

        try {
            String email = principal != null ? principal.getName() : null;

            reservationService.createReservation(
                    email,
                    tableId,
                    startTime,
                    endTime,
                    customerName);

        } catch (IllegalStateException e) {
            redirectAttributes.addFlashAttribute(
                    "conflictMessage",
                    e.getMessage());
            return "redirect:/reservations/book-now?tableId=" + tableId;
        }
        // this was only worked for registered users
        // return "redirect:/reservations/book-now?tableId="
        // + tableId
        // + "&success=true";

        // shwehtet/ alert for guest
        redirectAttributes.addFlashAttribute("successMessage", "Reservation created successfully!");

        // Redirect based on user type
        if (principal == null) {
            // return "redirect:/guest_dashboard"; // guest
            return "redirect:/menu?tableId=" + tableId;
        } else {
            return "redirect:/dashboard"; // logged-in
        }
    }
    
    // FUTURE RESERVATIONS PAGE
    @GetMapping("/future")
    public String futureReservations(Model model, Principal principal) {

        if (principal == null) {
            return "redirect:/login";
        }

        User user = userService.getUserByEmail(principal.getName());

        List<Reservation> future = reservationService.getFutureReservations(principal.getName());

        model.addAttribute("reservations", future);
        model.addAttribute("customerName", user.getName());

        return "future";
    }

    // FUTURE TABLE SEARCH
    @GetMapping("/future-tables")
    public String showFutureTables(
            @RequestParam String date,
            @RequestParam Integer startHour,
            @RequestParam Integer startMinute,
            @RequestParam String startAmPm,
            @RequestParam Integer endHour,
            @RequestParam Integer endMinute,
            @RequestParam String endAmPm,
            Model model,
            Principal principal) {

        if (principal == null) {
            return "redirect:/login";
        }

        // Convert to 24-hour format
        if (startAmPm.equals("PM") && startHour != 12)
            startHour += 12;
        if (startAmPm.equals("AM") && startHour == 12)
            startHour = 0;

        if (endAmPm.equals("PM") && endHour != 12)
            endHour += 12;
        if (endAmPm.equals("AM") && endHour == 12)
            endHour = 0;

        LocalDateTime start = LocalDateTime.parse(
                date + "T" +
                        String.format("%02d:%02d:00", startHour, startMinute));

        LocalDateTime end = LocalDateTime.parse(
                date + "T" +
                        String.format("%02d:%02d:00", endHour, endMinute));

        if (end.isBefore(start)) {
            return "redirect:/reservations/future";
        }

        List<RestaurantTable> tables = reservationService.findAvailableTablesForPeriod(start, end);

        model.addAttribute("tables", tables);
        model.addAttribute("startTime", start);
        model.addAttribute("endTime", end);

        return "future_table";
    }

    // FUTURE BOOK
    @PostMapping("/future-book")
    public String bookFutureTables(
            @RequestParam String tableId,
            @RequestParam String startTime,
            @RequestParam String endTime,
            RedirectAttributes redirectAttributes,
            Principal principal) {

        if (principal == null) {
            return "redirect:/login";
        }

        String[] ids = tableId.split(",");

        for (String id : ids) {
            reservationService.createFutureReservation(
                    principal.getName(),
                    Integer.parseInt(id),
                    LocalDateTime.parse(startTime),
                    LocalDateTime.parse(endTime));
        }

        redirectAttributes.addFlashAttribute(
                "successMessage",
                "Table reserved successfully!");

        return "redirect:/reservations/myReservation";
    }

    // FUTURE ACTIVE RESERVATIONS (Cancel Page)
    @GetMapping("/myReservation")
    public String futureCancel(Model model, Principal principal) {

        if (principal == null) {
            return "redirect:/login";
        }

        List<Reservation> futureReservations = reservationService.getActiveFutureReservations(principal.getName());

        List<Reservation> currentReservations = reservationService.getCurrentReservations(principal.getName());

        model.addAttribute("futureReservations", futureReservations);
        model.addAttribute("currentReservations", currentReservations);

        return "myReservation";
    }

    // CANCEL RESERVATION
    @PostMapping("/cancel/{id}")
    public String cancelReservation(
            @PathVariable Integer id,
            RedirectAttributes redirectAttributes) {

        try {

            reservationService.cancelFutureReservation(id);

            redirectAttributes.addFlashAttribute(
                    "successMessage",
                    "Reservation cancelled successfully!");

        } catch (Exception e) {

            redirectAttributes.addFlashAttribute(
                    "errorMessage",
                    e.getMessage());
        }

        return "redirect:/reservations/myReservation";
    }
}