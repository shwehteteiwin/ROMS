package com.romsproject.roms.controller;

// import com.romsproject.roms.entity.RestaurantTable;
import com.romsproject.roms.service.ReservationService;

import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tables")
public class TableRestController {

    private final ReservationService reservationService;

    public TableRestController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    
    
    // added by shwehtet Order

  @GetMapping("/my")
public List<Map<String, Object>> getMyReservedTables(Principal principal) {

    String email = principal.getName();

    return reservationService.findTablesForCurrentUser(email)
            .stream()
            .map(t -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", t.getTableId());
                map.put("displayName", "Table-" + t.getTableId());
                return map;
            })
            .collect(Collectors.toList());
}
}
